const { create } = require('../util/enum');

const Level = create('PRIMARY', 'MIDDLE', 'HIGH', 'OTHER');
const Status = create('OPEN', 'CLOSED', 'NEW', 'UNREPORTED', 'CHANGED_AGENCY', 'INACTIVE', 'FUTURE', 'REOPENED');
const Type = create('REGULAR', 'SPECIAL', 'VOCATIONAL', 'ALTERNATIVE', 'REPORTABLE');

module.exports = {
  Level,
  Status,
  Type
};
