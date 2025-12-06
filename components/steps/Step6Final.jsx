import React from "react";
import { Button } from "@/components/ui/button";

export default function Step6Final({ initialData }) {
  if (!initialData) {
    return (
      <div className="max-w-2xl mx-auto text-center p-10">
        <h2 className="text-2xl font-bold mb-4">订单载入中…</h2>
        <p className="text-gray-500">如果长时间无反应，请返回首页。</p>
        <Button className="mt-6" onClick={() => (window.location.href = "/")}>
          返回首页
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 text-center space-y-8">
      {/* 标题 */}
      <h1 className="text-4xl font-bold text-green-600">🎉 订单完成！</h1>
      <p className="text-gray-600 text-lg">
        感谢您选择 <span className="font-bold">华人Okinawan</span>  
        我们已经收到您的预约，会尽快与您确认行程。
      </p>

      {/* 订单编号 */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md">
        <p className="text-xl text-gray-700 font-semibold">您的订单编号</p>
        <p className="text-3xl font-bold text-blue-600 mt-2">
          {initialData.order_id}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          （请截图保存订单编号方便售后查询）
        </p>
      </div>

      {/* 微信二维码 */}
      <div className="space-y-4">
        <p className="text-lg font-semibold text-gray-700">
          如需联系客服，请添加微信联络我们：
        </p>

        <img
          src="https://xljenmxsmhmghtrlilat.supabase.co/storage/v1/object/public/qrcode/29a9e1499bcc3927681a151de8553a47.png"
          alt="WeChat QR"
          className="w-64 h-64 mx-auto rounded-xl shadow-lg"
        />

        <p className="text-gray-500 text-sm">
          长按二维码识别或保存后添加好友
        </p>
      </div>

      {/* 返回首页 */}
      <Button
        className="mt-6 bg-blue-600 text-white text-lg px-10 py-3"
        onClick={() => (window.location.href = "/")}
      >
        返回首页
      </Button>
    </div>
  );
}
