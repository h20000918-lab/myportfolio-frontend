import axios from "axios";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [stocks, setStocks] = useState([]);

  // ---- API ----
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/stocks`)
      .then((r) => setStocks(r.data))
      .catch((e) => console.error(e));
  }, []);

  if (!stocks.length)
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(20px, 6vw, 28px)",
        }}
      >
        読込中...
      </div>
    );

  // ---- 計算 ----
  const totalAssets = stocks.reduce(
    (sum, s) => sum + s.current_price * s.shares,
    0
  );

  const totalProfit = stocks.reduce(
    (sum, s) => sum + (s.current_price - s.buy_price) * s.shares,
    0
  );

  const totalBuyAmount = stocks.reduce((sum, s) => sum + s.buy_amount, 0);
  const totalProfitRate = ((totalProfit / totalBuyAmount) * 100).toFixed(2);
  const profitColor = totalProfit >= 0 ? "#2ecc71" : "#e74c3c";

  const allDividend = stocks.reduce(
    (sum, s) =>
      sum + s.current_price * (s.dividend_yield / 100) * s.shares,
    0
  );

  const weightedDividendYield = (
    (allDividend / totalAssets) * 100
  ).toFixed(2);

  // ---- 円グラフ ----
  const pieData = stocks.map((s) => ({
    name: s.name,
    value: s.current_price * s.shares,
  }));

  const pieColors = [
    "#A7D3FF",
    "#7EC1FF",
    "#58A9FF",
    "#8FD6C1",
    "#FFD59E",
    "#FFA2A2",
    "#C7B5FF",
    "#A3E4D7",
  ];

  const cardStyle = {
    background: "white",
    padding: "clamp(14px, 4vw, 24px)",
    borderRadius: "20px",
    marginBottom: "clamp(14px, 4vw, 24px)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  };

  const lineStyle = {
    marginTop: "4px",
    fontSize: "clamp(14px, 3.6vw, 18px)",
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(#EAF6FF, #CDE8FF)",
        padding: "clamp(12px, 4vw, 24px)",
      }}
    >
      {/* ---- 管理者リンク ---- */}
      <a
        href="/admin"
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          background: "rgba(255,255,255,0.75)",
          padding: "6px 12px",
          borderRadius: "14px",
          fontSize: "clamp(12px, 3.2vw, 16px)",
          fontWeight: "bold",
          color: "#333",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 10,
        }}
      >
        管理者
      </a>

      {/* ---- 総資産 ---- */}
      <div
        style={{
          textAlign: "center",
          fontSize: "clamp(24px, 6vw, 36px)",
          fontWeight: "bold",
          marginBottom: "clamp(16px, 5vw, 24px)",
        }}
      >
        💰 総資産：{totalAssets.toLocaleString()} 円
      </div>

      {/* ---- 損益 ---- */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "clamp(32px, 8vw, 46px)",
            fontWeight: "bold",
            color: profitColor,
            animation: "fadeblink 2s infinite",
          }}
        >
          {totalProfit >= 0
            ? `+${totalProfit.toLocaleString()}円`
            : `${totalProfit.toLocaleString()}円`}
        </div>
        <div
          style={{
            fontSize: "clamp(18px, 4.5vw, 26px)",
            color: profitColor,
          }}
        >
          ({totalProfitRate}%)
        </div>
      </div>

      {/* ---- 配当 ---- */}
      <div style={{ ...cardStyle, textAlign: "center" }}>
        <div style={{ fontSize: "clamp(18px, 5vw, 24px)", fontWeight: "bold" }}>
          📈 配当情報
        </div>
        <div style={{ fontSize: "clamp(18px, 5vw, 22px)", marginTop: 6 }}>
          総合配当利回り：<b>{weightedDividendYield}%</b>
        </div>
        <div style={{ fontSize: "clamp(18px, 5vw, 22px)" }}>
          年間配当金：<b>{allDividend.toLocaleString()}円</b>
        </div>
      </div>

      {/* ---- 円グラフ ---- */}
      <div style={{ ...cardStyle }}>
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "clamp(16px, 4vw, 22px)",
          }}
        >
          🥧 資産構成比
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={110}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={pieColors[index % pieColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => `${((v / totalAssets) * 100).toFixed(1)}%`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* ---- 凡例 ---- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 14px",
            marginTop: 10,
            padding: "0 6px",
          }}
        >
          {pieData.map((s, i) => {
            const percent = ((s.value / totalAssets) * 100).toFixed(1);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "clamp(12px, 3.5vw, 15px)",
                  wordBreak: "break-word",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    background: pieColors[i % pieColors.length],
                    borderRadius: 4,
                    marginRight: 6,
                  }}
                />
                {s.name}（{percent}%）
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- 保有銘柄 ---- */}
      <h2 style={{ fontSize: "clamp(20px, 5vw, 26px)", marginTop: 20 }}>
        📘 保有銘柄
      </h2>

      {stocks.map((s) => {
        const profit = (s.current_price - s.buy_price) * s.shares;
        const profitRate = (
          ((s.current_price - s.buy_price) / s.buy_price) *
          100
        ).toFixed(2);
        const dividend =
          s.current_price * (s.dividend_yield / 100) * s.shares;

        return (
          <div key={s.id} style={cardStyle}>
            <div
              style={{
                fontSize: "clamp(18px, 5vw, 24px)",
                fontWeight: "bold",
              }}
            >
              {s.name}（{s.code}）
            </div>

            <div style={lineStyle}>現在値：{s.current_price} 円</div>
            <div style={lineStyle}>買付単価：{s.buy_price} 円</div>
            <div style={lineStyle}>株数：{s.shares}</div>

            <div
              style={{
                ...lineStyle,
                fontWeight: "bold",
                color: profit >= 0 ? "#2ecc71" : "#e74c3c",
              }}
            >
              損益：
              {profit >= 0
                ? `+${profit.toLocaleString()}`
                : profit.toLocaleString()}
              円（{profitRate}%）
            </div>

            <div style={lineStyle}>配当利回り：{s.dividend_yield}%</div>
            <div style={lineStyle}>
              年間配当：{Math.floor(dividend).toLocaleString()} 円
            </div>
          </div>
        );
      })}

      {/* ---- 点滅アニメ ---- */}
      <style>
        {`
        @keyframes fadeblink {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        `}
      </style>
    </div>
  );
}
