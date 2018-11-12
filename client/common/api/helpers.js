import get from 'lodash/get';

export function extractData(res) {
  return res.data.data;
}

export function processParams(opts) {
  const page = get(opts, 'page', 1);
  const limit = get(opts, 'rowsPerPage', 100);
  const params = {
    sortBy: opts.sortBy || 'id',
    sortOrder: opts.descending ? 'DESC' : 'ASC',
    offset: (page - 1) * limit,
    limit: limit === -1 ? null : limit
  };
  if (opts.filter) params.filter = opts.filter;
  return Object.assign(params, opts.params);
}
