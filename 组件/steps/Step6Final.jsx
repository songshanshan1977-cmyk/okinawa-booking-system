import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function Step6Final({ initialData }) {
  return (
    <Card className="w-full max-w-2xl mx-auto text-center p-6">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <CardTitle className="text-3xl text-green-600">
          预订成功！
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-lg text-gray-700">
          感谢您，{initialData?.name}！
        </p>

        <p className="text-muted-foreground">
          您的订单已经确认，我们已经将确认邮件发送到：
          <strong>{initialData?.email}</strong>
        </p>

        {/* 订单编号 */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-800">
            订单编号：<strong>{initialData?.orderId}</strong>
          </p>
        </div>

        {/* 售后微信二维码 */}
        <div className="mt-8">
          <p className="text-gray-700 font-medium mb-3">添加售后客服微信</p>
          <img
            src="/mnt/data/9fd219807c74ea074dedd6e37d05c9d5.png"
            alt="售后微信二维码"
            className="mx-auto w-48 h-48 rounded-lg border shadow"
          />
          <p className="text-sm text-gray-500 mt-2">
            扫描二维码，获取订单售后服务
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button
          size="lg"
          className="px-8 py-3 bg-blue-600 text-white"
          onClick={() => (window.location.href = "/")}
        >
          返回首页
        </Button>
      </CardFooter>
    </Card>
  );
}
