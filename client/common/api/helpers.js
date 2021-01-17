import get from 'lodash/get';

export function extractData(res) {
  return res.data.data;
}

export function processParams(opts) {
  const page = get(opts, 'page', 1);
  const limit = get(opts, 'itemsPerPage', 100);
  const params = {
    sortBy: (opts.sortBy && opts.sortBy[0]) || 'id',
    sortOrder: (opts.sortDesc && opts.sortDesc[0]) ? 'DESC' : 'ASC',
    offset: (page - 1) * limit,
    limit: limit === -1 ? null : limit
  };
  if (opts.filter) params.filter = opts.filter;
  if (opts.archived) params.archived = opts.archived;
  return Object.assign(params, opts.params);
}
