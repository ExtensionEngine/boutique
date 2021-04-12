import get from 'lodash/get';
import path from 'path';
import request from '@/common/api/request';

const urls = {
  import: base => path.join(base, 'import'),
  getImportTemplate: base => path.join(urls.import(base), 'template')
};

async function bulkImport(items, { baseUrl, params = {} }) {
  const options = { responseType: 'blob', params };
  const { data, headers } = await request.post(urls.import(baseUrl), items, options);
  return { data, count: parseInt(get(headers, 'data-imported-count'), 10) };
}

function getImportTemplate({ baseUrl }) {
  return request.get(urls.getImportTemplate(baseUrl), { responseType: 'blob' });
}

export default {
  bulkImport,
  getImportTemplate
};
