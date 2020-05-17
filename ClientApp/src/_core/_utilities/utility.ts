
export function sortArray(_incomingArray: any[], _sortField: string = '', _sortOrder: string = 'asc'): any[] {
  if (!_sortField) {
    return _incomingArray;
  }

  let result: any[] = [];
  result = _incomingArray.sort((a, b) => {
    if (a[_sortField] < b[_sortField]) {
      return _sortOrder === 'asc' ? -1 : 1;
    }

    if (a[_sortField] > b[_sortField]) {
      return _sortOrder === 'asc' ? 1 : -1;
    }

    return 0;
  });
  return result;
}


