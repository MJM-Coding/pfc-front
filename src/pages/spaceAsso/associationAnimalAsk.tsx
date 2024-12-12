import React, { useEffect, useState, useContext } from "react";
import { GetAllAsks, PatchAsk, DeleteAsk } from "../../api/ask.api";
import type { IAsk } from "../../@types/ask";
import AuthContext from "../../contexts/authContext";
import Toast from "../../components/toast/toast";
import "./associationAnimalAsk.scss";
import "../../styles/commun/commun.scss";
import Swal from 'sweetalert2';


const AssociationAnimalAsk: React.FC = () => {
  const [asks, setAsks] = useState<IAsk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [selectedFamily, setSelectedFamily] = useState<IAsk["family"] | null>(null);
  const authContext = useContext(AuthContext);
  const [selectedAnimal, setSelectedAnimal] = useState<IAsk["animal"] | null>(null);

  const handleShowAnimalModal = (animal: IAsk["animal"]) => {
    setSelectedAnimal(animal);
  };
  
  //! Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  useEffect(() => {
    const fetchAssociationAsks = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = authContext?.token;
        const idAssociation = authContext?.user?.id_association;

        if (!token || !idAssociation) {
          setError("Utilisateur non connecté.");
          return;
        }

        const associationAsks = await GetAllAsks(token);
        const filteredAsks = associationAsks.filter(
          (ask) => ask.animal?.id_association === idAssociation
        );
        setAsks(filteredAsks);
      } catch (err) {
        console.error("Erreur lors du chargement des demandes :", err);
        setError("Impossible de charger les demandes.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssociationAsks();
  }, [authContext]);

  //! Mise à jour du statut de la demande
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = authContext?.token;

      if (!token) {
        setError("Utilisateur non connecté.");
        return;
      }

      await PatchAsk(id, { status: newStatus }, token);
      setToastMessage(`Demande ${newStatus.toLowerCase()} avec succès.`);
      setToastType("success");
      setShowToast(true);

      const currentDate = new Date().toISOString();
      setAsks((prevAsks) =>
        prevAsks.map((ask) =>
          ask.id.toString() === id ? { ...ask, status: newStatus, updated_at: currentDate } : ask
        )
      );
    } catch (err) {
      console.error(`Erreur lors de la mise à jour de la demande :`, err);
      setToastMessage(`Erreur lors de la mise à jour de la demande.`);
      setToastType("error");
      setShowToast(true);
    }
  };

 

  //! Supprimer une demande
  const handleDeleteAsk = async (id: string, statusLabel: string) => {
    const confirmDelete = await Swal.fire({
      title: 'Confirmation',
      text: statusLabel === "validée" ? 'Êtes-vous sûr de vouloir rendre cet animal à nouveau disponible? Attention, cet animal ne sera plus réservé et sera à nouveau visible pour les adoptants.' : 'Voulez-vous supprimer cette demande?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Non, revenir',
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        const token = authContext?.token;
        if (!token) {
          setError("Utilisateur non connecté.");
          return;
        }
        await DeleteAsk(id, token);
        setToastMessage("Demande supprimée avec succès.");
        setToastType("success");
        setShowToast(true);
        setAsks((prevAsks) => prevAsks.filter((ask) => ask.id.toString() !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression de la demande :", err);
        setToastMessage("Erreur lors de la suppression de la demande.");
        setToastType("error");
        setShowToast(true);
      }
    }
  };
  
  const renderAskTable = (askList: IAsk[], statusLabel: string) => (
    <table className="ask-table">
      <thead>
        <tr>
          <th>Photo</th>
          <th>Animal</th>
          <th>Famille</th>
          {statusLabel === "rejetée" && <th>Demande effectuée le</th>}
          <th>{statusLabel === "en attente" ? "Demande effectuée le" : statusLabel === "validée" ? "Demande validée le" : "Demande rejetée le"}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {askList.map((ask) => (
          <tr key={ask.id}>
            <td>
              {ask.animal?.profile_photo && (
                <img
                  src={
                    ask.animal.profile_photo.startsWith("http")
                      ? ask.animal.profile_photo
                      : `${import.meta.env.VITE_STATIC_URL}${ask.animal.profile_photo}`
                  }
                  alt={ask.animal.name}
                  className="animal-photo"
                  onClick={() => handleShowAnimalModal(ask.animal)} // Ajouter l'événement de clic
                />
              )}
            </td>
            <td>{ask.animal?.name}</td>
            <td>
              {ask.family && ask.family.user && (
                <span>
                  {ask.family.user.firstname} {ask.family.user.lastname}
                </span>
              )}
            </td>
            {statusLabel === "rejetée" && (
              <td>{formatDate(ask.created_at)}</td>
            )}
            <td>{formatDate(statusLabel === "en attente" ? ask.created_at : ask.updated_at || ask.created_at)}</td>
            <td>
              {statusLabel === "en attente" && (
                <>
                  <button className="validate-button" onClick={() => handleUpdateStatus(ask.id.toString(), "validée")}>
                    Valider
                  </button>
                  <button className="reject-button" onClick={() => handleUpdateStatus(ask.id.toString(), "rejetée")}>
                    Rejeter
                  </button>
                </>
              )}
              {statusLabel === "validée" && (
                <button
                  className="make-available-button"
                  onClick={() => handleDeleteAsk(ask.id.toString(), "validée")}
                  title="Rendre l'animal disponible"
                >
                  Rendre disponible
                </button>
              )}
         
              <button className="view-family-button" onClick={() => setSelectedFamily(ask.family)}>
                Voir la famille
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  
  
  
  //! Modale info famille
  
  const renderFamilyModal = () => {
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        setSelectedFamily(null);
      }
    };
  
    return (
      <div className="family-modal" onClick={handleOutsideClick}>
        <div className="modal-content">
          
          {selectedFamily && (
            <div>
                <h3 className="familyTitle">{selectedFamily.user.firstname} {selectedFamily.user.lastname}</h3>
                <p className="familyInfo"> <i className="fa fa-phone" aria-hidden="true"></i>  {selectedFamily.phone}</p>                           
                <p className="familyInfo"> <i className="fa fa-map-marker" aria-hidden="true"></i>  {selectedFamily.address} {selectedFamily.postal_code} {selectedFamily.city} </p>
                
                
              
              {selectedFamily.profile_photo && (
                  <img
                  src={
                      selectedFamily.profile_photo.startsWith("http")
                      ? selectedFamily.profile_photo
                      : `${import.meta.env.VITE_STATIC_URL}${selectedFamily.profile_photo}`
                    }
                    alt="Photo de la famille"
                    className="family-photo"
                    />
                )}
               
                               
                <p className="familyInfo"><strong className="underline">Nombre d'enfants :</strong> {selectedFamily.number_of_children}</p>           
                <p className="familyInfo"><strong className="underline">Nombre d'animaux :</strong> {selectedFamily.number_of_animals}</p>                             
                <p className="familyInfo"><strong className="underline">Possède un jardin :</strong> {selectedFamily.garden ? "Oui" : "Non"}</p>              
                <p className="familyInfo"> <strong className="underline">Description :</strong> {selectedFamily.description}</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  //! Modale photo animal
  const renderAnimalModal = () => {
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        setSelectedAnimal(null);
      }
    };
  
    return (
      <div className="animal-modal" onClick={handleOutsideClick}>
        <div className="modal-content">
          <button className="close-modal" onClick={() => setSelectedAnimal(null)}>
            ×
          </button>
          {selectedAnimal && (
            <div>
              <h3 className="titleAnimal"> {selectedAnimal.name}</h3>
             
              <p className="animalInfo">
                
                <img
                  src={
                    selectedAnimal.profile_photo.startsWith("http")
                      ? selectedAnimal.profile_photo
                      : `${import.meta.env.VITE_STATIC_URL}${selectedAnimal.profile_photo}`
                  }
                  alt={selectedAnimal.name}
                  className="animal-photo"
                />
              </p>
              <p className="animalInfo">{selectedAnimal.age} ans</p>  
              <p className="animalInfo">{selectedAnimal.breed}</p>
              <p className="animalInfo">{selectedAnimal.description}</p>             
            
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="association-asks-container">
      <h2>Demandes d'Accueil</h2>
      {loading && <p>Chargement des demandes...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <>
          <div className="ask-section">
            <h3>Demandes en attente</h3>
            {renderAskTable(
              asks.filter((ask) => ask.status.toLowerCase() === "en attente"),
              "en attente"
            )}
          </div>
          <div className="ask-section">
            <h3>Demandes validées</h3>
            {renderAskTable(
              asks.filter((ask) => ask.status.toLowerCase() === "validée"),
              "validée"
            )}
          </div>
          <div className="ask-section">
            <h3>Historique des 10 dernières demandes rejetées</h3>
            {renderAskTable(
              asks.filter((ask) => ask.status.toLowerCase() === "rejetée").slice(0, 10),
              "rejetée"
            )}
          </div>
        </>
      )}
      {showToast && toastMessage && (
        <Toast message={toastMessage} type={toastType} setToast={setShowToast} />
      )}
      {selectedFamily && renderFamilyModal()}
      {selectedAnimal && renderAnimalModal()} 
    </div>
  );
  
};

export default AssociationAnimalAsk;