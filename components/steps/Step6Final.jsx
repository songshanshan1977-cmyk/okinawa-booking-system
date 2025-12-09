import React from "react";
import { Button } from "@/components/ui/button";

export default function Step6Final({ initialData }) {
  const { order_id } = initialData || {};

  return (
    <div className="max-w-xl mx-auto text-center p-6 space-y-8">

      {/* 标题 */}
      <h2 className="text-3xl font-bold text-green-600">
        🎉 订单已确认！
      </h2>

      {/* 订单编号 */}
      <div className="text-lg font-semibold">
        您的订单编号：
        <span className="text-blue-600">{order_id}</span>
      </div>

      {/* 感谢语 */}
      <p className="text-gray-600 leading-relaxed">
        感谢您选择 <span className="font-bold text-black">华人 Okinawan</span>。
        我们的客服将会在 <span className="text-black font-semibold">24 小时内</span> 与您确认行程细节。
      </p>

      {/* 微信二维码 */}
      <div className="flex justify-center">
        <img
          src="https://xljenmxsmhmghtrlilat.supabase.co/storage/v1/object/public/qrcode/29a9e1499bcc3927681a151de8553a47.png"
          alt="客服微信二维码"
          className="w-60 h-60 rounded-xl shadow-md border"
        />
      </div>

      <p className="text-gray-500 text-sm">
        扫码添加客服微信（请备注订单编号）
      </p>

      {/* 按钮：返回首页 */}
      <Button
        onClick={() => (window.location.href = "/")}
        className="w-full bg-blue-600 text-white py-3 text-lg"
      >
        返回首页
      </Button>
    </div>
  );
}
