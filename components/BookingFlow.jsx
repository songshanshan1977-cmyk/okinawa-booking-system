"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 正确导入 6 个步骤
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4Payment from "./steps/Step4Payment";
import Step5Confirmation from "./steps/Step5Confirmation";
import Step6Final from "./steps/Step6Final";

export default function BookingFlow() {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  // ⭐ URL 强制跳转 Step6（用于支付成功后）
  useEffect(() => {
    const urlStep = params.get("step");
    const orderId = params.get("order_id");

    // 如果 success 页面跳转过来 → step=6
    if (urlStep === "6" && orderId) {
      setStep(6);
      setFormData((prev) => ({
        ...prev,
        order_id: orderId,
      }));
    }
  }, [params]);

  // 下一步
  const next = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  // 返回上一步
  const back = () => setStep((prev) => prev - 1);

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

