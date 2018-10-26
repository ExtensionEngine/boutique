'use strict';

const pick = require('lodash/pick');
const TableSheet = require('./TableSheet');
const { Workbook } = require('exceljs');

const getUsers = async file => (await TableSheet.load(file)).toJSON();

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
