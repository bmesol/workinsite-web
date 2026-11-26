import { useEffect, useLayoutEffect, useRef } from 'react';

export const useUnsavedChangesGuard = (
  hasUnsavedChanges: () => boolean,
  onShowDialog: () => void,
) => {
  const allowNextPopStateRef = useRef(false);
  // Prevents the guard pushState from firing twice in React StrictMode's
  // artificial double-mount cycle (mount → cleanup → remount).
  const guardPushedRef = useRef(false);

  // Store the latest function references, not their computed results.
  // useLayoutEffect (not useEffect) updates these synchronously after every
  // DOM commit — before the browser paints and before the user can interact —
  // so handlePopState always reads the most current state via its closure.
  // This also sidesteps any React Compiler caching that may affect useEffect.
  const hasChangesFnRef = useRef(hasUnsavedChanges);
  const onShowDialogRef = useRef(onShowDialog);

  useLayoutEffect(() => {
    hasChangesFnRef.current = hasUnsavedChanges;
    onShowDialogRef.current = onShowDialog;
  });

  useEffect(() => {
    if (!guardPushedRef.current) {
      guardPushedRef.current = true;
      window.history.pushState(null, '');
    }

    const handlePopState = () => {
      if (allowNextPopStateRef.current) {
        allowNextPopStateRef.current = false;
        return;
      }

      // Call the function at event time (not at render time) so it reads
      // the latest closure values from the calling hook's current state.
      if (hasChangesFnRef.current()) {
        window.history.pushState(null, '');
        onShowDialogRef.current();
      } else {
        allowNextPopStateRef.current = true;
        // Defer go(-1) out of the synchronous popstate handler — calling
        // history.go() synchronously within popstate is unreliable in some
        // browser engine versions and can be silently dropped.
        setTimeout(() => window.history.go(-1), 0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
};
