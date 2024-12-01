// App.tsx

import React from "react";
import 'bulma/css/bulma.min.css';
import { Route, Routes } from "react-router-dom";

import Header from "./components/header/header";
import HomePage from "./pages/homePage/homePage"; // page d'accueil
import AnimalsListPage from "./pages/animalsListPage/animalsListPage"; // page de la liste des animaux

import Signup_assoPage from "./pages/signupPage/signup_assoPage"; // page de l'inscription d'une association
import ProfilePageAsso from "./pages/spaceAsso/associationProfile/associationProfile";
import AssociationAccount from "./pages/spaceAsso/associationAccount/associationAccount";

import Signup_faPage from "./pages/signupPage/signup_faPage"; // page de l'inscription d'une famille
import ProfilePageFamily from "./pages/spaceFamily/familyProfile/familyProfile";
import FamilyAccount from "./pages/spaceFamily/familyAccount/familyAccount";

import Footer from "./components/footer/footer";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/animaux" element={<AnimalsListPage />} />

        <Route path="/inscription-association" element={<Signup_assoPage />} />
        <Route path="/espace-association/profil-association/:id" element={<ProfilePageAsso />} />
        <Route path="/espace-association/Mon-compte/:id" element={<AssociationAccount />} />

        <Route path="/inscription-famille" element={<Signup_faPage />} />
        <Route path="/espace-famille/profil-famille/:id" element={<ProfilePageFamily />} />
        <Route path="/espace-famille/Mon-compte/:id" element={<FamilyAccount />} />

        {/* Vous pouvez ajouter d'autres routes ici */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
