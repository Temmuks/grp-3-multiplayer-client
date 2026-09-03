import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import GamePage from "./pages/GamePage";

function App() {

  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />}/>
        <Route path="/game/:gameRoomId?" element={<GamePage />}/>
      </Routes>
    </BrowserRouter>
  </>;
}

export default App;
