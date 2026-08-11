import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CuriosityDetail from './pages/CuriosityDetail';
import Historia from './pages/Historia';
import Sobre from './pages/Sobre';
import Curiosidades from './pages/Curiosidades';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curiosidades" element={<Curiosidades />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/curiosidade/:id" element={<CuriosityDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;