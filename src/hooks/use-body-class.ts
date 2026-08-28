import { useEffect } from 'react';

/**
 * Adds a class to <body> while the component is mounted and removes it again
 * on unmount. Pages use it to swap background artwork.
 */
export function useBodyClass(className: string | undefined) {
  useEffect(() => {
    if (!className) return;

    document.body.classList.add(className);
    // Remove only what we added: snapshotting and restoring the whole
    // className would discard any class another effect set in the meantime.
    return () => document.body.classList.remove(className);
  }, [className]);
}
