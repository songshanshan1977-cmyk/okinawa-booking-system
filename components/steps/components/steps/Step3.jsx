export default function Step3({ data, onNext, onBack }) {
  return (
    <div>
      <h2>Step 3 — 预览订单（占位）</h2>
      <p>以后这里会展示所有填写好的信息。</p>
      <button onClick={onBack}>返回上一步</button>
      <button onClick={() => onNext({})} style={{ marginLeft: 8 }}>
        去支付（下一步）
      </button>
    </div>
  );
}
