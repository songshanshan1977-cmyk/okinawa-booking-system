import { useEffect } from "react";
import { useRouter } from "next/router";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { order_id } = router.query;

    if (order_id) {
      // 1秒后跳转到主流程 Step6Final
      setTimeout(() => {
        router.push(`/booking?step=6&order_id=${order_id}`);
      }, 1000);
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-green-600">付款成功！</h1>
      <p className="mt-4 text-gray-600">正在生成确认单，请稍候…</p>
    </div>
  );
}
