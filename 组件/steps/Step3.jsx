import React from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

// ⭐ 你的 Supabase 配置（从环境变量读取）
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Step3({ initialData, onNext, onBack }) {
  const {
    order_id,
    car_model,
    driver_lang,
    duration,
    start_date,
    end_date,
    departure_hotel,
    end_hotel,
    total_price,
    name,
    phone,
    email,
    remark,
  } = initialData;

  const carNameMap = {
    car1: "经济 5 座轿车",
    car2: "豪华 7 座阿尔法",
    car3: "舒适 10 座海狮",
  };

  // ⭐ 点击按钮 → 写入 Supabase → 再跳 Step4
  const handleCreateOrder = async () => {
    const { data, error } = await supabase.from("orders").insert([
      {
        order_id: order_id,
        car_model_id: initialData.car_model_id,
        driver_lang,
        duration,
        start_date,
        end_date,
        departure_hotel,
        end_hotel,
        total_price,
        deposit_amount: 500,
        name,
        phone,
        email,
        remark,
        status: "pending",
      },
    ]);

    console.log("📌 插入订单返回：", data, error);

    if (error) {
      alert("订单创建失败：" + error.message);
      return;
    }

    // ⭐ 插入成功 → 前往 Step4
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-3">订单预览</h2>
        <p className="text-gray-600">请确认以下订单信息</p>
        <p className="text-gray-500 mt-2 text-sm">订单编号：{order_id}</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-8 space-y-6">
        <h3 className="text-xl font-bold mb-3">📅 用车日期</h3>
        <p>开始日期：{start_date}</p>
        <p>结束日期：{end_date}</p>
        <p>出发酒店：{departure_hotel}</p>
        <p>回程酒店：{end_hotel}</p>

        <hr />

        <h3 className="text-xl font-bold mb-3">🚗 车型信息</h3>
        <p>车型：{carNameMap[car_model]}</p>
        <p>司机语言：{driver_lang}</p>
        <p>包车时长：{duration} 小时</p>
        <p>包车费用：¥{total_price}</p>
        <p className="text-blue-600 font-semibold mt-2">押金：¥500（固定）</p>

        <hr />

        <h3 className="text-xl font-bold mb-3">👤 客户信息</h3>
        <p>姓名：{name}</p>
        <p>电话：{phone}</p>
        <p>邮箱：{email}</p>
        <p>备注：{remark || "无"}</p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          返回修改
        </Button>

        {/* ⭐ 改为创建订单 */}
        <Button
          className="bg-blue-600 text-white px-8 py-3"
          onClick={handleCreateOrder}
        >
          创建订单并前往支付
        </Button>
      </div>
    </div>
  );
}

