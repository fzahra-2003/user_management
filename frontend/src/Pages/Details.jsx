import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!id) return;
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: 'Impossible de charger les informations de l\'utilisateur.',
          showConfirmButton: true
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Utilisateur non trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Détails de l'utilisateur</h1>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nom</h3>
              <p className="mt-1 text-lg text-gray-900">{user.nom}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Prénom</h3>
              <p className="mt-1 text-lg text-gray-900">{user.prenom}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">CIN</h3>
              <p className="mt-1 text-lg text-gray-900">{user.cin}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date de Naissance</h3>
              <p className="mt-1 text-lg text-gray-900">
                {moment(user.date_naissance).format('DD/MM/YYYY')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lieu de Naissance</h3>
              <p className="mt-1 text-lg text-gray-900">{user.lieu_naissance}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sexe</h3>
              <p className="mt-1 text-lg text-gray-900">{user.sexe}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
              <p className="mt-1 text-lg text-gray-900">{user.adresse}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nationalité</h3>
              <p className="mt-1 text-lg text-gray-900">{user.nationalite}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date d'Expiration</h3>
              <p className="mt-1 text-lg text-gray-900">
                {moment(user.date_expiration).format('DD/MM/YYYY')}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Modifier
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Retour
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Document CIN</h2>
        </div>
        <div className="p-6">
          {user.cin_document && (
            <div className="space-y-4">
              {user.cin_document.match(/\.(jpg|jpeg|png)$/i) ? (
                <>
                  <img 
                    src={`http://localhost:5000/uploads/${user.cin_document.split('/').pop()}`}
                    alt="CIN Document" 
                    className="w-full rounded-lg shadow-md"
                  />
                  <a
                    href={`http://localhost:5000/uploads/${user.cin_document.split('/').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir l'image en taille réelle
                  </a>
                </>
              ) : (
                <>
                  <iframe
                    src={`http://localhost:5000/${user.cin_document.split('/').pop()}`}
                    className="w-full h-[600px] rounded-lg shadow-md"
                    title="Document CIN"
                  />
                  <a
                    href={`http://localhost:5000/${user.cin_document.split('/').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ouvrir le PDF
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Details;