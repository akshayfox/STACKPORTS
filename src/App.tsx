import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import EditorPage from "./pages/editor/editorPage";
import TemplatePage from "./pages/template/TemplatePage";
import BasicLayout from "./layouts/BasicLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BasicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/templates" element={<TemplatePage />} />
        </Route>
        <Route path="/editor/:id?" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
