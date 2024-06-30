"use client";
import { callAPI } from "../../utils/api-caller";
import { isLogined, setToken, setUser } from "../../utils/helper";
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import "../../styles/style.css"
import { useSession, signIn, signOut } from "next-auth/react"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorText, setErrorText] = useState("")
  const { data: session } = useSession()

  const router = useRouter()
  const onLoginClick = async () => {
    try {
      await signIn("credentials", {
        redirect: false,
        identifier: email,
        password
      })
    } catch (error) {
      setErrorText("Sai tài khoản hoặc mật khẩu!")
      console.log(error)
    }


  }
  useEffect(() => {
    if (isLogined()) {
      router.replace("/")
    }
  }, [])

  useEffect(() => {
    if (session) {
      setUser(session.user)
      setToken(session.strapiToken)
      router.replace("/")
    }
  }, [session])


  return (
    <section style={{ backgroundColor: '#ffffff', color: '#1f2937', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'ALEGREYA-REGULAR' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
        <div className="pb-5">
          <img style={{ width: '60px', height: '60px', marginRight: '8px', borderRadius: '50%' }} src="images/logo-codae-symbol.png" alt="logo" />

        </div>


        <div style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} action="#">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img style={{ width: '30%', height: '30%', justifyContent: 'center', alignItems: 'center' }} src="images/login-text.png" alt="logo" />

            </div>
            <div>
              <label htmlFor="email" style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Email</label>
              <input type="email" name="email" id="email" style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937', fontSize: '14px', borderRadius: '8px', border: '1px solid', width: '100%', padding: '10px' }} placeholder="name@gmail.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrorText("") }} required="" />
            </div>
            <div>
              <label htmlFor="password" style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Mật khẩu</label>
              <input type="password" name="password" id="password" style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937', fontSize: '14px', borderRadius: '8px', border: '1px solid', width: '100%', padding: '10px' }} placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setErrorText("") }} required="" />
            </div>
            <span style={{ color: 'red' }}>{errorText}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input id="remember" type="checkbox" style={{ width: '16px', height: '16px', backgroundColor: '#ffffff', borderColor: '#d1d5db', borderRadius: '4px', marginRight: '8px' }} />
                <label htmlFor="remember" style={{ fontSize: '14px', color: '#6b7280' }}>Nhớ tài khoản</label>
              </div>
              <a href="#" style={{ fontSize: '14px', color: 'black' }}>Quên mật khẩu?</a>
            </div>
            <button onClick={onLoginClick} type="button" style={{ backgroundColor: 'black', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', textAlign: 'center', cursor: 'pointer' }}>
              Đăng nhập
            </button>
            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
              <hr style={{ flex: 1, height: '1px', backgroundColor: '#d1d5db', border: 'none' }} />
              <span style={{ margin: '0 8px', fontSize: '14px', color: '#6b7280' }}>Hoặc tiếp tục với</span>
              <hr style={{ flex: 1, height: '1px', backgroundColor: '#d1d5db', border: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={(e) => { e.preventDefault(); signIn("google"); }} type="button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d1d5db', border: '1px solid', borderRadius: '8px', fontSize: '14px', padding: '8px 16px', width: '100%', cursor: 'pointer' }}>
                <img src="images/google.png" alt="Google" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Google
              </button>
              <button type="button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d1d5db', border: '1px solid', borderRadius: '8px', fontSize: '14px', padding: '8px 16px', width: '100%', cursor: 'pointer' }}>
                <img src="images/facebook.png" alt="Facebook" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Facebook
              </button>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginTop: '16px' }}>
              Chưa có tài khoản? <a href="/register" style={{ color: 'black' }}>Đăng ký tài khoản Codae Records</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;