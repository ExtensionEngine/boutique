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

function createWorkbook(errors) {
  let workbook = new Excel.Workbook();
  workbook.creator = 'Boutique';
  workbook.created = new Date();
  let errorsSheet = workbook.addWorksheet('Errors');
  errors.forEach(error => errorsSheet.addRow([error]));
  return workbook;
}

function sheetToJson(sheet) {
  let headers = [];
  let users = [];
  sheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return row.eachCell(cell => headers.push(cell.value));
    let properties = [];
    let user = {};
    row.eachCell((cell, cellIndex) => properties.push(cell.value));
    properties.forEach((it, index) => (user[headers[index]] = it));
    users.push(user);
  });
  return users;
}

module.exports = { createWorkbook, getUsers };
