export default function Step4Payment({ onNext, onBack }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 4 — 支付押金</h2>
      <button className="bg-gray-400 text-white p-3 rounded mr-3" onClick={onBack}>返回</button>
      <button className="bg-green-600 text-white p-3 rounded" onClick={() => onNext({})}>
        模拟支付成功
      </button>
    </div>
  );
}
