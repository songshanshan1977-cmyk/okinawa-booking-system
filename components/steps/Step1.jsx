export default function Step1({ data, onNext }) {
  return (
    <div>
      <h2>Step 1 — 选择日期和车型（占位）</h2>
      <p>这里以后会放你真正的日期和车型表单。</p>
      <button onClick={() => onNext({})}>下一步</button>
    </div>
  );
}
