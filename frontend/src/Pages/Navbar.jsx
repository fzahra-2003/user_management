import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus,  } from 'lucide-react';

function Navbar() {
  const location = useLocation();


  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Users className="h-8 w-8 text-blue-800" />
              <span className="ml-2 text-xl font-bold text-gray-900">Gestion des Utilisateurs</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md ${
                location.pathname === '/' 
                  ? 'text-blue-800 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
              }`}
            >
              <Users className="h-5 w-5 mr-1" />
              Liste
            </Link>
            <Link
              to="/Ajouter"
              className={`flex items-center px-3 py-2 rounded-md ${
                location.pathname === '/Ajouter'
                  ? 'text-blue-800 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
              }`}
            >
              <UserPlus className="h-5 w-5 mr-1" />
              Ajouter
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;