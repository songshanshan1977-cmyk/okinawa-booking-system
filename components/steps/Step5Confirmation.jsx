export default function Step5Confirmation({ onNext }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 5 — 付款成功！确认信息</h2>
      <button className="bg-blue-600 text-white p-3 rounded" onClick={onNext}>继续</button>
    </div>
  );
}
