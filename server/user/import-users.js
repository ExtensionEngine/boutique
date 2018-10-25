'use strict';

const { createError } = require('../common/errors');
const Excel = require('exceljs');
const intoStream = require('into-stream');
const HttpStatus = require('http-status');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const { User } = require('../common/database');

const inputAttrs = ['email', 'role', 'firstName', 'lastName'];
const { CONFLICT } = HttpStatus;

function importUsers(file, origin) {
  return getUsers(file).then(users => {
    let errors = [];
    return Promise.each(users, user => {
      return createUser(pick(user, inputAttrs), { origin }).catch(err => {
        return errors.push({
          user: user.email,
          message: err.message
        });
      });
    }).then(() => {
      if (errors.length) return createSpreadsheet(errors);
      return null;
    });
  });
}

function createUser(user, origin) {
  return User.findOne({ where: { email: user.email }, paranoid: false })
    .then(existingUser => {
      if (existingUser && !existingUser.deletedAt) {
        return createError(CONFLICT, 'User already exist.');
      }
      const opts = { existingUser, origin };
      return User.invite(user, opts);
    });
}

function getUsers(file) {
  const wb = new Excel.Workbook();
  if (file.mimetype === 'text/csv') {
    return wb.csv.read(intoStream(file.buffer)).then(sheetToJson);
  }
  return wb.xlsx.load(file.buffer).then(() => {
    return sheetToJson(wb.getWorksheet(1));
  });
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

function createSpreadsheet(errors) {
  let workbook = new Excel.Workbook();
  workbook.creator = 'Boutique';
  workbook.created = new Date();
  let errorsSheet = workbook.addWorksheet('Errors');
  errorsSheet.addRow(['USER', 'MESSAGE']);
  errors.forEach(error => {
    errorsSheet.addRow([error.user, error.message]);
  });
  return workbook;
}

module.exports = { importUsers };
