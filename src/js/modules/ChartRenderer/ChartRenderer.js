import {createGraphPolyline, createSvg, createGroup, createLine, createText} from "./render";

// _graphs { [id]: { isVisible, color, translate, scaleX, scaleY, max, coords, values } }

import './chart.pcss';

export default class ChartRenderer {
    CHART_ID = (Date.now() + Math.round(Math.random() * 1000)).toString(36);

    // predefined constants
    _PADDING_X = { left: 0, right: 0 };
    _PADDING_Y = { top: 0, bottom: 30 };
    _Y_INTERVALS_NUMBER = 6;
    _X_INTERVALS_NUMBER = 6;

    // computed on construction constants
    _MAX = -Infinity;
    _COORDS = {};
    _GRAPHS = {};
    _CONTAINER = null;
    _XS = [];
    _MIN_SCALE_FACTOR = null;

    _currentMax = -Infinity;
    _scales = {};
    _offsetFactor = 0;
    _scaleFactor = 1;
    _xValues = [];
    _yValues = [];

    // Elements
    _X_TEXTS = {
        'original': { isVisible: true, group: null },
        'clone': { isVisible: false, group: null }
    };
    _Y_TEXTS = {
        'original': { isVisible: true, group: null },
        'clone': { isVisible: false, group: null }
    };
    _CIRCLES = {};
    _INFO_POPUP = null;

    constructor({ container, xs, graphs }) {
        const { width, height } = container.getBoundingClientRect();
        this._CONTAINER = container;
        this._XS = xs;
        this._GRAPHS = graphs;
        this._MAX = this._getGraphsMaxValue(graphs);
        this._MIN_SCALE_FACTOR = this._X_INTERVALS_NUMBER / xs.length;
        this._currentMax = this._MAX;
        this._scales = this._getCurrentScales(graphs, this._currentMax);
        this._COORDS = this._getCoordsForAllGraphs({
            graphs, width, height,
            offsetX: this._PADDING_X.left, offsetY: this._PADDING_Y.bottom
        });

        this._yValues = this._getYValues(this._Y_INTERVALS_NUMBER, this._currentMax);
        this._xValues = this._getXValues(this._X_INTERVALS_NUMBER, xs, this._offsetFactor, this._scaleFactor);

        this.render();
    }

    _getGraphsMaxValue(graphs) {
        let result = -Infinity;

        Object.entries(graphs).forEach(([_, val]) => {
            if (val.max > result) result = val.max;
        });

        return result;
    }

    _getCurrentScales(graphs, divider) {
        let result = {};

        Object.entries(graphs).forEach(([key, val]) => {
            result[key] = val.max / divider;
        });

        return result;
    }

    _getCoordsForAllGraphs({ graphs, width, height, offsetX, offsetY }) {
        const result = {};

        Object.entries(graphs).forEach(([key, graph]) => {
            result[key] = this._getCoords({ graph, width, height, offsetX, offsetY});
        });

        return result;
    }

    _getCoords({ graph, width, height, offsetX, offsetY }) {
        const { max, values } = graph;
        const multiplier = (height - offsetY) / max;
        const pointsNumber = values.length;
        const xInterval = width * (1 + pointsNumber) / Math.pow(pointsNumber, 2);

        return values.map((value, i) => ({
            x: xInterval * i + offsetX,
            y: height - (value * multiplier + offsetY)
        }));
    }

    _getYValues(intervalsNumber, max) {
        let dividableMax = max;
        let stepSize = 0;

        while (dividableMax % intervalsNumber !== 0) {
            dividableMax += 1;
        }

        stepSize = dividableMax / intervalsNumber;

        return new Array(intervalsNumber).fill(0)
          .map((_, i) => stepSize * i);
    }

    _getXValues(intervalsNumber, xs, offsetFactor, scaleFactor) {
        const xsLength = xs.length;
        const stepSize = Math.round(xsLength * scaleFactor / intervalsNumber);
        const firstIdx = Math.round(xsLength * offsetFactor);

        return new Array(intervalsNumber).fill(stepSize).map((step, i) => xs[firstIdx + step * i]);
    }

    render() {
        const { width, height } = this._CONTAINER.getBoundingClientRect();
        let children = [];
        const graphs = this._getGraphs();
        const grid = this._getGrid({ width, height });
        const yValues = this._getYTexts({ height });
        const xValues = this._getXTexts({ width, height });

        this._setGraphsNodes(graphs);
        this._setYTexts(yValues);
        this._setXTexts(xValues);

        children = [grid].concat(graphs).concat(yValues).concat(xValues);

        const svg = createSvg({ id: this.CHART_ID, width, height, children });
        this._CONTAINER.appendChild(svg);
    }

    _getGraphs() {
        return Object.entries(this._COORDS).map(([id, coords]) => {
            const color = this._GRAPHS[id].color;
            const formattedCoords = coords.map(obj => [obj.x, obj.y]);
            const polyline = createGraphPolyline({ id, coords: formattedCoords, color });

            polyline.setAttribute('transform', `scale(1, ${this._scales[id]})`);
            
            return polyline;
        });
    }

    _setGraphsNodes(graphs) {
        graphs.forEach((graph) => {
            this._GRAPHS[graph.id].node = graph;
        });
    }

    _setYTexts([originalGroup, cloneGroup]) {
        this._Y_TEXTS.original.group = originalGroup;
        this._Y_TEXTS.clone.group = cloneGroup;
    }

    _setXTexts([originalGroup, cloneGroup]) {
        this._X_TEXTS.original.group = originalGroup;
        this._X_TEXTS.clone.group = cloneGroup;
    }

