import axios from 'axios'
import { useState } from 'react'

export default function Login() {
  const [u, setU] = useState('')
  const [p, setP] = useState('')

  const login = async () => {
    try {
      const r = await axios.post(
        '${process.env.NEXT_PUBLIC_API_URL}/login',   // ← 正しいログインAPI
        { username: u, password: p }
      )

      localStorage.setItem('token', r.data.token)
      location.href = r.data.role === "admin" ? '/admin' : '/'
    } catch (e) {
      alert('ログイン失敗：IDまたはパスワードが間違っています')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(#EAF6FF,#CDE8FF)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: '#fff',
        padding: 30,
        borderRadius: 20,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: '80%',
        maxWidth: 380
      }}>
        <h1 style={{ textAlign: 'center' }}>管理者ログイン</h1>

        <input
          placeholder='ユーザー名'
          style={{ width: '100%', padding: 10, marginTop: 10, borderRadius: 10, border: '1px solid #ccc' }}
          onChange={e => setU(e.target.value)}
        /><br />

        <input
          placeholder='パスワード'
          type='password'
          style={{ width: '100%', padding: 10, marginTop: 10, borderRadius: 10, border: '1px solid #ccc' }}
          onChange={e => setP(e.target.value)}
        /><br />

        <button
          onClick={login}
          style={{
            width: '100%',
            padding: 12,
            marginTop: 20,
            borderRadius: 12,
            background: '#58A9FF',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none'
          }}
        >
          ログイン
        </button>
      </div>
    </div>
  )
}
