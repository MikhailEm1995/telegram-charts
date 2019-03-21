export const SCROLL_RIGHT = 'SCROLL_RIGHT';
export const SCROLL_LEFT = 'SCROLL_LEFT';
export const SCALE_DOWN_RTL = 'SCALE_DOWN_RTL';
export const SCALE_DOWN_LTR = 'SCALE_DOWN_LTR';
export const SCALE_UP_RTR = 'SCALE_UP_RTR';
export const SCALE_UP_LTL = 'SCALE_UP_LTL';

export default class ChartXValuesRenderer {
    state = null;

    _svgContainer = null;
    _values = [];
    _width = 0;
    _bottomMargin = 0;

    _visibleValues = [];

    constructor({ svg, values, width, bottom }) {
        this._svgContainer = svg;
        this._values = values;
        this._width = width;
        this._bottom = bottom;

        this.render();
    }

    render() {

    }

    scaleUp() {}

    scaleDown() {}

    scrollLeft() {}

    scrollRight() {}

    update(updateType, factor) {

    }
}