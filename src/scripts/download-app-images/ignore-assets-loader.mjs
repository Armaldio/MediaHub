export async function load(url, context, defaultLoad) {
    if (url.endsWith('.png')) {
      return {
        format: 'module',
        source: `export default '';`
      };
    }
    return defaultLoad(url, context, defaultLoad);
  }