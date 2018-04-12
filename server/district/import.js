const { forIn, groupBy } = require('lodash');
const { District, School } = require('../common/database');
const parseCsv = require('../common/util/csv');

async function importDistrict(schools, key) {
  const ncesId = +key;
  let [district] = await District.findOrBuild({ where: { ncesId } });
  await district.update({
    name: schools[0]['LEA_NAME'],
    ncesId
  });
  return schools.forEach(school => importSchool(school, district));
}

async function importSchool(data, district) {
  const ncesId = +data['SCHID'];
  let [school] = await School.findOrBuild({ where: { ncesId } });

  return school.update({
    districtId: district.id,
    name: data['SCH_NAME'],
    ncesId,
    ncesSchoolLevel: +data['LEVEL'] || 0,
    ncesStatus: +data['SY_STATUS'] || 0,
    ncesType: +data['SCH_TYPE'] || 0,
    state: data['STABR']
  });
}

module.exports = async function (filePath) {
  const data = await parseCsv(filePath);
  const districts = groupBy(data, 'LEAID');
  return forIn(districts, importDistrict);
};
