import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabaseClient";

export default function Step5Confirmation({ initialData, onNext, onBack }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------------
  // 1. 载入订单（避免刷新后的 initialData 丢失）
  // -------------------------------------
  useEffect(() => {
    const loadOrder = async () => {
      if (!initialData?.order_id) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_id", initialData.order_id)
        .single();

      if (!error) setOrder(data);
      setLoading(false);
    };

    loadOrder();
  }, []);

  // -------------------------------------
  // 载入中
  // -------------------------------------
  if (loading || !order) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">订单载入中…</h2>
        <p className="text-gray-500">请稍候</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>支付成功！确认订单信息</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          押金已支付，车辆档期已锁定（库存已在后台扣减）
        </p>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-500">订单编号：</span>
            <span className="col-span-2 text-blue-600">{order.order_id}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-500">姓名：</span>
            <span className="col-span-2">{order.name}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-500">车型：</span>
            <span className="col-span-2">{order.car_model}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-500">日期：</span>
            <span className="col-span-2">
              {order.start_date} ~ {order.end_date}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center font-bold">
          <span>已支付押金</span>
          <span className="text-xl text-green-600">¥500</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>返回</Button>
        <Button onClick={() => onNext(order)}>继续</Button>
      </CardFooter>
    </Card>
  );
}
