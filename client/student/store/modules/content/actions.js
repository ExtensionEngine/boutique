import generateActions from '@/common/store/helpers/actions';
const { fetch, setApiUrl: SetApiUrl } = generateActions('/cohorts/0/content');

const setApiUrl = (context, { cohortId = 0 }) => {
  return SetApiUrl(context, `/cohorts/${cohortId}/content`);
};

export { fetch, setApiUrl };
