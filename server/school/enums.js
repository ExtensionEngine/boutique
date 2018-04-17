const enums = {
  level: ['PRIMARY', 'MIDDLE', 'HIGH', 'OTHER'],
  status: ['OPEN', 'CLOSED', 'NEW', 'UNREPORTED', 'CHANGED_AGENCY', 'INACTIVE', 'FUTURE', 'REOPENED'],
  type: ['REGULAR', 'SPECIAL', 'VOCATIONAL', 'ALTERNATIVE', 'REPORTABLE']
};

function getEnum(type, position) {
  const index = parseInt(position, 10);
  return enums[type][index - 1];
}

module.exports = {
  enums,
  getEnum
};
