import { LINE, X } from '_constants/charts';
import { NO_X_AXIS, INVALID_COLUMN, INVALID_CONFIG } from '_constants/errors';

import { extractDateInfoFromMS } from '_js/utils/formatTime';

export default class ConfigFormatter {
    _config = null;
    _axisValues = null;
    _graphs = null;

    constructor(data) {
        this._config = data;
        const xAxisName = this._safelyGetXAxis(data.types);
        this._axisValues = this._safelyGetAxisValues(xAxisName, data.columns);
        this._graphs = this._getGraphs(data);

        if (!this._isGraphsValid(this.graphs)) throw new Error(INVALID_CONFIG);
    }

    _safelyGetXAxis(types) {
        const xAxisName = this.getXAxis(types);

        if (xAxisName === null) throw new Error(NO_X_AXIS);

        return xAxisName;
    }

    _getXAxis(types = []) {
        const entry = Object.entries(types)
            .find(entry => entry.type === X);

        return entry === undefined ? null : entry[0];
    }

    _safelyGetAxisValues(axisName, columns) {
        const axisValues = this.getAxisValues(axisName, columns);

        if (axisValues === undefined) throw new Error(INVALID_COLUMN);

        return axisValues.slice(1).map((val) => {
            const { day, month } = extractDateInfoFromMS(val);
            return `${month} ${day}`;
        });
    }

    _getAxisValues(axisName, columns) {
        return columns.find(graph => graph[0] === axisName);
    }

    _getGraphs({ colors, names, types, columns }) {
        return Object.entries(names)
            .map(([key, name]) => {
                const values = columns.find(column => column[0] === key).slice(1);
                return {
                    name,
                    values,
                    color: colors[key],
                    type: types[key],
                    max: Math.max.apply(null, values),
                    min: Math.min.apply(null, values)
                };
            });
    }

    _isGraphsValid(graphs) {
        return graphs.every(({ values, color, type, max, min }) => {
            return Array.isArray(values) &&
                !Number.isNaN(min) && !Number.isNaN(max) &&
                this.isValidColor(color) && this.isValidType(type);
        });
    }

    _isValidColor(color) {
        return String(color)[0] === '#' && String(color).length === 7;
    }

    _isValidType(type) {
        return type === X || type === LINE;
    }

    get axisValues() {
        return this._axisValues;
    }

    get graphs() {
        return this._graphs;
    }
}
