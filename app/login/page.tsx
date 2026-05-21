// app/login/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../components/languageContext';

const LoginPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    privacyAgreed: false
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !formData.privacyAgreed) {
      setError(t('privacyRequired'));
      return;
    }
    
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
        setError(data.error || t('loginError'));
      }
    } catch (error) {
      setError(t('connectionError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyPolicyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert(t('privacyPolicyText'));
  };

  const handleUserAgreementClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert(t('userAgreementText'));
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #e8e8e8',
    borderRadius: '12px',
    fontSize: '15px',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box' as const
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#2d2d2d',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
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
          <h1 style={{ fontSize: '24px', color: '#771d55', marginBottom: '10px' }}>{t('heroTitle')}</h1>
          <p style={{ color: '#777777', fontSize: '14px' }}>
            {isLogin ? t('loginTitle') : t('registerTitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <>
              <div>
                <label style={labelStyle}>
                  <i className="fas fa-user" style={{ color: '#771d55' }}></i>
                  {t('fullName')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('fullNamePlaceholder')}
                  required={!isLogin}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#771d55'}
                  onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <i className="fas fa-phone" style={{ color: '#771d55' }}></i>
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (900) 123-45-67"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#771d55'}
                  onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
                />
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>
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
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#771d55'}
              onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
            />
          </div>

          <div>
            <label style={labelStyle}>
              <i className="fas fa-lock" style={{ color: '#771d55' }}></i>
              {t('password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#771d55'}
              onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
            />
          </div>

          {/* Ссылка "Забыли пароль?" */}
          {isLogin && (
            <div style={{ textAlign: 'right', marginTop: '-10px' }}>
              <a 
                href="/forgot-password" 
                style={{
                  color: '#771d55',
                  fontSize: '14px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {t('forgotPassword')}
              </a>
            </div>
          )}

          {/* Галочка соглашения при регистрации */}
          {!isLogin && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '15px',
              background: 'rgba(119, 29, 85, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(119, 29, 85, 0.1)'
            }}>
              <input
                type="checkbox"
                id="privacyAgreed"
                name="privacyAgreed"
                checked={formData.privacyAgreed}
                onChange={handleChange}
                style={{
                  width: '18px',
                  height: '18px',
                  marginTop: '3px',
                  accentColor: '#771d55',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
              />
              <label 
                htmlFor="privacyAgreed" 
                style={{
                  fontSize: '13px',
                  color: '#555',
                  lineHeight: '1.5',
                  flex: 1,
                  cursor: 'pointer'
                }}
              >
                {t('privacyAgreement')}{' '}
                <a 
                  href="#" 
                  onClick={handlePrivacyPolicyClick}
                  style={{ color: '#771d55', textDecoration: 'underline', fontWeight: '500' }}
                >
                  {t('privacyPolicy')}
                </a>
                {' '}{t('and')}{' '}
                <a 
                  href="#" 
                  onClick={handleUserAgreementClick}
                  style={{ color: '#771d55', textDecoration: 'underline', fontWeight: '500' }}
                >
                  {t('userAgreement')}
                </a>
              </label>
            </div>
          )}

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

          <button 
            type="submit" 
            disabled={isLoading || (!isLogin && !formData.privacyAgreed)}
            style={{
              background: 'linear-gradient(135deg, #771d55 0%, #9a366e 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (isLoading || (!isLogin && !formData.privacyAgreed)) ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              opacity: (isLoading || (!isLogin && !formData.privacyAgreed)) ? 0.7 : 1,
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {t('loading')}
              </>
            ) : (
              isLogin ? t('login') : t('register')
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e8e8e8' }}>
          <button onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setFormData(prev => ({ ...prev, privacyAgreed: false }));
          }} style={{
            background: 'none',
            border: 'none',
            color: '#771d55',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {isLogin ? t('noAccount') : t('hasAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;