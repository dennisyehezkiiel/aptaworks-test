import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | unknown | null;
  setData: Dispatch<SetStateAction<T | null>>;
}

export default function useFetch<T>(
  fetchFunction: () => Promise<{ data: T } | T>, 
  dependencies: React.DependencyList = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | unknown | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchFunction()
      .then((res: any) => {
        if (isMounted) {
          const resultData = res && typeof res === 'object' && 'data' in res ? res.data : res;
          setData(resultData);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, setData };
}