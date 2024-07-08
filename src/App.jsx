import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Ideas from "./views/Ideas.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import AddIdeas from "./views/CreateIdeas.jsx";


function App() {

  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/ideas/create" element={<AddIdeas />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
