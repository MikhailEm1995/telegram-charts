export const createSvg = ({ id, width, height, children }) => {
    const svg = document.createElement('svg');
    svg.setAttribute('id', String(id));
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    children.forEach((child) => {
        svg.appendChild(child);
    });

    return svg;
};

export const createGraphPolyline = ({ id, color, coords }) => {
    const polyline = document.createElement('polyline');
    polyline.setAttribute('id', String(id));
    polyline.setAttribute('vector-effect', 'non-scaling-stroke');
    polyline.setAttribute('points', coords.join(' '));
    polyline.setAttribute('stroke', color);
    polyline.setAttribute('stroke-width', '2px');
    return polyline;
};

export const renderXRuler = () => {};

export const renderYRuler = () => {};

export const renderChartMap = () => {};

export const renderChartMapWindow = () => {};
