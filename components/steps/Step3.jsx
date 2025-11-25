export default function Step3({ onNext, onBack }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 3 — 预览订单</h2>
      <button className="bg-gray-400 text-white p-3 rounded mr-3" onClick={onBack}>返回</button>
      <button className="bg-blue-600 text-white p-3 rounded" onClick={() => onNext({})}>去支付</button>
    </div>
  );
}
