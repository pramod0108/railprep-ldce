import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppLayout from "./components/AppLayout";

export default function RootLayout() {
  const location = useLocation();
  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        {/* Keying by pathname makes AnimatePresence treat each route as its
            own component for enter/exit transitions. */}
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </AppLayout>
  );
}
