import { Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/layout.component";
import Home from "@/pages/home/home.page";
import Test from "@/pages/test/test.page";
import SilhouettesPage from "@/pages/silhouettes/silhouettes.page";
import SilhouetteEditPage from "@/pages/silhouette-edit/silhouette-edit.page";
import MyColorwaysPage from "@/pages/my-colorways/my-colorways.page";
import GalleryPage from "@/pages/gallery/gallery.page";
import ColorwayShowcasePage from "@/pages/colorway-showcase/colorway-showcase.page";

function App() {
  const location = useLocation();
  const onEditPage =
    location.pathname.startsWith("/silhouettes/") &&
    location.pathname.endsWith("/edit");

  return (
    <Layout fullHeightContent={onEditPage}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/silhouettes" element={<SilhouettesPage />} />
        <Route
          path="/silhouettes/:slug/edit"
          element={<SilhouetteEditPage />}
        />
        <Route path="/my-colorways" element={<MyColorwaysPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route
          path="/colorways/:colorwayId"
          element={<ColorwayShowcasePage />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
