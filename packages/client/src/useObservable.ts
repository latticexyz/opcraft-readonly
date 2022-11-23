import { useEffect, useState } from "react";
import { Observable } from "rxjs";

// TODO: allow an optional initial value, but return type should remove the undefined if initial value provided
//       otherwise, best to use `useObservable(...) ?? defaultValue`

export const useObservable = <T>(observable: Observable<T> | null | undefined) => {
  const [value, setValue] = useState<T | undefined>(undefined);
  useEffect(() => {
    if (!observable) return;
    const subscription = observable.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observable]);
  return value;
};
