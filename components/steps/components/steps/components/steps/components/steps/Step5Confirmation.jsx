export default function Step5Confirmation({ data, onNext, onBack }) {
  return (
    <div>
      <h2>Step 5 — 订单确认（占位）</h2>
      <p>这里将来会显示：姓名、日期、酒店、金额等详情。</p>
      <button onClick={onBack}>返回上一步</button>
      <button onClick={() => onNext()} style={{ marginLeft: 8 }}>
        确认无误，继续
      </button>
    </div>
  );
}
