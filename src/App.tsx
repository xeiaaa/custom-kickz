import { Routes, Route } from "react-router-dom";
import Home from "@/pages/home.page";
import Test from "@/pages/test.page";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
