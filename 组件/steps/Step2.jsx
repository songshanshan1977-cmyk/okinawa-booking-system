import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/lib/supabaseClient";

// ---------------------------
// Step2：从 Supabase 实时读取车型与价格
// ---------------------------
export default function Step2({ initialData, onNext, onBack }) {
  const [carList, setCarList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [people, setPeople] = useState(initialData.pax || 1);
  const [luggage, setLuggage] = useState(initialData.luggage || 1);

  const [carModel, setCarModel] = useState(initialData.car_model || "car1");
  const [driverLang, setDriverLang] = useState(initialData.driver_lang || "zh");
  const [duration, setDuration] = useState(initialData.duration || 8);

  const [name, setName] = useState(initialData.name || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [email, setEmail] = useState(initialData.email || "");

  // ----------------------------------------------------
  // 1. 从 Supabase 读取 cars 表
  // ----------------------------------------------------
  useEffect(() => {
    async function loadCars() {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "active");

      if (error) {
        console.error("读取车型失败：", error.message);
        return;
      }

      // 排序保持 car1 car2 car3 顺序
      const sorted = [
        data.find((c) => c.name_zh.includes("经济")),
        data.find((c) => c.name_zh.includes("阿尔法")),
        data.find((c) => c.name_zh.includes("海狮")),
      ].filter(Boolean);

      setCarList(sorted);
      setLoading(false);
    }

    loadCars();
  }, []);

  // ----------------------------------------------------
  // 2. ⭕ 自动计算价格（实时）
  // ----------------------------------------------------
  const activeCar = carList[["car1", "car2", "car3"].indexOf(carModel)];

  const totalPrice = activeCar
    ? driverLang === "zh"
      ? duration === 8
        ? activeCar.price_cn_8h
        : activeCar.price_cn_10h
      : duration === 8
        ? activeCar.price_jp_8h
        : activeCar.price_jp_10h
    : 0;

  // ----------------------------------------------------
  // 3. 下一步：保留订单号，不覆盖 initialData
  // ----------------------------------------------------
  const goNext = () => {
    if (!name || !phone || !email) {
      alert("请填写完整联系方式");
      return;
    }

    if (!activeCar) {
      alert("车型数据载入失败");
      return;
    }

    onNext({
      ...initialData, // ⭐ 绝对不能丢，否则订单ID会丢失

      pax: people,
      luggage: luggage,

      car_model: carModel,
      car_model_id: activeCar.id, // ⭐ 使用数据库真实 UUID

      driver_lang: driverLang,
      duration: duration,
      total_price: totalPrice,

      name,
      phone,
      email,
    });
  };

  if (loading) return <div>正在加载车型数据...</div>;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

      {/* ---------------- 左侧表单 ---------------- */}
      <div className="md:col-span-2 space-y-10">

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

        {/* 车型选择 */}
        <div>
          <Label className="text-lg font-bold">选择车型</Label>
          <div className="flex gap-3 mt-3">
            {carList.map((car, idx) => {
              const key = ["car1", "car2", "car3"][idx];
              return (
                <Button
                  key={car.id}
                  className={carModel === key ? "bg-blue-600 text-white" : ""}
                  variant="outline"
                  onClick={() => setCarModel(key)}
                >
                  {car.name_zh}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 司机语言 */}
        <div>
          <Label className="text-lg font-bold">选择司机语言</Label>
          <div className="flex gap-3 mt-3">
            <Button
              className={driverLang === "zh" ? "bg-blue-600 text-white" : ""}
              variant="outline"
              onClick={() => setDriverLang("zh")}
            >
              中文司机
            </Button>
            <Button
              className={driverLang === "jp" ? "bg-blue-600 text-white" : ""}
              variant="outline"
              onClick={() => setDriverLang("jp")}
            >
              日文司机
            </Button>
          </div>
        </div>

        {/* 时长 */}
        <div>
          <Label className="text-lg font-bold">包车时长</Label>
          <div className="flex gap-3 mt-3">
            <Button
              className={duration === 8 ? "bg-blue-600 text-white" : ""}
              variant="outline"
              onClick={() => setDuration(8)}
            >
              8 小时
            </Button>
            <Button
              className={duration === 10 ? "bg-blue-600 text-white" : ""}
              variant="outline"
              onClick={() => setDuration(10)}
            >
              10 小时
            </Button>
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

        <p>已选车型：{activeCar.name_zh}</p>
        <p>司机语言：{driverLang === "zh" ? "中文司机" : "日文司机"}</p>
        <p>时长：{duration} 小时</p>

        <div className="mt-3 text-lg font-bold">包车费用：¥{totalPrice}</div>
        <div className="mt-2 text-blue-600">押金：¥500（固定）</div>

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

