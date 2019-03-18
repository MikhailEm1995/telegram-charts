import { attrs } from '../../utils/dom';

const CHART_CLASSNAME = 'chart';
const GRAPH_CLASSNAME = `${CHART_CLASSNAME}__graph`;
const LINE_CLASSNAME = `${CHART_CLASSNAME}__line`;
const TEXT_CLASSNAME = `${CHART_CLASSNAME}__text`;

export const createSvg = ({ id, width, height, children }) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    attrs(svg, {
        'id': String(id),
        'class': CHART_CLASSNAME,
        'version': '1.1',
        'shape-rendering': 'auto',
        'viewBox': `0 0 ${width} ${height}`,
        'preserveAspectRatio': 'xMidYMin meet'
    });

    children.forEach((child) => {
        svg.appendChild(child);
    });

    return svg;
};

export const createGraphPolyline = ({ id, color, coords }) => {
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

    attrs(polyline, {
        'id': String(id),
        'class': GRAPH_CLASSNAME,
        'vector-effect': 'non-scaling-stroke',
        'points': coords.join(' '),
        'stroke': color,
        'fill': 'none',
        'stroke-width': '2.3px'
    });

    return polyline;
};

export const createLine = ({ color, x1, y1, x2, y2 }) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    attrs(line, {
        'class': LINE_CLASSNAME,
        'stroke': color,
        'stroke-width': '1px',
        'opacity': '0.5',
        'x1': x1,
        'y1': y1,
        'x2': x2,
        'y2': y2
    });

    return line;
};

export const createText = ({ text, x, y }) => {
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    attrs(textEl, {
        'class': TEXT_CLASSNAME,
        'x': x,
        'y': y
    });
    textEl.textContent = text;

    return textEl;
};
