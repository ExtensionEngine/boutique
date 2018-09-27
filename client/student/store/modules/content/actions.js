import generateActions from '@/common/store/helpers/actions';
const { fetch, setApiUrl: SetApiUrl } = generateActions('');

const setApiUrl = (context, { cohortId }) => {
  return SetApiUrl(context, `/cohorts/${cohortId}/content`);
};

export { fetch, setApiUrl };
