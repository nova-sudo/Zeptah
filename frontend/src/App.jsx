import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Chat from './pages/Chat';
function App() {
  return (

    <>
    
    <BrowserRouter>
    <Routes>
      <Route element={<Home/>} path="/" />
      <Route element={<Chat/>} path="/chat" />

    </Routes>
    </BrowserRouter>
    </>
    
      
  


    
  );
}

export default App;
