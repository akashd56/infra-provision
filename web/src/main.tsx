import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App";
import NotFound from "./components/not-found";
import ListLbs from "./components/list-lbs";
import { ListJobs } from "./components/list-jobs";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/loadbalancers", element: <ListLbs /> },
  { path: "/jobs", element: <ListJobs /> },
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
