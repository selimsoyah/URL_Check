export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  delayMs: number
): T {
  let lastRun = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = delayMs - (now - lastRun);

    const run = () => {
      lastRun = Date.now();
      timer = null;
      fn(...args);
    };

    if (remaining <= 0) {
      if (timer) clearTimeout(timer);
      run();
    } else if (!timer) {
      timer = setTimeout(run, remaining);
    }
  }) as T;
}
