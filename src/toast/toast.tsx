import "./toast.scss";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
    }, 6000);

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
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  </div>
);
}

export default Toast;
