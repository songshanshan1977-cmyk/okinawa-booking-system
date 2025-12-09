import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// 车型名称映射（展示用）
const carNameMap = {
  car1: "经济 5 座轿车",
  car2: "豪华 7 座阿尔法",
  car3: "舒适 10 座海狮",
};

export default function Step4Payment({ initialData, onNext, onBack }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ⭐ 调用 Vercel API 生成 Stripe Checkout URL
  const handlePay = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: initialData.order_id, // 已由 Step3 创建订单产生
        }),
      });

      const data = await response.json();
      console.log("🔵 Stripe Checkout 返回：", data);

      if (!response.ok || !data?.url) {
        throw new Error(data.error || "无法生成支付链接，请稍后再试。");
      }

      // 自动跳转 Stripe 支付页面
      window.location.href = data.url;
    } catch (err) {
      console.error("支付错误：", err);
      setErrorMsg(err.message || "连接支付系统失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
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
          <p>🚗 车型：{carNameMap[initialData.car_model]}</p>
          <p>
            🗣 司机语言：
            {initialData.driver_lang === "zh" ? "中文司机" : "日文司机"}
          </p>
          <p>⏱ 时长：{initialData.duration} 小时</p>
          <p>
            📅 日期：{initialData.start_date} → {initialData.end_date}
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

