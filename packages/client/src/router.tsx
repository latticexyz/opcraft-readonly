import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { App } from "./App";
import { NetworkLayer } from "./NetworkLayer";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <NetworkLayer>
          <App />
        </NetworkLayer>
      }
    >
      {/* TODO: other routes? */}
    </Route>
  )
);
