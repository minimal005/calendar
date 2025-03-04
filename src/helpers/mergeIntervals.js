export const mergeIntervals = (intervals) => {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a.bt - b.bt);
  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = sorted[i];

    if (prev.et + 1 >= curr.bt) {
      prev.et = Math.max(prev.et, curr.et);
    } else {
      merged.push(curr);
    }
  }
  return merged;
};
