declare module 'hijri-date' {
    export default class HijriDate {
        constructor(date?: Date | string | number);
        getDate(): number;
        getMonth(): number;
        getFullYear(): number;
        toGregorian(): Date;
    }
}
