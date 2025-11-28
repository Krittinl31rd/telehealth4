import AppRoutes from "./routes/AppRoute";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <AppRoutes />
      <Toaster richColors closeButton position="top-right" />
    </>
  );
};

export default App;
