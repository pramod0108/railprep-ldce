import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./RootLayout";
import HomePage from "./pages/Home";
import SectionPage from "./pages/Section";
import TestPage from "./pages/Test";
import ResultPage from "./pages/Result";
import ReviewPage from "./pages/Review";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "section/:sectionId", element: <SectionPage /> },
      { path: "test/:sectionId/:testId", element: <TestPage /> },
      { path: "result", element: <ResultPage /> },
      { path: "review", element: <ReviewPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
