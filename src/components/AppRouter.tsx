import { ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Auth from "~/components/Auth";
import Preview from "~/components/Preview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
    // loader: rootLoader,
  },
  {
    path: "/preview",
    element: <Preview />,
    // loader: previewLoader,
  },
]);

const AppRouter = (): ReactNode => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
