import {
    JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC
} from '_constants/months';

const monthsOrdered = [JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC];

export const getMonthFromNumber = month => (
    month < 0 ?
    JAN :
    month > 11 ?
    DEC :
    monthsOrdered[month]
);

const date = new Date();
export const extractDateInfoFromMS = (ms) => {
    date.setTime(ms);

    return {
        day: date.getDate(),
        month: getMonthFromNumber(date.getMonth()),
        year: date.getFullYear()
    };
};