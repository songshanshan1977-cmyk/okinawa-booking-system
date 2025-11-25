import { useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4Payment from "./steps/Step4Payment";
import Step5Confirmation from "./steps/Step5Confirmation";
import Step6Final from "./steps/Step6Final";

const TOTAL_STEPS = 6;

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const goNext = (data = {}) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const commonProps = {
    data: formData,
    onNext: goNext,
    onBack: goBack,
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "16px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>冲绳包车预约流程（测试版）</h1>
      <p style={{ marginBottom: "24px" }}>当前步骤：{step} / {TOTAL_STEPS}</p>

      {step === 1 && <Step1 {...commonProps} />}
      {step === 2 && <Step2 {...commonProps} />}
      {step === 3 && <Step3 {...commonProps} />}
      {step === 4 && <Step4Payment {...commonProps} />}
      {step === 5 && <Step5Confirmation {...commonProps} />}
      {step === 6 && <Step6Final data={formData} />}
    </div>
  );
}
