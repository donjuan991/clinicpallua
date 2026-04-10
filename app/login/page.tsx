// app/login/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isLogin 
            ? { email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password, name: formData.name, phone: formData.phone }
        ),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Ошибка при входе');
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9f9f9',
      padding: '100px 20px 60px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(119, 29, 85, 0.15)',
        border: '1px solid #e8e8e8'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #771d55 0%, #9a366e 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <i className="fas fa-heartbeat" style={{ fontSize: '32px', color: 'white' }}></i>
          </div>
          <h1 style={{ fontSize: '24px', color: '#771d55', marginBottom: '10px' }}>Клиника Паллуа</h1>
          <p style={{ color: '#777777', fontSize: '14px' }}>{isLogin ? 'Войдите в личный кабинет' : 'Создайте аккаунт'}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#2d2d2d', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <i className="fas fa-user" style={{ color: '#771d55' }}></i>
                  ФИО
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Иванов Иван Иванович"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '12px',
                    fontSize: '15px',
                    background: 'white'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#2d2d2d', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <i className="fas fa-phone" style={{ color: '#771d55' }}></i>
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (900) 123-45-67"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '12px',
                    fontSize: '15px',
                    background: 'white'
                  }}
                />
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#2d2d2d', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <i className="fas fa-envelope" style={{ color: '#771d55' }}></i>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.ru"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #e8e8e8',
                borderRadius: '12px',
                fontSize: '15px',
                background: 'white'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#2d2d2d', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <i className="fas fa-lock" style={{ color: '#771d55' }}></i>
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #e8e8e8',
                borderRadius: '12px',
                fontSize: '15px',
                background: 'white'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              borderRadius: '12px',
              color: '#dc3545',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button type="submit" disabled={isLoading} style={{
            background: 'linear-gradient(135deg, #771d55 0%, #9a366e 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '10px'
          }}>
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e8e8e8' }}>
          <button onClick={() => setIsLogin(!isLogin)} style={{
            background: 'none',
            border: 'none',
            color: '#771d55',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;