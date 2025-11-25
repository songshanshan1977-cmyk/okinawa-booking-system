import React from "react";
import { Button } from "@/components/ui/button";

export default function Step3({ initialData, onNext, onBack }) {
  const {
    order_id,
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

  const carNameMap = {
    car1: "经济 5 座轿车",
    car2: "豪华 7 座阿尔法",
    car3: "舒适 10 座海狮",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">

      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-3">订单预览</h2>
        <p className="text-gray-600">请确认以下订单信息，若无误请继续下一步。</p>
        <p className="text-gray-500 mt-2 text-sm">订单编号：{order_id}</p>
      </div>

      {/* 内容区域 */}
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

          <p className="mt-1">包车费用：¥{total_price}</p>

          <p className="text-blue-600 font-semibold mt-2">
            押金：¥500（固定）
          </p>
        </div>

        <hr />

        {/* 个人信息 */}
        <div>
          <h3 className="text-xl font-bold mb-3">👤 客户信息</h3>
          <p>姓名：{name}</p>
          <p>电话：{phone}</p>
          <p>邮箱：{email}</p>
          <p>备注：{remark || "无"}</p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          返回修改
        </Button>

        <Button className="bg-blue-600 text-white px-8 py-3" onClick={onNext}>
          前往支付
        </Button>
      </div>
    </div>
  );
}
