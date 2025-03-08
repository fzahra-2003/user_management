import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';

function List() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'Impossible de charger les utilisateurs.',
        showConfirmButton: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Êtes-vous sûr ?',
        text: "Vous ne pourrez pas revenir en arrière !",
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimez-le !',
        cancelButtonText: 'Non, annuler !',
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/users/${id}`);
        await fetchUsers();
        
        Swal.fire({
          icon: 'success',
          title: 'Supprimé !',
          text: 'Utilisateur supprimé avec succès.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Impossible de supprimer l\'utilisateur.',
        showConfirmButton: true
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['No.', 'Nom', 'Prenom', 'CIN', 'Date_Naissance', 'Actions'].map((header, index) => (
                <th 
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user, i) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.prenom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.cin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {moment(user.date_naissance).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => navigate(`/details/${user.id}`)}
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center"
                      >
                        <FaEye className="w-4 h-4 mr-2" />
                        Details
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  Aucun utilisateur trouvé !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default List;