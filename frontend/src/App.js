import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Pages/Navbar';
import List from './Pages/List';
import Add from './Pages/Add';
import Edit from './Pages/Edit';
import Details from './Pages/Details';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<List />} />
            <Route path="/Ajouter" element={<Add />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/details/:id" element={<Details />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;