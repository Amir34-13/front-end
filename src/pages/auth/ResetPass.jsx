import { useState } from "react";
import ForgotPassword from "../../components/forget/ForgotPassword";
import VerifyResetCode from "../../components/forget/VerifyResetCode";
import ResetPassword from "../../components/forget/ResetPassword";

import "./resetPass.css";

const PasswordResetFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const goToVerify = (mail) => {
    setStep(2);
    setEmail(mail);
    
  };

  const goToReset = () => {
    setStep(3); // uniquement si le code a été vérifié
  };

  return (
    <div className="reset-container">
      {step === 1 && <ForgotPassword onNext={goToVerify} />}
     
      {step === 2 && <VerifyResetCode  onVerified={goToReset} />}

     { step === 3 && <ResetPassword email={email} />
      }
    </div>
  );
};
export default PasswordResetFlow;