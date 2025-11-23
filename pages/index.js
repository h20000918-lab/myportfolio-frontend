import axios from "axios";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function Home() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:3001/stocks").then((r) => {
      setStocks(r.data);
    });
  }, []);

  if (!stocks.length) return <div>読込中...</div>;

  // ============
  // ① 総合損益
  // ============
  const totalProfit = stocks.reduce(
    (sum, s) => sum + (s.current_price - s.buy_price) * s.shares,
    0
  );
  const totalBuyAmount = stocks.reduce((sum, s) => sum + s.buy_amount, 0);
  const totalProfitRate = ((totalProfit / totalBuyAmount) * 100).toFixed(2);

  const profitColor = totalProfit >= 0 ? "#2ecc71" : "#e74c3c";

  // ============
  // ② 年間配当
  // ============
  const allDividend = stocks.reduce(
    (sum, s) =>
      sum + s.current_price * (s.dividend_yield / 100) * s.shares,
    0
  );

  const totalValuation = stocks.reduce(
    (sum, s) => sum + s.current_price * s.shares,
    0
  );

  const weightedDividendYield = (
    (allDividend / totalValuation) *
    100
  ).toFixed(2);

  // ============
  // 円グラフデータ
  // ============
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

  // ============
  // iGrow カード
  // ============
  const cardStyle = {
    background: "linear-gradient(135deg, #ffffff, #e8f4ff)",
    padding: "18px",
    borderRadius: "20px",
    marginBottom: "18px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  const lineStyle = {
    marginTop: "4px",
    fontSize: "16px",
  };

  // ============
  // 損益ランキング（万円変換）
  // ============
  const barData = stocks
    .map((s) => ({
      name: s.name,
      profit_man: ((s.current_price - s.buy_price) * s.shares) / 10000, // ← 万円
    }))
    .sort((a, b) => b.profit_man - a.profit_man);

  // ============
  // レンダリング
  // ============
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#EAF6FF, #CDE8FF)",
        padding: "16px",
        position: "relative",
      }}
    >
      {/* ★ 右上に管理者ページボタン */}
      <a
        href="/admin"
        style={{
          position: "fixed",
          top: 15,
          right: 15,
          background: "rgba(255,255,255,0.8)",
          padding: "10px 16px",
          borderRadius: "18px",
          fontWeight: "bold",
          color: "#333",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        管理者
      </a>

      {/* 1: 総合損益 */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <div
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            color: profitColor,
            animation: "fadeblink 2s infinite",
          }}
        >
          {totalProfit >= 0
            ? `+${totalProfit.toLocaleString()}円`
            : `${totalProfit.toLocaleString()}円`}
        </div>
        <div style={{ fontSize: "24px", color: profitColor }}>
          ({totalProfitRate}%)
        </div>
      </div>

      {/* 2: 配当まとめ */}
      <div style={{ ...cardStyle, textAlign: "center" }}>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>📈 配当情報</div>
        <div style={{ fontSize: "22px", marginTop: 6 }}>
          総合配当利回り：<b>{weightedDividendYield}%</b>
        </div>
        <div style={{ fontSize: "22px" }}>
          年間配当金：<b>{allDividend.toLocaleString()}円</b>
        </div>
      </div>

      {/* 3: 円グラフ + 凡例 */}
      <div style={{ ...cardStyle, height: 330 }}>
        <div style={{ textAlign: "center", fontWeight: "bold" }}>🥧 資産構成比</div>

        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={90}>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 4: カード一覧 */}
      <h2 style={{ fontSize: 22, marginTop: 20 }}>📘 保有銘柄</h2>

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
            <div style={{ fontSize: "22px", fontWeight: "bold" }}>
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

      {/* 5: 損益ランキング */}
      <div style={{ ...cardStyle, marginTop: 20 }}>
        <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: 10 }}>
          📊 損益ランキング（万円）
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={barData} layout="vertical">
              <XAxis
                type="number"
                tickFormatter={(v) => `${v} 万`}
              />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip formatter={(v) => `${v.toFixed(1)} 万円`} />
              <Bar
                dataKey="profit_man"
                radius={[10, 10, 10, 10]}
                fill="#7EC1FF"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* フェード */}
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
