export function range(start, count) {
  return Array.apply(0, Array(count)).map(function(element, index) {
    return index + start;
  });
}

export function getYears() {
  return range(1920, 99).reverse();
}
