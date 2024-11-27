// App.tsx

import React from "react";
import 'bulma/css/bulma.min.css';
import { Route, Routes } from "react-router-dom";

import AnimalsListPage from "./pages/animalsListPage/animalsListPage"; // page de la liste des animaux
import Signup_assoPage from "./pages/signupPage/signup_assoPage"; // page de l'inscription d'une association
import Signup_faPage from "./pages/signupPage/signup_faPage"; // page de l'inscription d'une famille
import HomePage from "./pages/homePage/homePage"; // page d'accueil
import ProfilePageAsso from "./pages/spaceAsso/associationProfile/associationProfile.tsx";
import ProfilePageFamily from "./pages/spaceFamily/familyProfile/familyProfile.tsx";
import Header from "./components/header/header";
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
        
        <Route path="/inscription-famille" element={<Signup_faPage />} />
        <Route path="/espace-famille/profil-famille/:id" element={<ProfilePageFamily />} />

        {/* Vous pouvez ajouter d'autres routes ici */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
