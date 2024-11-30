import "./toast.scss";
import { useEffect } from "react";


//! Props
interface IToastProps {
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  type: "success" | "error" | "info" | "warning";
}


//! Toast
function Toast({ setToast, message, type }: IToastProps) {
  // type
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast(false);
    }, 5000); //

    return () => {
      clearTimeout(timer);
    };
  }, [setToast]);

  //! Affichage
return (
  <div className="toastContainer">
    <div className={`toast ${type}`}>
      <p>{message}</p>
      <button onClick={() => setToast(false)}>
    
      </button>
    </div>
  </div>
);
}

export default Toast;
