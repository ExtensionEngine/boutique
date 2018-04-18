const forIn = require('lodash/forIn');
const groupBy = require('lodash/groupBy');
const Promise = require('bluebird');
const { District, School } = require('../common/database');
const { Level, Status, Type } = require('../../common/constants/school');
const parseCsv = require('../common/util/csv');

const upsert = async (Model, updates = {}) => {
  const { id } = updates;
  const [instance] = await Model.findOrBuild({ where: { id } });
  return instance.update(updates);
};

async function importDistrict(schools, id) {
  const [school] = schools;
  const district = await upsert(District, { id, name: school.LEA_NAME });

  return Promise.map(schools, school => importSchool(school, district));
}

async function importSchool(data, district) {
  return upsert(School, {
    id: data.SCHID,
    districtId: district.id,
    name: data.SCH_NAME,
    level: Level.fromPosition(data.LEVEL),
    state: data.STABR,
    status: Status.fromPosition(data.SY_STATUS),
    type: Type.fromPosition(data.SCH_TYPE)
  });
}

module.exports = async function (filePath) {
  const data = await parseCsv(filePath);
  const districts = groupBy(data, 'LEAID');
  return forIn(districts, importDistrict);
};
