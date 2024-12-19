import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Importer BrowserRouter ici
import App from './App.tsx';
import { AuthProvider } from './contexts/authContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> 
    <AuthProvider token={null}> {/* Fournir un token initial */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
