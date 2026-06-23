import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App";
import NotFound from "./components/pages/not-found";
import ListResources from "./components/pages/list-resources";
import { ListJobs } from "./components/pages/list-jobs";
import { Health } from "./components/pages/health";

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
