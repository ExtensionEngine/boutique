'use strict';

const intoStream = require('into-stream');
const { Workbook } = require('exceljs');
const Worksheet = require('exceljs/dist/es5/doc/worksheet');

class TableSheet {
  constructor(sheet) {
    Object.assign(this, sheet);
  }

  get headers() {
    return this.getRow(1).values.slice(1);
  }

  get rows() {
    return this.getSheetValues().slice(2);
  }

  toJSON() {
    const keys = this.headers;
    return this.rows.map(cells => {
      return cells.slice(1).reduce((acc, val, i) => {
        return Object.assign(acc, { [keys[i]]: val });
      }, {});
    });
  }

  static load(file) {
    const wb = new Workbook();
    if (file.mimetype === 'text/csv') {
      return wb.csv.read(intoStream(file.buffer))
        .then(ws => new TableSheet(ws));
    }
    return wb.xlsx.load(file.buffer)
      .then(() => new TableSheet(wb.getWorksheet(1)));
  }
}

Object.defineProperties(
  TableSheet.prototype,
  Object.getOwnPropertyDescriptors(Worksheet.prototype)
);

module.exports = TableSheet;
