import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App";
import NotFound from "./components/not-found";
import ListResources from "./components/list-resources";
import { ListJobs } from "./components/list-jobs";
import { Health } from "./components/health";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/resources", element: <ListResources /> },
  { path: "/jobs", element: <ListJobs /> },
  { path: "/health", element: <Health /> },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
