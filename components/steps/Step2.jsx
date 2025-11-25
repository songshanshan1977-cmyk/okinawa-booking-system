export default function Step2({ data, onNext, onBack }) {
  return (
    <div>
      <h2>Step 2 — 填写基本信息（占位）</h2>
      <p>这里以后会加“不能当日预约”的规则。</p>
      <button onClick={onBack}>返回上一步</button>
      <button onClick={() => onNext({})} style={{ marginLeft: 8 }}>
        下一步
      </button>
    </div>
  );
}
