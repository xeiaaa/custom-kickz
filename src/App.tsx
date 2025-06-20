import { Routes, Route } from "react-router-dom";
import Home from "@/pages/home/home.page";
import Test from "@/pages/test/test.page";
import SilhouettesPage from "@/pages/silhouettes/silhouettes.page";
import SilhouetteEditPage from "@/pages/silhouette-edit/silhouette-edit.page";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/silhouettes" element={<SilhouettesPage />} />
        <Route
          path="/silhouettes/:slug/edit"
          element={<SilhouetteEditPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
