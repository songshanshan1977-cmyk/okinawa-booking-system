import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// ⭐ 你的 Supabase 边缘函数 URL（不要改）
const SUPABASE_FN_URL =
  "https://xljenmxsmhmghtrlllat.supabase.co/functions/v1/create-payment-intent";

export default function Step4Payment({ initialData, onNext, onBack }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --------------------------
  // 调用 Supabase create-payment-intent
  // --------------------------
  const handlePay = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(SUPABASE_FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: initialData.order_id, // 必须带上订单号
          amount: 500, // 固定押金
          email: initialData.email, // 付款邮箱
        }),
      });

      const data = await res.json();
      console.log("🔵 Supabase 支付返回：", data);

      if (!data?.checkout_url) {
        setErrorMsg("无法获取支付链接，请稍后再试。");
        setLoading(false);
        return;
      }

      // ⭐ 跳转到 Stripe Checkout 页面
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error("Stripe error:", err);
      setErrorMsg("支付初始化失败，请稍后再试。");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold mb-4">确认并支付押金</h2>

      <p className="text-gray-500 text-sm mb-4">
        订单编号：{initialData.order_id}
      </p>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-xl font-semibold mb-4">订单摘要</h3>

        <div className="space-y-2 text-gray-700">
          <p>🚗 车型：{initialData.car_model}</p>
          <p>🗣 司机语言：{initialData.driver_lang}</p>
          <p>⏱ 包车时长：{initialData.duration} 小时</p>
          <p>
            📅 用车日期：{initialData.start_date} → {initialData.end_date}
          </p>
          <p>🏨 出发酒店：{initialData.departure_hotel}</p>
          <p>🏨 回程酒店：{initialData.end_hotel}</p>
          <p>👤 姓名：{initialData.name}</p>
          <p>☎ 电话：{initialData.phone}</p>
          <p>📧 邮箱：{initialData.email}</p>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-xl font-bold">
            需支付押金：<span className="text-blue-600">¥500</span>
          </p>
          <p className="text-sm text-gray-500">(尾款请在用车当天付给司机)</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-100 text-red-600 rounded-md border">
          {errorMsg}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          返回上一步
        </Button>

        <Button
          onClick={handlePay}
          className="bg-blue-600 text-white px-6 py-3 text-lg"
          disabled={loading}
        >
          {loading ? "正在连接支付…" : "前往支付押金"}
        </Button>
      </div>
    </div>
  );
}

