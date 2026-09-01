import { AppRouter } from "./routes/AppRouter";
import { LibraryProvider } from "./contexts/LibraryContext";

function App() {
  return (
    <LibraryProvider>
      <AppRouter />
    </LibraryProvider>
  );
}
export default App;
