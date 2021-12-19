import { formatDistanceToNow } from './deps.js';

export function sortByCreated(items) {
  return items.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function formatAgo(date) {
    if (date == undefined) {
        return '';
    }

    return formatDistanceToNow(date, { addSuffix: true});
}
