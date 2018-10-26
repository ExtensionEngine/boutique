'use strict';

const Worksheet = require('exceljs/dist/es5/doc/worksheet');

class TableSheet {
  constructor(sheet) {
    Object.assign(this, sheet);
  }

  toJSON() {
    const keys = this.getRow(1).values.slice(1);
    const rows = this.getSheetValues().slice(2);
    return rows.reduce((acc, val) => {
      return acc.concat(val.slice(1).reduce((acc, val, i) => {
        return Object.assign(acc, { [keys[i]]: val });
      }, {}));
    }, []);
  }
}

Object.defineProperties(
  TableSheet.prototype,
  Object.getOwnPropertyDescriptors(Worksheet.prototype)
);

module.exports = TableSheet;
