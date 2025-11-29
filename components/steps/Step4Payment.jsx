import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { supabase } from "@/lib/customSupabaseClient";

export default function Step4Payment({
  initialData,
  orderId,
  carModelId,
  amount,
  onBack,
  onNext,
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      // ⭐ Step 1：写入订单（完美对应 Supabase orders 表字段）
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_id: orderId,
          car_model_id: carModelId,

          start_date: initialData.start_date,
          end_date: initialData.end_date,
          departure_hotel: initialData.departure_hotel,
          end_hotel: initialData.end_hotel,

          pax: initialData.pax,
          luggage: initialData.luggage,

          driver_lang: initialData.driver_lang,
          duration: initialData.duration,

          total_price: initialData.total_price,
          deposit_amount: 500,

          name: initialData.name,
          phone: initialData.phone,
          email: initialData.email,
          remark: initialData.remark,

          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        console.error("订单写入失败：", orderError);
        setErrorMsg("订单创建失败，请稍后再试。");
        setLoading(false);
        return;
      }

      // ⭐ Step 2：调用旧版 create-payment-intent
      const { data: fxData, error: fxError } = await supabase.functions.invoke(
        "create-payment-intent",
        {
          body: {
            order_id: orderId,
            amount: 500, // 固定押金金额（旧版只接受 amount）
            email: initialData.email,
          },
        }
      );

      if (fxError) {
        console.error("支付连接失败：", fxError);
        setErrorMsg("支付系统连接失败，请稍后再试。");
        setLoading(false);
        return;
      }

      // ⭐ 旧版返回字段：url
      if (!fxData?.url) {
        console.error("返回数据异常：", fxData);
        setErrorMsg("无法获取支付链接，请联系客服。");
        setLoading(false);
        return;
      }

      // ⭐ Step 3：跳转 Stripe 支付页
      window.location.href = fxData.url;

    } catch (e) {
      console.error("支付初始化异常：", e);
      setErrorMsg("支付初始化失败，请稍后再试。");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold mb-4">确认并支付押金</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-xl font-semibold mb-4">订单摘要</h3>

        <div className="space-y-2 text-gray-700">
          <p>🚗 车型：{initialData.car_model}</p>
          <p>🗣 司机语言：{initialData.driver_lang}</p>
          <p>⏱ 包车时长：{initialData.duration} 小时</p>
          <p>
            📅 出行日期：{initialData.start_date} → {initialData.end_date}
          </p>
          <p>🏨 出发酒店：{initialData.departure_hotel}</p>
          <p>🏨 回程酒店：{initialData.end_hotel}</p>
          <p>👤 客户姓名：{initialData.name}</p>
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
        <Alert className="bg-red-50 border-red-300 text-red-700">
          {errorMsg}
        </Alert>
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
