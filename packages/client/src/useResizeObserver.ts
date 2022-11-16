import useResizeObserver from "use-resize-observer";

export { useResizeObserver };

// use-resize-observer doesn't export this type for us :(
// https://github.com/ZeeCoder/use-resize-observer/issues/98
export type ResizeHandler = NonNullable<Required<Parameters<typeof useResizeObserver>>[0]["onResize"]>;
