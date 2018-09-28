export function extractData(res) {
  return res.data.data;
}

export function processParams(queryParams) {
  const params = {
    sortBy: queryParams.sortBy || 'id',
    sortOrder: queryParams.descending ? 'DESC' : 'ASC',
    offset: (queryParams.page - 1) * queryParams.rowsPerPage,
    limit: queryParams.rowsPerPage
  };
  if (queryParams.filter) params.filter = queryParams.filter;
  return params;
}
