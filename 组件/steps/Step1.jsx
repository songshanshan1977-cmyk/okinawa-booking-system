import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// 中文文案
const zh = {
  page_title: "立即预订",
  subtitle: "请选择您期望的包车开始和结束日期",
  start_date: "开始日期",
  end_date: "结束日期",
  departure_hotel: "出发酒店",
  end_hotel: "回程酒店",
  next: "下一步",
};

// 自动识别渠道（安全处理 window，防止 Vercel 报错）
const getSource = () => {
  if (typeof window === "undefined") return "direct";
  const params = new URLSearchParams(window.location.search);
  return params.get("from") || "direct";
};

export default function Step1({ initialData = {}, onNext }) {
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

  const [source] = useState(initialData.source || getSource());

  // -------------------
  // ❗ 已完全移除库存检查，只负责收集信息
  // -------------------

  const handleNext = () => {
    if (!startDate || !endDate) {
      alert("请选择开始日期和结束日期");
      return;
    }
    if (!departureHotel || !endHotel) {
      alert("请填写酒店名称");
      return;
    }

    // 把 Step1 收集到的数据传给 BookingFlow
    onNext({
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
      departure_hotel: departureHotel,
      end_hotel: endHotel,
      source,
    });
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-3">{zh.page_title}</h2>
        <p className="text-gray-600">{zh.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mx-auto max-w-4xl">
        <div className="flex flex-col items-center">
          <Label className="text-lg font-semibold">{zh.start_date}</Label>
          <Calendar
            onChange={setStartDate}
            value={startDate}
            minDate={new Date()}
          />
        </div>

        <div className="flex flex-col items-center">
          <Label className="text-lg font-semibold">{zh.end_date}</Label>
          <Calendar
            onChange={setEndDate}
            value={endDate}
            minDate={startDate || new Date()}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div>
          <Label>{zh.departure_hotel}</Label>
          <Input
            className="mt-2"
            value={departureHotel}
            onChange={(e) => setDepartureHotel(e.target.value)}
          />
        </div>

        <div>
          <Label>{zh.end_hotel}</Label>
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
          {zh.next}
        </Button>
      </div>
    </div>
  );
}
