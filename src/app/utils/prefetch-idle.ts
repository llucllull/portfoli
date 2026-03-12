export function prefetchIdle(callback: () => void) {
  if (typeof window === 'undefined') return;

  const nav: any = navigator;

  if (nav?.connection?.saveData || nav?.connection?.effectiveType === '2g') {
    return;
  }

  const idle =
    (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 300));

  idle(callback);
}
