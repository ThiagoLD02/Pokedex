import { Route, Routes } from "react-router-dom";
import { SearchPage } from "./pages/searchPage";
import { Pokemon } from "./pages/pokemon";

export function MyRoutes() {
  return (
    <Routes>
      <Route path="/" Component={SearchPage} />
      <Route path="/pokemon" Component={Pokemon} />
    </Routes>
  );
}
