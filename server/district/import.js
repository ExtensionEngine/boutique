const forIn = require('lodash/forIn');
const get = require('lodash/get');
const groupBy = require('lodash/groupBy');
const Promise = require('bluebird');
const { District, School } = require('../common/database');
const parseCsv = require('../common/util/csv');

async function importDistrict(schools, key) {
  const ncesId = key;
  let [district] = await District.findOrBuild({ where: { ncesId } });
  await district.update({
    name: get(schools, '[0].LEA_NAME'),
    ncesId
  });
  return Promise.map(schools, school => importSchool(school, district));
}

async function importSchool(data, district) {
  const ncesId = get(data, 'SCHID');
  let [school] = await School.findOrBuild({ where: { ncesId } });

  return school.update({
    districtId: district.id,
    name: get(data, 'SCH_NAME'),
    ncesId,
    ncesSchoolLevel: get(data, 'LEVEL', 0),
    ncesStatus: get(data, 'SY_STATUS', 0),
    ncesType: get(data, 'SCH_TYPE', 0),
    state: get(data, 'STABR')
  });
}

module.exports = async function (filePath) {
  const data = await parseCsv(filePath);
  const districts = groupBy(data, 'LEAID');
  return forIn(districts, importDistrict);
};
