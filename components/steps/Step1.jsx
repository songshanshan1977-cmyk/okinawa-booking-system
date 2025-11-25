export default function Step1({ onNext, initialData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 1 — 选择日期 & 车型</h2>
      <button className="bg-blue-600 text-white p-3 rounded" onClick={() => onNext({})}>
        下一步
      </button>
    </div>
  );
}
