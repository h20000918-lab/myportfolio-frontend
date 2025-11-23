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

  // ★ ページ読み込み時にログイン確認
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      alert("ログインが必要です");
      location.href = "/login";
      return;
    }
    setToken(t);
  }, []);

  // ★ 銘柄一覧
  const loadStocks = async () => {
    const r = await axios.get("https://myportfolio-backend-k0tc.onrender.com/stocks");
    setStocks(r.data);
  };

  useEffect(() => {
    loadStocks();
  }, []);

  // ★ 銘柄登録
  const save = async () => {
    await axios.post("https://myportfolio-backend-k0tc.onrender.com/stocks", d, {
      headers: { Authorization: "Bearer " + token },
    });
    alert("登録完了");
    loadStocks();
  };

  // ★ 銘柄削除
  const del = async (id) => {
    if (!window.confirm("本当に削除しますか？")) return;

    await axios.delete(`http://localhost:3001/stocks/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });

    alert("削除しました");
    loadStocks();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>銘柄登録（管理者専用）</h1>

      {/* ログアウト */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          location.href = "/login";
        }}
        style={{
          background: "#FF6262",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: 10,
          border: "none",
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        ログアウト
      </button>

      {/* 入力フォーム */}
      <input
        placeholder="銘柄コード"
        onChange={(e) => setD({ ...d, code: e.target.value })}
      />
      <br />
      <input
        placeholder="銘柄名"
        onChange={(e) => setD({ ...d, name: e.target.value })}
      />
      <br />
      <input
        placeholder="買付単価"
        onChange={(e) => setD({ ...d, buy_price: e.target.value })}
      />
      <br />
      <input
        placeholder="株数"
        onChange={(e) => setD({ ...d, shares: e.target.value })}
      />
      <br />
      <input
        placeholder="買付総額"
        onChange={(e) => setD({ ...d, buy_amount: e.target.value })}
      />
      <br />

      <button onClick={save} style={{ marginTop: 10 }}>
        登録
      </button>

      {/* 銘柄一覧 */}
      <h2 style={{ marginTop: 40 }}>登録済み銘柄</h2>

      {stocks.map((s) => (
        <div
          key={s.id}
          style={{
            border: "1px solid #aaa",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <b>{s.name}</b>（{s.code}）
          <br />
          買付額: {s.buy_amount}
          <br />
          株数: {s.shares}
          <br />

          <button
            onClick={() => del(s.id)}
            style={{
              background: "red",
              color: "white",
              padding: "5px 10px",
              marginTop: 5,
            }}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
}
