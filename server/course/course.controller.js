'use strict';

const { Course } = require('../common/database');
const config = require('../config');
const createStorage = require('../common/storage');
const find = require('lodash/find');
const forEach = require('lodash/forEach');
const pick = require('lodash/pick');

const Storage = createStorage(config.storage);
const outputAttributes =
  ['id', 'sourceId', 'programLevelId', 'name', 'updatedAt'];
const processInput = input => pick(input, ['sourceId', 'programLevelId']);
const processOutput = output => pick(output, outputAttributes);

function list({ query: { programLevelId } }, res) {
  return Course.findAll({ where: { programLevelId },
    attributes: outputAttributes })
    .then(courses => {
      return Storage.getCatalog().then(data => {
        forEach(courses, course => {
          course.dataValues.publishedAt =
            find(data, { id: course.sourceId }).publishedAt;
        });
        return res.jsend.success(courses);
      });
    });
}

function getCatalog(req, res) {
  return Storage.getCatalog()
    .then(data => res.jsend.success(data));
}

function create({ body }, res) {
  const data = processInput(body);
  const attributes =
    ['uid', 'schema', 'name', 'structure', 'description'];
  return Storage.getRepository(data.sourceId)
    .then(repository => {
      Object.assign(data, pick(repository, attributes));
      Storage.syncRepository(data);
      data.structure = JSON.stringify(data.structure);
      return Course.create(data)
        .then(course => {
          const courseData = processOutput(course);
          courseData.publishedAt = repository.publishedAt;
          return res.jsend.success(courseData);
        });
    });
}

function syncCourse(req, res) {
  const data = pick(req.body, ['courseId', 'sourceId', 'programLevelId']);
  const attributes =
    ['uid', 'schema', 'name', 'structure', 'description'];
  Course.findById(data.courseId)
    .then(course => {
      return Storage.getRepository(course.sourceId)
        .then(repository => {
          Object.assign(data, pick(repository, attributes));
          Storage.syncRepository(data);
          data.structure = JSON.stringify(data.structure);
          course.update(data);
          const courseData = processOutput(course);
          courseData.publishedAt = repository.publishedAt;
          return res.jsend.success(courseData);
        });
    });
}

module.exports = {
  list,
  getCatalog,
  create,
  syncCourse
};
