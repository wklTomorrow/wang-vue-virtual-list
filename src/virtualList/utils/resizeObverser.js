export const resizeCb = (fn) => {
  const resizeObverser = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.contentRect) {
        fn();
      }
    }
  });
  return resizeObverser;
};