    _getGrid({ width, height }) {
        const Y_OFFSET = this._PADDING_Y.bottom;
        const COLOR = '#bbbbcc';
        const INTERVAL = (height - Y_OFFSET) / this._Y_INTERVALS_NUMBER;
        const lines = new Array(this._Y_INTERVALS_NUMBER).fill(0).map((_, i) => {
            return {
                color: COLOR,
                x1: 0, y1: height - (Y_OFFSET + INTERVAL * i),
                x2: width, y2: height - (Y_OFFSET + INTERVAL * i)
            };
        });

        return createGroup({ id: `${this.CHART_ID}_grid`, children: lines.map(createLine) });
    }

    _getYTexts({ height }) {
        const Y_OFFSET = this._PADDING_Y.bottom;
        const INTERVAL = (height - Y_OFFSET) / this._Y_INTERVALS_NUMBER;
        const texts = this._yValues.map((text, i) => ({
                text,
                x: 0, y: height - (INTERVAL * i + Y_OFFSET + 10)
        }));
        const hiddenTexts = new Array(6).fill('').map((text, i) => (createText({
            text,
            x: 0, y: height - (INTERVAL * i + Y_OFFSET + 10)
        })));
        const hiddenTextsGroup = createGroup({ id: `${this.CHART_ID}_ysClone`, children: hiddenTexts });
        hiddenTextsGroup.setAttribute('style', 'fill:transparent;translateY(-50px)');

        return [
            createGroup({ id: `${this.CHART_ID}_ys`, children: texts.map(createText) }),
            hiddenTextsGroup
        ];
    }

    _getXTexts({ width, height }) {
        const intervals = this._X_INTERVALS_NUMBER;
        const leftPad = 25;
        const rightPad = 30;
        const bottomPad = 10;

        // TODO придумать формулу получше
        const INTERVAL = width * (1 + intervals) / Math.pow(intervals, 2) - (rightPad + leftPad) / intervals;
        const texts = this._xValues.map((text, i) => (createText({
            text,
            y: height - bottomPad,
            x: INTERVAL * i + leftPad
        })));
        const hiddenTexts = new Array(6).fill('').map((text, i) => (createText({
            text,
            y: height - bottomPad,
            x: INTERVAL * i + leftPad
        })));
        const hiddenTextsGroup = createGroup({ id: `${this.CHART_ID}_xsClone`, children: hiddenTexts });
        hiddenTextsGroup.setAttribute('style', 'fill:transparent;transform:translateX(-100px)');

        return [
            createGroup({ id: `${this.CHART_ID}_xs`, children: texts }),
            hiddenTextsGroup
        ];
    }

    setGraphInvisible(graphId) {
        const graph = this._GRAPHS[graphId];
        graph.isVisible = false;
        graph.node.style.display = 'none';

        if (graph.max === this._currentMax) {
            this.update();
        }
    }

    setGraphVisible(graphId) {
        const graph = this._GRAPHS[graphId];
        graph.isVisible = true;
        graph.node.style.display = 'inline';

        if (graph.max > this._currentMax) {
            this._updateGraphsVisibility();
        }
    }

    setOffsetFactor(val) {
        this._offsetFactor = val;

        this._updateOffset();
    }

    setScaleFactor(val) {
        this._scaleFactor = val;

        this._updateScale();
    }

    getMinScale() {
        return this._MIN_SCALE_FACTOR;
    }

    _updateGraphsVisibility() {
        const currentMax = this._getCurrentMax();
    
        if (currentMax > this._currentMax) {
            this._currentMax = currentMax;
            this._scales = this._getCurrentScales(this._GRAPHS, currentMax);
            this._yValues = this._getYValues(this._Y_INTERVALS_NUMBER, this._currentMax);

            this._redrawYValues();
        }
    }

    _redrawYValues() {
        Object.entries(this._Y_TEXTS).forEach((key, { isVisible, group }) => {
            const onAnimationEnd = () => {
                group.transform.getItem(0).setTranslate(0, -50);
                group.removeEventListener('animationend', onAnimationEnd);
            };
            if (isVisible) {
                group.addEventListener('animationend', onAnimationEnd);
                group.transform.getItem(0).setTranslate(0, 50);
                group.style.opacity = 0;
            } else {
                group.transform.getItem(0).setTranslate(0, 0);
                group.style.opacity = 1;
            }

            this._Y_TEXTS[key].isVisible = !this._Y_TEXTS[key].isVisible;
        });
    }

    _updateOffset() {
        
    }

    _updateScale() {

    }

    _getCurrentMax() {
        return this._GRAPHS.reduce(
            (acc, { max, isVisible }) => isVisible ? (acc > max ? acc : max) : acc,
            this._currentMax
        );
    }
}

const xs = new Array(20).fill(0).map((_, i) => {
    return i < 31 ?
      `Mar ${i + 1}` :
      `Apr ${i - 30}`;
});
const graphs = {
    'line1': {
        color: '#ee5544',
        values: new Array(20).fill(0).map(() => {
            const rand = Math.round(Math.random() * 100);
            return rand > 90 ? 90 : rand;
        }),
        max: 90
    },
    'line2': {
        color: '#eecc55',
        values: new Array(20).fill(0).map(() => {
            const rand = Math.round(Math.random() * 100);
            return rand > 77 ? 77 : rand;
        }),
        max: 77
    },
    'line3': {
        color: '#55aadd',
        values: new Array(20).fill(0).map(() => {
            const rand = Math.round(Math.random() * 100);
            return rand > 83 ? 83 : rand;
        }),
        max: 83
    }
};
const container = document.getElementById('container');

new ChartRenderer({ container, xs, graphs });
