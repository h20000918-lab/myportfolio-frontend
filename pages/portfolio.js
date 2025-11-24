
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../styles/Portfolio.module.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Portfolio(){
  const [stocks,setStocks]=useState([]);

  useEffect(()=>{
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stocks`).then(r=>{
      const sorted=r.data.sort((a,b)=>a.code.localeCompare(b.code));
      setStocks(sorted);
    });
  },[]);

  const data = stocks.map(s=>{
    const profit = (s.current_price - s.buy_price) * s.shares;
    return {
      name: s.name,
      profit: profit
    };
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ポートフォリオ</h1>

      {stocks.map(s=>{
        const profit = (s.current_price - s.buy_price) * s.shares;
        const profitRate = ((s.current_price - s.buy_price)/s.buy_price*100).toFixed(2);
        const dividend = (s.current_price * (s.dividend_yield/100)) * s.shares;

        return (
          <div key={s.id} className={styles.card}>
            <div className={styles.name}>{s.name}（{s.code}）</div>
            <div className={styles.line}>現在値：{s.current_price} 円</div>
            <div className={styles.line}>買付単価：{s.buy_price} 円</div>
            <div className={styles.line}>株数：{s.shares}</div>
            <div className={profit>=0?styles.profit:styles.loss}>
              損益：{profit>=0?`+${profit}`:profit} 円（{profitRate}%）
            </div>
            <div className={styles.line}>配当利回り：{s.dividend_yield}%</div>
            <div className={styles.line}>年間配当：{Math.floor(dividend)} 円</div>
          </div>
        );
      })}

      <h2 className={styles.subtitle}>損益グラフ</h2>
      <div className={styles.chartBox}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <Tooltip/>
          <Bar dataKey="profit" fill="#4CAF50"/>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
