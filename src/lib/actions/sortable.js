import Sortable from 'sortablejs';

export function sortable(node, options) {
  const defaultOptions = {
    animation: 200,
    filter: 'button, input, select, textarea, .no-drag',
    preventOnFilter: false,
    ...options
  };
  const sortable = Sortable.create(node, defaultOptions);
  return {
    destroy() { sortable.destroy(); }
  };
}