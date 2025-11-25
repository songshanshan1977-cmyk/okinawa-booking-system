export default function Step4Payment({ data, onNext, onBack }) {
  return (
    <div>
      <h2>Step 4 — 支付押金（暂时模拟）</h2>
      <p>现在先不接 Stripe，先做一个“模拟支付成功”的按钮。</p>
      <button onClick={onBack}>返回上一步</button>
      <button
        onClick={() => onNext({ paymentStatus: "mock-paid" })}
        style={{ marginLeft: 8 }}
      >
        模拟支付成功
      </button>
    </div>
  );
}
