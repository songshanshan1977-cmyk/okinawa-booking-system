import { useState, useEffect } from "react";

export default function Step1({ formData, setFormData, nextStep }) {
  const today = new Date().toISOString().split("T")[0]; // 当天日期 YYYY-MM-DD

  // 检查是否为当日
  const isSameDay = formData.date === today;

  return (
    <div style={{ padding: "20px" }}>
      <h2>选择用车日期与酒店</h2>

      {/* 日期 */}
      <label>用车日期：</label>
      <input
        type="date"
        value={formData.date}
        min={today}
        onChange={(e) =>
          setFormData({ ...formData, date: e.target.value })
        }
      />
      {isSameDay && (
        <p style={{ color: "red", marginTop: "5px" }}>
          ❌ 当日不能预约，请选择明天或更晚的日期
        </p>
      )}

      {/* 出发酒店 */}
      <label style={{ display: "block", marginTop: "20px" }}>
        出发酒店：
      </label>
      <input
        type="text"
        placeholder="请输入酒店名称"
        value={formData.hotelStart}
        onChange={(e) =>
          setFormData({ ...formData, hotelStart: e.target.value })
        }
      />

      {/* 结束酒店 */}
      <label style={{ display: "block", marginTop: "20px" }}>
        结束酒店：
      </label>
      <input
        type="text"
        placeholder="请输入酒店名称"
        value={formData.hotelEnd}
        onChange={(e) =>
          setFormData({ ...formData, hotelEnd: e.target.value })
        }
      />

      {/* 下一步按钮 */}
      <button
        disabled={isSameDay}
        onClick={nextStep}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          background: isSameDay ? "gray" : "black",
          color: "white",
          cursor: isSameDay ? "not-allowed" : "pointer",
        }}
      >
        下一步
      </button>
    </div>
  );
}
