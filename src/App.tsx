// App.tsx

import React from "react";
import 'bulma/css/bulma.min.css';
import { Route, Routes } from "react-router-dom";

import ConfirmEmailPage from "./components/confirmEmail/confirmEmail";

import Header from "./components/header/header";
import HomePage from "./pages/homePage/homePage"; // page d'accueil
import AnimalsListPage from "./pages/animalsListPage/animalsListPage"; // page de la liste des animaux
import AnimalInfoPage from "./pages/animalInfoPage/animalInfoPage"; // page de détails d'un animal

import Signup_assoPage from "./pages/signupPage/signup_assoPage"; // page de l'inscription d'une association
import ProfilePageAsso from "./pages/spaceAsso/associationProfile"; // page du profil de l'association
import AssociationAccount from "./pages/spaceAsso/associationAccount"; // page du compte de l'association
import AssociationAnimalsPage from "./pages/spaceAsso/associationAnimalsPage"; // page de la liste des animaux de l'association
import AddAnimal from "./components/animalsCrud/addAnimal"; // composant pour ajouter un animal
import ModifyAnimal from "./components/animalsCrud/modifyAnimal"; // composant pour modifier un animal
import AssociationAnimalAsk from "./pages/spaceAsso/associationAnimalAsk"; // page pour lister les demande d'une association
import PublicAssociationAnimalsPage from "./pages/publicAssociationAnimalsPage/publicAssociationAnimalsPage";

import Signup_faPage from "./pages/signupPage/signup_faPage"; // page de l'inscription d'une famille
import ProfilePageFamily from "./pages/spaceFamily/familyProfile"; // page du profil de la famille
import FamilyAccount from "./pages/spaceFamily/familyAccount"; // page du compte de la famille
import FamilyAnimalsAsk from "./pages/spaceFamily/familyAnimalsAsk"; // page de la liste des demandes d'accueil

import Footer from "./components/footer/footer";

const App: React.FC = () => {
  return (
    <>
     <div className="app-container">
      <Header />
      <main className="main-content">
      <Routes>
    {/*   <Route path="/test-confirm-email" element={<ConfirmEmailPage />}/> route pour tester la page de confirmation mail */}
    
        <Route path="/confirm-email/:token" element={<ConfirmEmailPage />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/animaux" element={<AnimalsListPage />} />
        <Route path="/animal-info/:animalId" element={<AnimalInfoPage />} />

        <Route path="/inscription-association" element={<Signup_assoPage />} />
        <Route path="/espace-association/profil-association/:associationId" element={<ProfilePageAsso />} /> // page du profil de l'association
        <Route path="/espace-association/mon-compte/:associationId" element={<AssociationAccount />} /> // page du compte de l'association
        <Route path="/espace-association/animaux-association/:associationId" element={<AssociationAnimalsPage />} /> // page de la liste des animaux de l'association
        <Route path="/espace-association/animaux-association/ajout-animal/:associationId" element={<AddAnimal />} /> // page d'ajout d'un animal
        <Route path="/espace-association/animaux-association/:associationId/modifier-animal/:animalId" element={<ModifyAnimal />} /> // page de modification d'un animal
        <Route path="/espace-association/demandes-association/:associationId" element={<AssociationAnimalAsk/>} /> // page des demandes d'accueil d'une association
        <Route path="/associations/:associationId/animaux" element={<PublicAssociationAnimalsPage />}/>// page public de la liste des animaux par asso

        <Route path="/inscription-famille" element={<Signup_faPage />} />
        <Route path="/espace-famille/profil-famille/:familyId" element={<ProfilePageFamily />} /> // page du profil de la famille
        <Route path="/espace-famille/mon-compte/:familyId" element={<FamilyAccount />} /> // page du compte de la famille
        <Route path="/espace-famille/demandes-famille/:familyId" element={<FamilyAnimalsAsk />} /> // page récapitulatif des demandes accueil famille

        {/* Vous pouvez ajouter d'autres routes ici */}
      </Routes>
      </main>
      <Footer />
      </div>
    </>
  );
};

export default App;
