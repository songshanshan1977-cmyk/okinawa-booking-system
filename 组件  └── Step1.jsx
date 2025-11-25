import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// -------------------
// ⭐ 订单号自动生成
// -------------------
function generateOrderId() {
  const timestamp = Date.now();
  return `ORD-${timestamp}`;
}

// -------------------
// ⭐ 自动识别渠道 source
// -------------------
const getSource = () => {
  if (typeof window === "undefined") return "direct";
  const params = new URLSearchParams(window.location.search);
  return params.get("from") || "direct";
};

export default function Step1({ initialData = {}, onNext }) {
  // ⭐ 第一次进入时生成订单号（如果不存在）
  const [orderId] = useState(initialData.order_id || generateOrderId());

  const [startDate, setStartDate] = useState(
    initialData.start_date ? new Date(initialData.start_date) : null
  );

  const [endDate, setEndDate] = useState(
    initialData.end_date ? new Date(initialData.end_date) : null
  );

  const [departureHotel, setDepartureHotel] = useState(
    initialData.departure_hotel || ""
  );

  const [endHotel, setEndHotel] = useState(initialData.end_hotel || "");

  const [source] = useState(getSource());

  const today = new Date().toISOString().split("T")[0];
  const isSameDay = startDate
    ? startDate.toISOString().split("T")[0] === today
    : false;

  const handleNext = () => {
    if (!startDate || !endDate) {
      alert("请选择开始日期和结束日期");
      return;
    }
    if (!departureHotel || !endHotel) {
      alert("请填写酒店名称");
      return;
    }
    if (isSameDay) {
      alert("❌ 当日不能预约，请选择明天或之后的日期");
      return;
    }

    onNext({
      order_id: orderId, // ⭐ 订单号从 Step1 开始就写入
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
      departure_hotel: departureHotel,
      end_hotel: endHotel,
      source: source,
    });
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-3">立即预订</h2>
        <p className="text-gray-600">请选择您期望的包车开始和结束日期</p>
        <p className="mt-2 text-sm text-gray-500">订单编号：{orderId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mx-auto max-w-4xl">
        <div className="flex flex-col items-center">
          <Label className="text-lg font-semibold">开始日期</Label>
          <Calendar value={startDate} onChange={setStartDate} minDate={new Date()} />
          {isSameDay && (
            <p className="text-red-500 mt-2 text-sm">
              ❌ 当日不能预约，请选择明天之后日期
            </p>
          )}
        </div>

        <div className="flex flex-col items-center">
          <Label className="text-lg font-semibold">结束日期</Label>
          <Calendar
            value={endDate}
            onChange={setEndDate}
            minDate={startDate || new Date()}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div>
          <Label>出发酒店</Label>
          <Input
            className="mt-2"
            value={departureHotel}
            onChange={(e) => setDepartureHotel(e.target.value)}
          />
        </div>

        <div>
          <Label>回程酒店</Label>
          <Input
            className="mt-2"
            value={endHotel}
            onChange={(e) => setEndHotel(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto flex justify-end">
        <Button
          onClick={handleNext}
          className="px-8 py-3 bg-blue-600 text-white text-lg"
        >
          下一步
        </Button>
      </div>
    </div>
  );
}

