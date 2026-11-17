// Compatibility export for older cached pages. Edit news.json through the local manager.
const response = await fetch(new URL('./news.json', import.meta.url), {cache:'no-cache'});
if (!response.ok) throw new Error('News could not be loaded');
export const news = await response.json();
