import { useState } from "react";

import Step1 from "./步骤/Step1";
import Step2 from "./步骤/Step2";
import Step3 from "./步骤/Step3";
import Step4Payment from "./步骤/Step4Payment";
import Step5Confirmation from "./步骤/Step5Confirmation";
import Step6Final from "./步骤/Step6Final";

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const next = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {step === 1 && <Step1 onNext={next} initialData={formData} />}
      {step === 2 && <Step2 onNext={next} onBack={back} initialData={formData} />}
      {step === 3 && <Step3 onNext={next} onBack={back} initialData={formData} />}
      {step === 4 && <Step4Payment onNext={next} onBack={back} initialData={formData} />}
      {step === 5 && <Step5Confirmation onNext={next} onBack={back} initialData={formData} />}
      {step === 6 && <Step6Final initialData={formData} />}
    </div>
  );
}

