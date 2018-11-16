export default function uniqueProp(prop, { message, search, ...options } = {}) {
  const {
    getMessage = () => message,
    isChanged = (value, oldValue) => value !== oldValue,
    deleted = false
  } = options;
  return {
    getMessage,
    validate: async (value, [options]) => {
      let { where, initialValue } = options || {};
      where = { ...where, [prop]: value };
      if (!isChanged(value, initialValue)) return true;
      const [data] = getItems(await search({ params: { ...where, deleted } }));
      return { valid: !data, data };
    }
  };
}

function getItems(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.items)) return result.items;
}
