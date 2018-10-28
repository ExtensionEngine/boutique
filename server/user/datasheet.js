'use strict';

const { extname } = require('path');
const { Workbook } = require('exceljs');
const intoStream = require('into-stream');
const Worksheet = require('exceljs/dist/es5/doc/worksheet');

const isCsv = file => file.mimetype === 'text/csv';
const isString = arg => typeof arg === 'string';

Object.assign(Workbook.prototype, {
  addSheet(sheet) {
    const id = this.nextId;
    const lastOrderNo = getLastOrderNo(this._worksheets);
    Object.assign(sheet, {
      id,
      name: sheet.name || `Sheet${id}`,
      orderNo: lastOrderNo + 1,
      _workbook: this
    });
    this._worksheets[id] = sheet;
    return this;
  },
  download(res, { filename }) {
    res.attachment(filename);
    const type = extname(filename).substring(1);
    const writer = this[type] || this.xlsx;
    return writer.write(res);
  }
});

class Datasheet extends Worksheet {
  constructor(options = {}) {
    super(options);
    const { name, columns, data } = options;
    this.name = name;
    if (columns) this._setupHeader(columns);
    if (data) data.forEach(record => this.addRow(record));
  }

  _setupHeader(columns) {
    this.columns = Object.keys(columns).map(key => {
      let config = columns[key];
      config = isString(config) ? { header: config } : config;
      return { ...config, key };
    });
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

  static fromWorksheet(sheet) {
    return Object.assign(new this(), sheet);
  }

  static async load(file) {
    const wb = new Workbook();
    if (isCsv(file)) {
      const ws = await wb.csv.read(intoStream(file.buffer));
      return this.fromWorksheet(ws);
    }
    await wb.xlsx.load(file.buffer);
    const ws = wb.getWorksheet(1);
    return this.fromWorksheet(ws);
  }

  toWorkbook(options = {}) {
    return Object.assign(new Workbook(), options).addSheet(this);
  }
}

module.exports = Datasheet;

function getLastOrderNo(sheets) {
  return Math.max(...sheets.map(it => it ? it.orderNo : 0));
}
