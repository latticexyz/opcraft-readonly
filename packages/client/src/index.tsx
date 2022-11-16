import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { NetworkLayerProvider } from "./NetworkLayerContext";
import { createNetworkLayer } from "./layers/network";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <NetworkLayerProvider
    value={createNetworkLayer({
      // TODO
    })}
  >
    <App />
  </NetworkLayerProvider>
);
