import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { App } from "./app/App";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* TODO: other routes? */}
    </Route>
  )
);
