import AppRoutes from "./routes/AppRoute";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" />
    </>
  );
};

export default App;
