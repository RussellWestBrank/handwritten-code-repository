function throttle(fn, wait) {
  let timer = null;
  function throttled(...arguments) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, wait);
    }
  }

  throttled.cancel = function () {
    clearTimeout(timer);
    timer = null;
  }

  throttled.flush = function () {
    if (timer) {
      fn.apply(this, args);
      timer = null;
    }
  }

  return throttled;
}
