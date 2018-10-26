'use strict';

const { Workbook } = require('exceljs');
const TableSheet = require('./TableSheet');
const intoStream = require('into-stream');
const pick = require('lodash/pick');
class ImportErrors {
  constructor() {
    this.errors = [];
  }

  add(user, message) {
    this.errors.push({ user, message });
  }

  get() {
    const userAttrs = ['email', 'firstName', 'lastName'];
    return this.errors.map(it => {
      return { ...pick(it.user, userAttrs), message: it.message };
    });
  }
}

function getUsers(file) {
  const wb = new Workbook();
  if (file.mimetype === 'text/csv') {
    return wb.csv.read(intoStream(file.buffer))
      .then(ws => new TableSheet(ws)).then(ts => ts.toJSON());
  }
  return wb.xlsx.load(file.buffer)
    .then(() => new TableSheet(wb.getWorksheet(1))).then(ts => ts.toJSON());
}

function createWorkbook(data) {
  const wb = new Workbook();
  wb.creator = 'Boutique';
  wb.created = new Date();
  const ws = wb.addWorksheet('Sheet 1');
  ws.columns = [
    { header: 'Email', key: 'email', width: 30 },
    { header: 'First Name', key: 'firstName', width: 30 },
    { header: 'Last Name', key: 'lastName', width: 30 },
    { header: 'Error', key: 'message', width: 30 }
  ];
  data.forEach(it => ws.addRow(it));
  return wb;
}

module.exports = { createWorkbook, getUsers, ImportErrors };
