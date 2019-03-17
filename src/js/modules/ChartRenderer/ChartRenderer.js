// [{ id, isVisible, color, translate, scaleX, scaleY, max, coords, values }]

export default class ChartRenderer {
    _graphs = [];
    _MAX = -Infinity;
    _xValues = [];  
    _yValues = [];
    xInterval = 2;
    yInterval = null;
    _chartMapWindowWidth = 0.12;
    _chartMapWindowOffset = 0;

    constructor({ container, width, height, xValues, graphs }) {
        this._graphs = graphs;
        this._MAX = this._getMaxValue();
    }

    _getMaxValue() {
        this.graphs.forEach((graph) => {
            graph.max = Math.max(...graph.values);
            if (graph.max > this._MAX) this._MAX = graph.max;
        });
    }

    render() {}

    update() {}

    set yInterval(val) {
        this.yInterval = val;
        this._calcScalesForGraphs();
        this._calcYAxisValues();
    }

    set xInterval(val) {
        this.xInterval = val;
        this._calcScalesForGraphs();
        this._calcXAxisValues();
    }

    _calcScaledGraphsValues() {}

    _calcScalesForGraphs() {}

    _calcXAxisValues() {}

    _calcYAxisValues() {}

    toggleGraph(graphIdx) {
        this._graphs[graphIdx].isVisible = !this._graphs[graphIdx].isVisible;
        this._calcYAxisValues();
        this._calcScalesForGraphs();
    }

    moveChartMapWindowBy(offset = 0) {
        if (offset <= 0 || offset + this._chartMapWindowWidth > 1) return;
        this._chartMapWindowOffset = offset;
    }

    resizeChartMapWindow(width = 0.12, offset = 0) {
        if (
            offset <= 0 ||
            offset + this._chartMapWindowWidth > 1 ||
            width <= 0.12 ||
            width > 1
        ) return;
        this._chartMapWindowOffset = offset;
        this._chartMapWindowWidth = width;
    }
}
