'use strict';

const { MemberRole } = require('../../common/config');
const { Model } = require('sequelize');
const { restoreOrCreate } = require('../common/database/restore');

class UserGroupMember extends Model {
  static fields({ DATE, ENUM, INTEGER }) {
    return {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: INTEGER,
        field: 'user_id'
      },
      userGroupId: {
        type: INTEGER,
        field: 'user_group_id'
      },
      role: {
        type: ENUM(Object.values(MemberRole))
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    };
  }

  static associate({ User, UserGroup }) {
    this.belongsTo(User, {
      foreignKey: { name: 'userId', field: 'user_id' }
    });
    this.belongsTo(UserGroup, {
      foreignKey: { name: 'userGroupId', field: 'user_group_id' }
    });
  }

  static options() {
    return {
      modelName: 'userGroupMember',
      tableName: 'user_group_member',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static hooks() {
    return {
      async afterCreate({ userId: learnerId, userGroupId }) {
        const OfferingUserGroup = this.sequelize.model('OfferingUserGroup');
        const Enrollment = this.sequelize.model('Enrollment');
        const where = { userGroupId };
        const enrollments = await OfferingUserGroup.findAll({ where })
          .map(({ enrollmentOfferingId }) => ({ learnerId, enrollmentOfferingId }));
        return Enrollment.bulkCreate(enrollments);
      },
      async afterUpdate(member) {
        const isRestored = member.changed('deletedAt') && !member.deletedAt;
        if (isRestored) return this.restoreEnrollments(member);
        const isUserChanged = member.changed('userId');
        if (!isUserChanged) return;
        const { userId: oldLearnerId } = member._previousDataValues;
        const { userId: learnerId, userGroupId } = member;
        const OfferingUserGroup = this.sequelize.model('OfferingUserGroup');
        const Enrollment = this.sequelize.model('Enrollment');
        const offeringIds = await OfferingUserGroup.findAll({ where: { userGroupId } })
          .map(({ enrollmentOfferingId }) => enrollmentOfferingId);
        const where = { learnerId: oldLearnerId, enrollmentOfferingId: offeringIds };
        return Enrollment.update({ learnerId }, { where });
      },
      async afterDestroy(member) {
        const { userId: learnerId, userGroupId } = member;
        const OfferingUserGroup = this.sequelize.model('OfferingUserGroup');
        const Enrollment = this.sequelize.model('Enrollment');
        const offeringIds = await OfferingUserGroup.findAll({ where: { userGroupId } })
          .map(({ enrollmentOfferingId }) => enrollmentOfferingId);
        const where = { learnerId, enrollmentOfferingId: offeringIds };
        return Enrollment.destroy({ where });
      }
    };
  }

  static scopes({ User }) {
    return {
      user: options => ({ include: { model: User, ...options } })
    };
  }

  static withUser(options = {}) {
    const defaultAttrs = ['id', 'email', 'firstName', 'lastName', 'fullName', 'label'];
    if (!options.attributes) options.attributes = defaultAttrs;
    return this.scope({ method: ['user', options] });
  }

  static async restoreOrCreate(userGroupMember, options) {
    return restoreOrCreate(this, userGroupMember, options);
  }

  static async restoreEnrollments({ userId, userGroupId }) {
    const OfferingUserGroup = this.sequelize.model('OfferingUserGroup');
    const Enrollment = this.sequelize.model('Enrollment');
    const offeringIds = await OfferingUserGroup.findAll({ where: { userGroupId } })
      .map(({ enrollmentOfferingId }) => enrollmentOfferingId);
    const where = { learnerId: userId, enrollmentOfferingId: offeringIds };
    return Enrollment.update({ deletedAt: null }, { where, paranoid: false });
  }

  isInstructor() {
    return this.role === MemberRole.INSTRUCTOR;
  }
}

module.exports = UserGroupMember;
