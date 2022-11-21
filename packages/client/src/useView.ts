import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type View = "map" | "game";

export const useView = () => {
  const [params, setParams] = useSearchParams();
  const viewParam = params.get("view");
  const view: View = viewParam === "map" || viewParam === "game" ? viewParam : "map";
  const setView = useCallback(
    (view: View) => {
      setParams({ view });
    },
    [setParams]
  );
  return [view, setView] as const;
};
