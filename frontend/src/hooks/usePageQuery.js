import { useCallback, useEffect, useState } from "react";

const usePageQuery = (queryFn, options) => {
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState(options?.transformer ? options?.transformer(null) : null);
  const [params, setParams] = useState();
  const [error, setError] = useState();
  const [triggerHistory, setTriggerHistory] = useState();
  const [abortController, setAbortController] = useState(null);

  const trigger = useCallback(
    async (...params) => {
      const controller = new AbortController();
      const signal = controller.signal;
      setAbortController((ctrl) => {
        ctrl?.abort();
        return controller;
      });

      setIsFetching(true);
      setParams(params);
      setError(null);
      const newHistory = { totalCount: (triggerHistory?.totalCount || 0) + 1 };
      setTriggerHistory(newHistory);
      let response = null;
      try {
        response = await queryFn(...params, signal);

        if (options?.transformer) response = options.transformer(response);
        setData(response);
        setIsFetching(false);
        if (options?.onSuccess) options.onSuccess(response, { params, triggerHistory: newHistory });
        return {
          data: response,
        };
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch request was aborted");
        } else {
          setError(error);
          console.error(error);
          if (options?.onError) {
            options.onError(error);
          }
        }
        if (options?.transformer) response = options.transformer(null);
        setData(response);
        setIsFetching(false);
        return {
          error,
        };
      }
    },
    [triggerHistory]
  );

  useEffect(() => {
    if (options?.triggerOnInit) trigger(...(options?.initialParams || []));
  }, []);

  return { isFetching, data, error, params, triggerHistory, trigger };
};

export default usePageQuery;
