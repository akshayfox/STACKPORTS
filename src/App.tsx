
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import EditorPage from "./pages/editor/editorPage";
import TemplatePage from "./pages/template/TemplatePage";

const App = () => {
  return (
    <BrowserRouter>
      {/* <Layout> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/templates" element={<TemplatePage/>} />

        </Routes>
      {/* </Layout> */}
    </BrowserRouter>
  );
};
export default App;
