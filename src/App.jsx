import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import "./App.css"
import Algorithms from "./pages/Algorithms.jsx";
import Algorithm from "./pages/Algorithm.jsx";
function App() {
  useEffect(() => {
    // fetchData();
  }, []);



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/visualgo/:alg?" element={<Algorithms />} />
        {/*dynamic routing -- :alg required, :id? optional*/}
        <Route path="/visualgo/:alg/:id?" element={<Algorithm />} />
        {/*这个会和上面那个冲突，但是若这个匹配若能匹配到这个，似乎就优先使用这个
                   <Route path="/algorithms/graphs" element={<Graphs />} />*/}
      </Routes>
    </BrowserRouter>

  );
}

export default App;
