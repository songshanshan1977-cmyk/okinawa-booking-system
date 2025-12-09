import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// 车型名称映射（与 Step2 保持一致）
const carNameMap = {
  car1: "经济 5 座轿车",
  car2: "豪华 7 座阿尔法",
  car3: "舒适 10 座海狮",
};

export default function Step3({ initialData, onNext, onBack }) {
  const {
    start_date,
    end_date,
    departure_hotel,
    end_hotel,
    car_model,
    driver_lang,
    duration,
    total_price,
    name,
    phone,
    email,
    remark,
  } = initialData;

  // 新增：加载状态 & 错误提示
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ⭐ 创建订单（调用 /api/create-order）
  const handleCreateOrder = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car_model_id: initialData.car_model_id, // 车型 UUID
          start_date,
          end_date,
          departure_hotel,
          end_hotel,
          driver_lang,
          duration,
          price_total: total_price,
          deposit_amount: 500, // 固定押金
          name,
          phone,
          email,
          remark,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "创建订单失败，请稍后再试");
      }

      const newOrderId = data.orderId;

      if (!newOrderId) {
        throw new Error("服务返回的订单号为空");
      }

      // ⭐ 将 order_id 传给 Step4
      onNext({
        ...initialData,
        order_id: newOrderId,
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">

      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-3">订单预览</h2>
        <p className="text-gray-600">请确认以下订单信息，若无误请继续下一步。</p>
      </div>

      {/* 错误提示 */}
      {errorMsg && (
        <p className="text-red-600 text-center font-semibold">{errorMsg}</p>
      )}

      {/* 内容 */}
      <div className="bg-white shadow-md rounded-xl p-8 space-y-6">

        {/* 日期信息 */}
        <div>
          <h3 className="text-xl font-bold mb-3">📅 用车日期</h3>
          <p>开始日期：{start_date}</p>
          <p>结束日期：{end_date}</p>
          <p>出发酒店：{departure_hotel}</p>
          <p>回程酒店：{end_hotel}</p>
        </div>

        <hr />

        {/* 车型信息 */}
        <div>
          <h3 className="text-xl font-bold mb-3">🚗 车型 & 服务信息</h3>

          <p>车型：{carNameMap[car_model]}</p>
          <p>司机语言：{driver_lang === "zh" ? "中文司机" : "日文司机"}</p>
          <p>包车时长：{duration} 小时</p>

          <p className="mt-1 text-lg">包车费用：¥{total_price}</p>

          <p className="text-blue-600 font-semibold mt-2">
            押金：¥500（固定）
          </p>
        </div>

        <hr />

        {/* 联系信息 */}
        <div>
          <h3 className="text-xl font-bold mb-3">👤 客户信息</h3>
          <p>姓名：{name}</p>
          <p>电话：{phone}</p>
          <p>邮箱：{email}</p>
          <p>备注：{remark || "无"}</p>
        </div>
      </div>

      {/* 按钮 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          返回修改
        </Button>

        <Button
          className="bg-blue-600 text-white px-8 py-3"
          onClick={handleCreateOrder}
          disabled={loading}
        >
          {loading ? "创建订单中..." : "前往支付"}
        </Button>
      </div>
    </div>
  );
}

