import { Routes, Route } from "react-router-dom";
import {
  Dashboard,
  Login,
  Signup,
  SearchPage,
  SearchPage2,
  FilterPage,
  SearchPagev3,
  RecipePage,
} from "./pages/index.js";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/filterpage" element={<FilterPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/searchpage" element={<SearchPage2 />} />
      <Route path="/searchpagemain" element={<SearchPage />} />
      <Route path="/searchpagev3" element={<SearchPagev3 />} />
      <Route path="/recipepage" element={<RecipePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
