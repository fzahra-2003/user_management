import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { Upload } from 'lucide-react';

function Add() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [cin, setCin] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [lieuDeNaissance, setLieuDeNaissance] = useState('');
  const [sexe, setSexe] = useState('');
  const [adresse, setAdresse] = useState('');
  const [nationalite, setNationalite] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [cinDocument, setCinDocument] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();
  const textInput = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCinDocument(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!cinDocument) {
      return Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'Veuillez télécharger une copie de votre CIN.',
        showConfirmButton: true
      });
    }

    if (!nom || !prenom || !cin || !dateDeNaissance || !lieuDeNaissance || !sexe || !adresse || !nationalite || !dateExpiration) {
      return Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'Tous les champs sont requis.',
        showConfirmButton: true
      });
    }

    const formData = new FormData();
    formData.append('id', uuidv4());
    formData.append('Nom', nom);
    formData.append('Prenom', prenom);
    formData.append('CIN', cin);
    formData.append('Date_de_naissance', dateDeNaissance);
    formData.append('Lieu_de_naissance', lieuDeNaissance);
    formData.append('Sexe', sexe);
    formData.append('Adresse', adresse);
    formData.append('Nationalite', nationalite);
    formData.append('Date_Expiration', dateExpiration);
    formData.append('cin_document', cinDocument);

    try {
      await axios.post("http://localhost:5000/users", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Ajouté!',
        text: `${nom} ${prenom} a été ajouté avec succès.`,
        showConfirmButton: false,
        timer: 1500
      });

      navigate('/');
    } catch (error) {
      console.error("Erreur d'ajout :", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'Une erreur est survenue lors de l\'ajout.',
        showConfirmButton: true
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleAdd} className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Ajouter un nouvel utilisateur</h1>
        <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document CIN
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="cin-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Télécharger un fichier</span>
                    <input
                      id="cin-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, PDF jusqu'à 10MB
                </p>
              </div>
            </div>
            {previewUrl && (
              <div className="mt-2">
                {cinDocument?.type.includes('image') ? (
                  <img src={previewUrl} alt="Preview" className="h-20 w-auto" />
                ) : (
                  <p className="text-sm text-gray-500">Document sélectionné: {cinDocument.name}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                id="nom"
                type="text"
                ref={textInput}
                value={nom}
                onChange={e => setNom(e.target.value)} 
                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="prénom" className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                id="prénom"
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cin" className="block text-sm font-medium text-gray-700">CIN</label>
            <input
              id="cin"
              type="text"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
              className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateDeNaissance" className="block text-sm font-medium text-gray-700">Date de Naissance</label>
              <input
                id="dateDeNaissance"
                type="date"
                value={dateDeNaissance}
                onChange={(e) => setDateDeNaissance(e.target.value)}
                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="lieuDeNaissance" className="block text-sm font-medium text-gray-700">Lieu de Naissance</label>
              <input
                id="lieuDeNaissance"
                type="text"
                value={lieuDeNaissance}
                onChange={(e) => setLieuDeNaissance(e.target.value)}
                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="sexe" className="block text-sm font-medium text-gray-700">Sexe</label>
            <select
              id="sexe"
              value={sexe}
              onChange={(e) => setSexe(e.target.value)}
              className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Sélectionner Sexe</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>

          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              id="adresse"
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nationalite" className="block text-sm font-medium text-gray-700">Nationalité</label>
              <input
                id="nationalite"
                type="text"
                value={nationalite}
                onChange={(e) => setNationalite(e.target.value)}
                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="dateExpiration" className="block text-sm font-medium text-gray-700">Date d'Expiration</label>
              <input
                id="dateExpiration"
                type="date"
                value={dateExpiration}
                onChange={(e) => setDateExpiration(e.target.value)}
                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          
        </div>

        <div className="mt-6 flex justify-start space-x-3">
          <button
            type="submit"
            className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Enregistrer
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default Add;