import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import Catalogue from './pages/catalogues';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogue" element={<Catalogue />} />
      </Routes>
    </Router>
  );
}

export default App;
