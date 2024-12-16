import "./toast.scss";
import { useEffect } from "react";

//! Props
interface IToastProps {
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  type: "success" | "error" | "info" | "warning";
  children?: React.ReactNode; // Ajouter un prop pour les enfants (les boutons de confirmation)
}

//! Toast
function Toast({ setToast, message, type, children }: IToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [setToast]);

  return (
    <div className="toastContainer">
      <div className={`toast ${type}`}>
        <p>{message}</p>
        {children && <div className="toast-buttons">{children}</div>} {/* Affiche les enfants (les boutons de confirmation) */}
      </div>
    </div>
  );
}

export default Toast;
