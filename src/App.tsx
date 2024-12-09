// App.tsx

import React from "react";
import 'bulma/css/bulma.min.css';
import { Route, Routes } from "react-router-dom";

import Header from "./components/header/header";
import HomePage from "./pages/homePage/homePage"; // page d'accueil
import AnimalsListPage from "./pages/animalsListPage/animalsListPage"; // page de la liste des animaux
import AnimalInfoPage from "./pages/animalInfoPage/animalInfoPage"; // page de détails d'un animal

import Signup_assoPage from "./pages/signupPage/signup_assoPage"; // page de l'inscription d'une association
import ProfilePageAsso from "./pages/spaceAsso/associationProfile"; // page du profil de l'association
import AssociationAccount from "./pages/spaceAsso/associationAccount"; // page du compte de l'association
import AssociationAnimalsPage from "./pages/associationAnimalsPage/associationAnimalsPage"; // page de la liste des animaux de l'association
import AddAnimal from "./components/animalsCrud/addAnimal"; // composant pour ajouter un animal
import ModifyAnimal from "./components/animalsCrud/modifyAnimal"; // composant pour modifier un animal

import Signup_faPage from "./pages/signupPage/signup_faPage"; // page de l'inscription d'une famille
import ProfilePageFamily from "./pages/spaceFamily/familyProfile"; // page du profil de la famille
import FamilyAccount from "./pages/spaceFamily/familyAccount"; // page du compte de la famille
import FamilyAnimalsAsk from "./pages/spaceFamily/familyAnimalsAsk"; // page de la liste des demandes d'accueil

import Footer from "./components/footer/footer";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/animaux" element={<AnimalsListPage />} />
        <Route path="/animal-info/:animalId" element={<AnimalInfoPage />} />

        <Route path="/inscription-association" element={<Signup_assoPage />} />
        <Route path="/espace-association/profil-association/:associationId" element={<ProfilePageAsso />} /> // page du profil de l'association
        <Route path="/espace-association/mon-compte/:associationId" element={<AssociationAccount />} /> // page du compte de l'association
        <Route path="/espace-association/animaux-association/:associationId" element={<AssociationAnimalsPage />} /> // page de la liste des animaux de l'association
        <Route path="/espace-association/animaux-association/ajout-animal/:associationId" element={<AddAnimal />} /> // page d'ajout d'un animal
        <Route path="/espace-association/animaux-association/:associationId/modifier-animal/:animalId" element={<ModifyAnimal />} /> // page de modification d'un animal

        <Route path="/inscription-famille" element={<Signup_faPage />} />
        <Route path="/espace-famille/profil-famille/:familyId" element={<ProfilePageFamily />} /> // page du profil de la famille
        <Route path="/espace-famille/mon-compte/:familyId" element={<FamilyAccount />} /> // page du compte de la famille
        <Route path="/espace-famille/animaux-famille/:familyId" element={<FamilyAnimalsAsk />} />

        {/* Vous pouvez ajouter d'autres routes ici */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
