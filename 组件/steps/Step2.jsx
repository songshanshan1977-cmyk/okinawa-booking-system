import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ---------------------
// 车型 UUID 映射（你提供的）
// ---------------------
const CAR_MODEL_IDS = {
  car1: "5fdce9d4-2ef3-42ca-9d0c-a06446b0d9ca", // 经济型
  car2: "82cf604f-e688-49fe-aecf-69894a01f6cb", // 阿尔法
  car3: "453df662-d350-4ab9-b811-61ffcda40d4b", // 海狮
};

// ---------------------
// 价格表（人民币）
// ---------------------
const PRICE_TABLE = {
  car1: {
    name: "经济 5 座轿车",
    zh: { h8: 1800, h10: 2000 },
    jp: { h8: 1600, h10: 1800 },
  },
  car2: {
    name: "豪华 7 座阿尔法",
    zh: { h8: 2300, h10: 2500 },
    jp: { h8: 2100, h10: 2300 },
  },
  car3: {
    name: "舒适 10 座海狮",
    zh: { h8: 2600, h10: 2800 },
    jp: { h8: 2400, h10: 2600 },
  },
};

export default function Step2({ initialData, onNext, onBack }) {
  // 继承 Step1 的 order_id
  const orderId = initialData.order_id;

  const [people, setPeople] = useState(initialData.people_count || 1);
  const [luggage, setLuggage] = useState(initialData.luggage_count || 1);

  const [carModel, setCarModel] = useState(initialData.car_model || "car1");
  const [driverLang, setDriverLang] = useState(initialData.driver_lang || "zh");
  const [duration, setDuration] = useState(initialData.duration || 8);

  const [name, setName] = useState(initialData.name || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [email, setEmail] = useState(initialData.email || "");

  // 自动计算价格
  const totalPrice =
    PRICE_TABLE[carModel][driverLang][duration === 8 ? "h8" : "h10"];

  const goNext = () => {
    if (!name || !phone || !email) {
      alert("请填写完整个人信息");
      return;
    }

    onNext({
      ...initialData,
      order_id: orderId, // ⭐ 必须继续向下传
      people_count: people,
      luggage_count: luggage,
      car_model: carModel,
      car_model_id: CAR_MODEL_IDS[carModel], // ⭐ 自动写入 UUID
      driver_lang: driverLang,
      duration,
      total_price: totalPrice,
      name,
      phone,
      email,
    });
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* 左侧内容 */}
      <div className="md:col-span-2 space-y-10">
        {/* 显示订单号 */}
        <p className="text-gray-500 text-sm">订单编号：{orderId}</p>

        {/* 人数 行李 */}
        <div className="flex justify-around">
          <div className="text-center">
            <Label>人数</Label>
            <div className="flex items-center gap-4 mt-2">
              <Button variant="outline" onClick={() => setPeople(Math.max(1, people - 1))}>-</Button>
              <span className="text-xl">{people}</span>
              <Button variant="outline" onClick={() => setPeople(people + 1)}>+</Button>
            </div>
          </div>

          <div className="text-center">
            <Label>行李件数</Label>
            <div className="flex items-center gap-4 mt-2">
              <Button variant="outline" onClick={() => setLuggage(Math.max(0, luggage - 1))}>-</Button>
              <span className="text-xl">{luggage}</span>
              <Button variant="outline" onClick={() => setLuggage(luggage + 1)}>+</Button>
            </div>
          </div>
        </div>

        {/* 车型 */}
        <div>
          <Label className="text-lg font-bold">选择车型</Label>
          <div className="flex gap-3 mt-3">
            <Button className={carModel === "car1" ? "bg-blue-600 text-white" : ""} variant="outline"
              onClick={() => setCarModel("car1")}>经济 5 座轿车</Button>

            <Button className={carModel === "car2" ? "bg-blue-600 text-white" : ""} variant="outline"
              onClick={() => setCarModel("car2")}>豪华 7 座阿尔法</Button>

            <Button className={carModel === "car3" ? "bg-blue-600 text-white" : ""} variant="outline"
              onClick={() => setCarModel("car3")}>舒适 10 座海狮</Button>
          </div>
        </div>

        {/* 司机语言 */}
        <div>
          <Label className="text-lg font-bold">选择司机语言</Label>
          <div className="flex gap-3 mt-3">
            <Button className={driverLang === "zh" ? "bg-blue-600 text-white" : ""} variant="outline"
              onClick={() => setDriverLang("zh")}>中文司机</Button>

            <Button className={driverLang === "jp" ? "bg-blue-600 text-white" : ""} variant="outline"
              onClick={() => setDriverLang("jp")}>日文司机</Button>
          </div>
        </div>

        {/* 时长 */}
        <div>
          <Label className="text-lg font-bold">包车时长</Label>
          <div className="flex gap-3 mt-3">
            <Button className={duration === 8 ? "bg-blue-600 text-white" : ""} variant="outline"
              onClick={() => setDuration(8)}>8 小时</Button>

            <Button className={duration === 10 ? "bg-blue-600 text-white" : ""} variant="outline"
              onClick={() => setDuration(10)}>10 小时</Button>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="space-y-4">
          <Label className="text-lg font-bold">您的联系方式</Label>

          <Input placeholder="姓名" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="电话" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      {/* 右侧费用总览 */}
      <div className="border p-6 rounded-xl shadow-md bg-white h-fit">
        <h2 className="text-xl font-bold mb-4">费用总览</h2>

        <p>已选车型：{PRICE_TABLE[carModel].name}</p>
        <p>司机语言：{driverLang === "zh" ? "中文司机" : "日文司机"}</p>
        <p>时长：{duration} 小时</p>

        <div className="mt-3 text-lg font-bold">
          包车费用：¥{totalPrice}
        </div>

        <div className="mt-2 text-blue-600">
          押金：¥500（固定）
        </div>

        <Button className="w-full mt-6 bg-blue-600 text-white" onClick={goNext}>
          下一步：确认订单
        </Button>

        <Button variant="outline" className="w-full mt-3" onClick={onBack}>
          返回上一步
        </Button>
      </div>
    </div>
  );
}
