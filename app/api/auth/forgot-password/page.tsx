"use client";

import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при отправке письма');
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
            <i className="fas fa-key" style={{ fontSize: '32px', color: 'white' }}></i>
          </div>
          <h1 style={{ fontSize: '24px', color: '#771d55', marginBottom: '10px' }}>
            {success ? 'Письмо отправлено!' : 'Забыли пароль?'}
          </h1>
          <p style={{ color: '#777777', fontSize: '14px' }}>
            {success 
              ? 'Проверьте вашу почту для восстановления пароля' 
              : 'Введите email, и мы отправим вам ссылку для восстановления'}
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <i className="fas fa-envelope" style={{ fontSize: '48px', color: '#771d55', marginBottom: '20px' }}></i>
            <p style={{ color: '#2d2d2d', marginBottom: '20px' }}>
              Мы отправили письмо на <strong>{email}</strong>
            </p>
            <button onClick={() => window.location.href = '/login'} style={{
              background: 'linear-gradient(135deg, #771d55 0%, #9a366e 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 30px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Вернуться ко входу
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#2d2d2d', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <i className="fas fa-envelope" style={{ color: '#771d55' }}></i>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.ru"
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

            <button type="submit" disabled={isLoading} style={{
              background: 'linear-gradient(135deg, #771d55 0%, #9a366e 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginTop: '10px'
            }}>
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin"></i> Отправка...</>
              ) : (
                'Отправить ссылку'
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <a href="/login" style={{
                color: '#771d55',
                fontSize: '14px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                ← Вернуться ко входу
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;