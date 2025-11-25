import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Step5Confirmation({ initialData, onNext, onBack }) {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          支付成功 · 订单确认
        </CardTitle>
        <p className="text-gray-500 text-sm mt-2">
          您的押金已支付成功，请核对订单信息。
        </p>
        <p className="text-sm text-gray-600 mt-1">
          订单编号：<span className="font-semibold">{initialData.order_id}</span>
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 用车信息 */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h3 className="font-bold text-gray-700">📅 用车信息</h3>
          <p>开始日期：{initialData.start_date}</p>
          <p>结束日期：{initialData.end_date}</p>
          <p>出发酒店：{initialData.departure_hotel}</p>
          <p>回程酒店：{initialData.end_hotel}</p>
        </div>

        <Separator />

        {/* 车型信息 */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h3 className="font-bold text-gray-700">🚗 服务信息</h3>
          <p>车型：{initialData.car_model}</p>
          <p>司机语言：{initialData.driver_lang === "zh" ? "中文司机" : "日文司机"}</p>
          <p>包车时长：{initialData.duration} 小时</p>
          <p>包车总价：¥{initialData.total_price}</p>
        </div>

        <Separator />

        {/* 客人信息 */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h3 className="font-bold text-gray-700">👤 客户信息</h3>
          <p>姓名：{initialData.name}</p>
          <p>电话：{initialData.phone}</p>
          <p>邮箱：{initialData.email}</p>
        </div>

        <Separator />

        {/* 支付信息 */}
        <div className="flex justify-between items-center font-bold">
          <span>已支付押金</span>
          <span className="text-xl text-blue-600">¥500</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          返回
        </Button>

        <Button
          className="bg-blue-600 text-white px-6"
          onClick={() => onNext(initialData)}
        >
          完成订单
        </Button>
      </CardFooter>
    </Card>
  );
}
