const forIn = require('lodash/forIn');
const get = require('lodash/get');
const groupBy = require('lodash/groupBy');
const Promise = require('bluebird');
const { District, School } = require('../common/database');
const { getEnum } = require('../school/enums');
const parseCsv = require('../common/util/csv');

async function importDistrict(schools, id) {
  let [district] = await District.findOrBuild({ where: { id } });
  await district.update({
    id,
    name: get(schools, '[0].LEA_NAME')
  });
  return Promise.map(schools, school => importSchool(school, district));
}

async function importSchool(data, district) {
  const id = get(data, 'SCHID');
  let [school] = await School.findOrBuild({ where: { id } });

  return school.update({
    id,
    districtId: district.id,
    name: get(data, 'SCH_NAME'),
    level: getEnum('level', data.LEVEL),
    state: get(data, 'STABR'),
    status: getEnum('status', data.SY_STATUS),
    type: getEnum('type', data.SCH_TYPE)
  });
}

module.exports = async function (filePath) {
  const data = await parseCsv(filePath);
  const districts = groupBy(data, 'LEAID');
  return forIn(districts, importDistrict);
};
