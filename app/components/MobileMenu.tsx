// app/components/MobileMenu.tsx
"use client";

import React from 'react';
import styles from './MobileMenu.module.css';
import { useLanguage } from './languageContext.js';

// Добавьте интерфейс User
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Обновите MobileMenuProps
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentClick?: () => void;
  onCallbackClick?: () => void;
  onThemeToggle?: () => void;
  currentTheme?: 'light' | 'dark';
  user?: User | null;        // ← добавлено
  onLogout?: () => void;     // ← добавлено
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  onAppointmentClick,
  onCallbackClick,
  onThemeToggle,
  currentTheme = 'light',
  user,                      // ← добавлено
  onLogout                   // ← добавлено
}) => {
  const { t } = useLanguage();
  
  const menuItems = [
    { id: 1, label: 'Главная', icon: 'fas fa-home', href: '/' },
    { id: 2, label: 'О клинике', icon: 'fas fa-info-circle', href: '#about' },
    { id: 3, label: 'Услуги', icon: 'fas fa-stethoscope', href: '#diseasesmethods' },
    { id: 4, label: 'Специалисты', icon: 'fas fa-user-md', href: '#specialists' },
    { id: 5, label: 'Отзывы', icon: 'fas fa-comments', href: '#reviews' },
    { id: 6, label: 'Контакты', icon: 'fas fa-address-book', href: '#contactForm' }
  ];

  const contactItems = [
    { id: 1, icon: 'fas fa-phone', text: '+7 (913) 148-91-42', href: 'tel:+79131489142' },
    { id: 2, icon: 'fas fa-phone', text: '+7 (3812) 20-91-42', href: 'tel:+73812209142' },
    { id: 3, icon: 'fas fa-map-marker-alt', text: 'Омск, ул. 70 лет октября 26', href: '#' }
  ];

  if (!isOpen) return null;

  const handleAppointmentClick = () => {
    onClose();
    if (onAppointmentClick) onAppointmentClick();
  };

  const handleCallbackClick = () => {
    onClose();
    if (onCallbackClick) onCallbackClick();
  };

  const handleMenuClick = (href: string) => {
    if (href === '/') {
      window.location.href = '/';
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onClose();
  };

  const handleThemeToggle = () => {
    if (onThemeToggle) onThemeToggle();
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    onClose();
  };

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.overlay} onClick={onClose}></div>
      
      <div className={styles.menuContent}>
        <div className={styles.menuHeader}>
          <div className={styles.menuLogo}>
            <i className="fas fa-heartbeat"></i>
            <span>Клиника Паулла</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Информация о пользователе в мобильном меню */}
        {user && (
          <div className={styles.menuUser}>
            <div className={styles.userAvatar}>
              <i className="fas fa-user-circle"></i>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          </div>
        )}

        <nav className={styles.menuNav}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.id} className={styles.menuItem}>
                <a 
                  href={item.href} 
                  className={styles.menuLink}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item.href);
                  }}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                  <i className="fas fa-chevron-right"></i>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Кнопка темы */}
        <div className={styles.themeToggle}>
          <button 
            className={styles.themeToggleBtn}
            onClick={handleThemeToggle}
          >
            <i className={currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
            {currentTheme === 'light' ? 'Темная тема' : 'Светлая тема'}
          </button>
        </div>

        {/* Контакты в меню */}
        <div className={styles.menuContacts}>
          <h3 className={styles.contactsTitle}>Контакты</h3>
          <div className={styles.contactsList}>
            {contactItems.map((item) => (
              <a 
                key={item.id} 
                href={item.href} 
                className={styles.contactItem}
              >
                <i className={item.icon}></i>
                <span>{item.text}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className={styles.menuActions}>
          <button className={styles.callBtn} onClick={handleCallbackClick}>
            <i className="fas fa-phone-alt"></i>
            Позвонить
          </button>
          <button className={styles.appointmentBtn} onClick={handleAppointmentClick}>
            <i className="fas fa-calendar-alt"></i>
            Записаться
          </button>
        </div>

        {/* Ссылки для авторизованного пользователя */}
        {user && (
          <div className={styles.menuAuthLinks}>
            <a href="/dashboard" className={styles.authLink} onClick={onClose}>
              <i className="fas fa-calendar-alt"></i>
              Мои записи
            </a>
            {user.role === 'admin' && (
              <a href="/admin" className={styles.authLink} onClick={onClose}>
                <i className="fas fa-cog"></i>
                Админ-панель
              </a>
            )}
            <button className={styles.logoutLink} onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Выйти
            </button>
          </div>
        )}

        {/* Кнопка входа для неавторизованных */}
        {!user && (
          <div className={styles.menuAuthLinks}>
            <a href="/login" className={styles.authLink} onClick={onClose}>
              <i className="fas fa-user"></i>
              Войти
            </a>
          </div>
        )}

        {/* Социальные сети */}
        <div className={styles.menuSocial}>
          <h3 className={styles.socialTitle}>Мы в соцсетях</h3>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-vk"></i>
            </a>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-telegram"></i>
            </a>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Версия для слабовидящих */}
        <div className={styles.accessibility}>
          <button className={styles.accessibilityBtn}>
            <i className="fas fa-eye"></i>
            Версия для слабовидящих
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;