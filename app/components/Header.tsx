// app/components/Header.tsx (добавляем информацию о пользователе)
"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { useLanguage } from './languageContext'; 
import styles from './Header.module.css';
import MobileMenu from './MobileMenu';
import AppointmentModal from './AppointmentModal';
import CallbackModal from './CallbackModal';
import LanguageToggle from './LanguageToggle';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Header = () => {
  const { t } = useLanguage(); 
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAppointmentClick = () => {
    setIsAppointmentModalOpen(true);
  };

  const handleCallbackClick = () => {
    setIsCallbackModalOpen(true);
  };

  return (
    <>
      <div className={styles.headerTop}>
        <div className={`container ${styles.headerTopContainer}`}>
          <div className={styles.contactInfo}>
            <span className={styles.address}>
              <i className={`fas fa-map-marker-alt ${styles.icon}`}></i>
              {t('address')}: Омск, ул. 70 лет октября 26
            </span>
            <span className={styles.phone}>
              <i className={`fas fa-phone ${styles.icon}`}></i>
              +7 (913) 148-91-42
            </span>
            <button 
              className={styles.callbackButton}
              onClick={handleCallbackClick}
            >
              <i className={`fas fa-phone ${styles.icon}`}></i>
              {t('callback')}
            </button>
          </div>

          <div className={styles.headerActions}>
            {/* Информация о пользователе */}
            {user ? (
              <div className={styles.userMenu}>
                <button className={styles.userBtn}>
                  <i className="fas fa-user-circle"></i>
                  {user.name}
                </button>
                <div className={styles.userDropdown}>
                  <a href="/dashboard" className={styles.dropdownItem}>
                    <i className="fas fa-calendar-alt"></i>
                    Мои записи
                  </a>
                  {user.role === 'admin' && (
                    <a href="/admin" className={styles.dropdownItem}>
                      <i className="fas fa-cog"></i>
                      Админ-панель
                    </a>
                  )}
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    <i className="fas fa-sign-out-alt"></i>
                    Выйти
                  </button>
                </div>
              </div>
            ) : (
              <a href="/login" className={styles.loginBtn}>
                <i className="fas fa-user"></i>
                Войти
              </a>
            )}
            
            {/* Кнопка переключения языка */}
            <LanguageToggle />
            
            {/* Кнопка темы */}
            <button 
              className={styles.themeButton}
              onClick={toggleTheme}
              aria-label={`${t('toggleTheme')} ${theme === 'light' ? t('toDark') : t('toLight')}`}
            >
              {theme === 'light' ? (
                <i className="fas fa-moon"></i>
              ) : (
                <i className="fas fa-sun"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      <header className={styles.headerBottom}>
        <div className={`container ${styles.headerBottomContainer}`}>
          <div className={styles.logo}>
            <a href="/" className={styles.logoLink}>
              <div className={styles.logoImage}>
                <img 
                  src="/images/paulla_logo.png"
                  alt="Клиника Паулла" 
                  className={styles.logoImg}
                />
              </div>
            </a>
          </div>

          <nav className={styles.mainNav}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <a href="#about" className={styles.navLink}>{t('about')}</a>
              </li>
              <li className={styles.navItem}>
                <a href="#diseasesmethods" className={styles.navLink}>{t('services')}</a>
              </li>
              <li className={styles.navItem}>
                <a href="#specialists" className={styles.navLink}>{t('specialists')}</a>
              </li>
              <li className={styles.navItem}>
                <a href="#reviews" className={styles.navLink}>{t('reviews')}</a>
              </li>
              <li className={styles.navItem}>
                <a href="#contactForm" className={styles.navLink}>{t('contacts')}</a>
              </li>
            </ul>
          </nav>

          <button 
            className={styles.consultationBtn}
            onClick={handleAppointmentClick}
          >
            <i className="fas fa-calendar-check"></i>
            {t('appointment')}
          </button>

          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label={t('openMenu')}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onAppointmentClick={handleAppointmentClick}
        onCallbackClick={handleCallbackClick}
        onThemeToggle={toggleTheme}
        currentTheme={theme}
        user={user}
        onLogout={handleLogout}
      />

      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />

      <CallbackModal 
        isOpen={isCallbackModalOpen}
        onClose={() => setIsCallbackModalOpen(false)}
      />
    </>
  );
};

export default Header;