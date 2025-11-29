import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4Payment from "./Step4Payment";
import Step5Confirmation from "./Step5Confirmation";
import Step6Final from "./Step6Final";

// ⭐ Supabase 车型表 UUID 映射（最终版）
const CAR_MODEL_IDS = {
  car1: "5fdce9d4-2ef3-42ca-9d0c-a06446b0d9ca",
  car2: "82cf604f-e688-49fe-aecf-69894a01f6cb",
  car3: "453df662-d350-4ab9-b811-61ffcda40d4b"
};

// ⭐ 自动生成订单编号
function generateOrderId() {
  return "ORD-" + Date.now();
}

export default function BookingFlow() {
  const [step, setStep] = useState(1);

  // ⭐ 全局订单数据（最终对齐 Supabase orders 表）
  const [bookingData, setBookingData] = useState({
    order_id: generateOrderId(),

    // Step1
    start_date: "",
    end_date: "",
    departure_hotel: "",
    end_hotel: "",
    pax: 1,
    luggage: 1,

    // Step2
    car_model: "",
    car_model_id: "",
    driver_lang: "",
    duration: "",

    // Step3
    total_price: 0,
    deposit_amount: 500,

    // Contact info
    name: "",
    phone: "",
    email: "",
    remark: "",

    source: "direct",
  });

  // Step1 → Step2
  const handleStep1Next = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  // Step2 → Step3（写入车型ID）
  const handleStep2Next = (data) => {
    const carModelId = CAR_MODEL_IDS[data.car_model] || "";

    setBookingData(prev => ({
      ...prev,
      ...data,
      car_model_id: carModelId
    }));

    setStep(3);
  };

  // Step3 → Step4
  const handleStep3Next = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setStep(4);
  };

  // Step4（支付成功）→ Step5
  const handleStep4Next = (paymentInfo) => {
    setBookingData(prev => ({ ...prev, ...paymentInfo }));
    setStep(5);
  };

  // Step5 → Step6
  const handleStep5Next = () => {
    setStep(6);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">

      {step === 1 && (
        <Step1
          initialData={bookingData}
          onNext={handleStep1Next}
        />
      )}

      {step === 2 && (
        <Step2
          initialData={bookingData}
          onNext={handleStep2Next}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step3
          initialData={bookingData}
          onNext={handleStep3Next}
          onBack={() => setStep(2)}
        />
      )}

      {/* ⭐ Step4Payment（参数全部对齐） */}
      {step === 4 && (
        <Step4Payment
          initialData={bookingData}
          orderId={bookingData.order_id}
          carModelId={bookingData.car_model_id}
          amount={bookingData.deposit_amount}
          onNext={handleStep4Next}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <Step5Confirmation
          initialData={bookingData}
          onNext={handleStep5Next}
          onBack={() => setStep(4)}
        />
      )}

      {step === 6 && (
        <Step6Final
          initialData={bookingData}
        />
      )}

    </div>
  );
}
