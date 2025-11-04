
export function getPaginationWindow(current: number, totalPages: number, delta = 2): Array<number | "..."> {
  // ensure sane values
  const total = Math.max(1, totalPages);
  const cur = Math.min(Math.max(1, current), total);

  // If total pages small -> return all page numbers
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const range: Array<number | "..."> = [];
  const left = Math.max(2, cur - delta);
  const right = Math.min(total - 1, cur + delta);

  range.push(1);

  if (left > 2) {
    range.push("...");
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) {
    range.push("...");
  }

  range.push(total);
  return range;
}
