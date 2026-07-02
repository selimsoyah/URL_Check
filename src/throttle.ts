export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  delayMs: number
): T {
  let lastRun = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: Parameters<T> | null = null;

  return ((...args: Parameters<T>) => {
    pendingArgs = args;
    const now = Date.now();
    const elapsed = now - lastRun;

    const invoke = () => {
      lastRun = Date.now();
      timer = null;
      const argsToUse = pendingArgs;
      pendingArgs = null;
      if (argsToUse) fn(...argsToUse);
    };

    if (elapsed >= delayMs) {
      if (timer) clearTimeout(timer);
      invoke();
    } else if (!timer) {
      // Bug fix: the old version ignored calls while a timer was already pending,
      // so the last URL typed during the wait window was dropped. We always keep
      // the latest args and still fire once when the window ends.
      timer = setTimeout(invoke, delayMs - elapsed);
    }
  }) as T;
}
