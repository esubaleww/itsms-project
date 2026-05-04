import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./common/ui/Toast";

function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;
