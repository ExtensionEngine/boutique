'use strict';

const Excel = require('exceljs');
const intoStream = require('into-stream');

function getUsers(file) {
  const wb = new Excel.Workbook();
  if (file.mimetype === 'text/csv') {
    return wb.csv.read(intoStream(file.buffer)).then(sheetToJson);
  }
  return wb.xlsx.load(file.buffer).then(() => sheetToJson(wb.getWorksheet(1)));
}

function createWorkbook(data) {
  const wb = new Excel.Workbook();
  wb.creator = 'Boutique';
  wb.created = new Date();
  const ws = wb.addWorksheet('Sheet 1');
  data.forEach(it => ws.addRow([it]));
  return wb;
}

function sheetToJson(sheet) {
  const headers = [];
  const data = [];
  sheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return row.eachCell(cell => headers.push(cell.value));
    const properties = [];
    const it = {};
    row.eachCell((cell, cellIndex) => properties.push(cell.value));
    properties.forEach((prop, index) => (it[headers[index]] = prop));
    data.push(it);
  });
  return data;
}

module.exports = { createWorkbook, getUsers };
