import { AppRouter } from "./routes/AppRouter";
import { LibraryProvider } from "./contexts/LibraryContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider><LibraryProvider>
      <AppRouter />
    </LibraryProvider></AuthProvider>
  );
}
export default App;
