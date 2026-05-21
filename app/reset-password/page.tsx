"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    setToken(tokenParam);
    
    if (!tokenParam) {
      setError('Не указан токен для сброса пароля');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || 'Ошибка при смене пароля');
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
            <i className="fas fa-lock" style={{ fontSize: '32px', color: 'white' }}></i>
          </div>
          <h1 style={{ fontSize: '24px', color: '#771d55', marginBottom: '10px' }}>
            {success ? 'Пароль изменен!' : 'Восстановление пароля'}
          </h1>
          <p style={{ color: '#777777', fontSize: '14px' }}>
            {success ? 'Сейчас вы будете перенаправлены на страницу входа' : 'Введите новый пароль'}
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#28a745', marginBottom: '20px' }}></i>
            <p style={{ color: '#2d2d2d' }}>Пароль успешно изменен!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#2d2d2d', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <i className="fas fa-lock" style={{ color: '#771d55' }}></i>
                Новый пароль
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '12px',
                  fontSize: '15px',
                  background: 'white',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#2d2d2d', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <i className="fas fa-lock" style={{ color: '#771d55' }}></i>
                Подтвердите пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '12px',
                  fontSize: '15px',
                  background: 'white',
                  outline: 'none'
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

            <button type="submit" disabled={isLoading || !token} style={{
              background: 'linear-gradient(135deg, #771d55 0%, #9a366e 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (isLoading || !token) ? 'not-allowed' : 'pointer',
              opacity: (isLoading || !token) ? 0.7 : 1,
              marginTop: '10px'
            }}>
              {isLoading ? 'Смена пароля...' : 'Сменить пароль'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;