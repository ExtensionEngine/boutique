import { extractData, processParams } from '@/common/api/helpers';
import path from 'path';
import request from '@/common/api/request';

const urls = {
  root: id => path.join('offerings', String(id), 'user-groups'),
  resource: ({ id, offeringId }) => path.join(urls.root(offeringId), String(id))
};

function fetch(offeringId, params = {}) {
  return request.get(urls.root(offeringId), { params: processParams(params) })
    .then(extractData);
}

function create(item) {
  return request.post(urls.root(item.offeringId), item).then(extractData);
}

function remove(item) {
  return request.delete(urls.resource(item), item).then(extractData);
}

export default {
  fetch,
  create,
  remove
};
