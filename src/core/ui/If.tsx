import { useMemo } from 'react';

type Condition<Value = unknown> = Value | Falsy;

function If<Value = unknown>({
  condition,
  children,
  fallback,
}: React.PropsWithChildren<{
  condition: Condition<Value>;
  children: JSX.Element | ((value: Value) => JSX.Element);
  fallback?: JSX.Element;
}>) {
  return useMemo(() => {
    if (condition) {
      if (typeof children === 'function') {
        return <>{children(condition)}</>;
      }

      return <>{children}</>;
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return null;
  }, [condition, fallback, children]);
}

export default If;
