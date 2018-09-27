import generateActions from '@/common/store/helpers/actions';

const { get, setApiUrl: SetApiUrl } = generateActions('/cohorts/0/content/0/container');

const setApiUrl = (context, { cohortId = 0, courseId = 0 }) => {
  return SetApiUrl(context, `/cohorts/${cohortId}/content/${courseId}/container`);
};

export { get, setApiUrl };
