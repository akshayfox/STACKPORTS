
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import EditorPage from "./pages/editor/editorPage";

const App = () => {
  return (
    <BrowserRouter>
      {/* <Layout> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      {/* </Layout> */}
    </BrowserRouter>
  );
};
export default App;
