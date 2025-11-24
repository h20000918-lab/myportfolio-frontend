import axios from "axios";
import { useState, useEffect } from "react";

export default function Admin() {
  const [token, setToken] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [d, setD] = useState({
    code: "",
    name: "",
    buy_price: "",
    shares: "",
    buy_amount: "",
  });

  // ログイン確認
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      alert("ログインが必要です");
      location.href = "/login";
      return;
    }
    setToken(t);
  }, []);

  // 銘柄一覧取得
  const loadStocks = async () => {
    const r = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stocks`);
    setStocks(r.data);
  };

  useEffect(() => {
    loadStocks();
  }, []);

  // 銘柄登録
  const save = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stocks`, d, {
      headers: { Authorization: "Bearer " + token },
    });
    alert("登録完了");
    loadStocks();
  };

  // 銘柄削除
  const del = async (id) => {
    if (!window.confirm("本当に削除しますか？")) return;

    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/stocks/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });

    alert("削除しました");
    loadStocks();
  };

  // 入力欄共通スタイル
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "linear-gradient(#EAF6FF, #CDE8FF)",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>
        銘柄登録（管理者専用）
      </h1>

      {/* ログアウト */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          location.href = "/login";
        }}
        style={{
          background: "#FF6262",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: "12px",
          border: "none",
          marginBottom: "20px",
          fontWeight: "bold",
          width: "100%",
          fontSize: "16px",
        }}
      >
        ログアウト
      </button>

      {/* 入力フォーム */}
      <input
        placeholder="銘柄コード"
        style={inputStyle}
        onChange={(e) => setD({ ...d, code: e.target.value })}
      />

      <input
        placeholder="銘柄名"
        style={inputStyle}
        onChange={(e) => setD({ ...d, name: e.target.value })}
      />

      <input
        placeholder="買付単価"
        style={inputStyle}
        onChange={(e) => setD({ ...d, buy_price: e.target.value })}
      />

      <input
        placeholder="株数"
        style={inputStyle}
        onChange={(e) => setD({ ...d, shares: e.target.value })}
      />

      <input
        placeholder="買付総額"
        style={inputStyle}
        onChange={(e) => setD({ ...d, buy_amount: e.target.value })}
      />

      <button
        onClick={save}
        style={{
          marginTop: "16px",
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          background: "#4A90E2",
          color: "white",
          border: "none",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        登録
      </button>

      {/* 銘柄一覧 */}
      <h2 style={{ marginTop: "40px", fontSize: "20px" }}>登録済み銘柄</h2>

      {stocks.map((s) => (
        <div key={s.id} style={cardStyle}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "6px",
            }}
          >
            {s.name}（{s.code}）
          </div>

          <div style={{ marginBottom: "4px" }}>買付額: {s.buy_amount}</div>
          <div style={{ marginBottom: "8px" }}>株数: {s.shares}</div>

          <button
            onClick={() => del(s.id)}
            style={{
              background: "red",
              color: "white",
              padding: "8px 12px",
              marginTop: "5px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
}
