"use client";

import React, { useState } from 'react';
import styles from './Footer.module.css';
import AppointmentModal from './AppointmentModal';
import CallbackModal from './CallbackModal';
import PricesModal from './PricesModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import OfferModal from './OfferModal';
import LicensesModal from './LicensesModal';

const Footer = () => {
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
    const [isPricesModalOpen, setIsPricesModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isLicensesModalOpen, setIsLicensesModalOpen] = useState(false);

    const handleAppointmentClick = () => {
        setIsAppointmentModalOpen(true);
    };

    const handleCallbackClick = () => {
        setIsCallbackModalOpen(true);
    };

    const handlePricesClick = () => {
        setIsPricesModalOpen(true);
    };

    const handlePrivacyClick = () => {
        setIsPrivacyModalOpen(true);
    };

    const handleOfferClick = () => {
        setIsOfferModalOpen(true);
    };

    const handleLicensesClick = () => {
        setIsLicensesModalOpen(true);
    };

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                
                {/* Верхняя часть футера */}
                <div className={styles.footerTop}>
                    <div className={styles.logo}>
                        <a href="/" className={styles.logoLink}>
                            <div className={styles.logoImage}>
                                <img 
                                    src="/images/paulla_logo.png"
                                    alt="Клиника Паулла" 
                                    className={styles.logoImg}
                                />
                            </div>
                            <div className={styles.logoText}>
                                <h3>Клиника Паллуа</h3>
                                <p>Забота о вашем здоровье с 2010 года</p>
                            </div>
                        </a>
                    </div>
                    <div className={styles.socialLinks}>
                        <a href="#" className={styles.socialLink} aria-label="ВКонтакте">
                            <i className="fab fa-vk"></i>
                        </a>
                        <a href="#" className={styles.socialLink} aria-label="Telegram">
                            <i className="fab fa-telegram"></i>
                        </a>
                        <a href="#" className={styles.socialLink} aria-label="WhatsApp">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                        <a href="#" className={styles.socialLink} aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>

                {/* Основной контент футера */}
                <div className={styles.footerGrid}>
                    {/* Меню */}
                    <div className={styles.footerColumn}>
                        <h4 className={styles.footerTitle}>Меню</h4>
                        <ul className={styles.footerList}>
                            <li><a href="#about">О клинике</a></li>
                            <li><a href="#diseasesmethods">Наши услуги</a></li>
                            <li><a href="#specialists">Специалисты</a></li>
                            <li><a href="#reviews">Отзывы</a></li>
                            <li><a href="#contactForm">Контакты</a></li>
                        </ul>
                    </div>

                    {/* Контакты */}
                    <div className={styles.footerColumn}>
                        <h4 className={styles.footerTitle}>Контакты</h4>
                        <ul className={styles.footerList}>
                            <li>
                                <i className="fas fa-map-marker-alt"></i>
                                Омск, ул. 70 лет октября 26
                            </li>
                            <li>
                                <button 
                                    className={styles.footerPhoneBtn}
                                    onClick={handleCallbackClick}
                                >
                                    <i className="fas fa-phone"></i>
                                    +7 (913) 148-91-42
                                </button>
                            </li>
                            <li>
                                <button 
                                    className={styles.footerPhoneBtn}
                                    onClick={handleCallbackClick}
                                >
                                    <i className="fas fa-phone"></i>
                                    +7 (3812) 20 91 42
                                </button>
                            </li>
                            <li>
                                <i className="fas fa-envelope"></i>
                                info@pallua-clinic.com
                            </li>
                            <li>
                                <i className="fas fa-clock"></i>
                                Пн-Пт: 8:00-20:00<br />
                                Сб-Вс: 9:00-18:00
                            </li>
                        </ul>
                    </div>

                    {/* Запись на прием */}
                    <div className={styles.footerColumn}>
                        <h4 className={styles.footerTitle}>Запись на прием</h4>
                        <p className={styles.footerText}>
                            Запишитесь на консультацию к специалисту прямо сейчас
                        </p>
                        <button 
                            className={styles.footerBtn}
                            onClick={handleAppointmentClick}
                        >
                            <i className="fas fa-calendar-alt"></i>
                            Записаться онлайн
                        </button>
                        <button 
                            className={styles.pricesBtn}
                            onClick={handlePricesClick}
                        >
                            <i className="fas fa-tag"></i>
                            Посмотреть цены
                        </button>
                    </div>
                </div>

                {/* Нижняя часть футера */}
                <div className={styles.footerBottom}>
                    <div className={styles.copyright}>
                        © 2025 Клиника Паллуа. Все права защищены.
                    </div>
                    <div className={styles.footerLinks}>
                        <button 
                            className={styles.footerLinkBtn}
                            onClick={handlePrivacyClick}
                        >
                            Политика конфиденциальности
                        </button>
                        <button 
                            className={styles.footerLinkBtn}
                            onClick={handleOfferClick}
                        >
                            Договор оферты
                        </button>
                        <button 
                            className={styles.footerLinkBtn}
                            onClick={handleLicensesClick}
                        >
                            Лицензии
                        </button>
                    </div>
                </div>
            </div>

            {/* Модальные окна */}
            <AppointmentModal 
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
            />

            <CallbackModal 
                isOpen={isCallbackModalOpen}
                onClose={() => setIsCallbackModalOpen(false)}
            />

            <PricesModal 
                isOpen={isPricesModalOpen}
                onClose={() => setIsPricesModalOpen(false)}
            />

            <PrivacyPolicyModal 
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />

            <OfferModal 
                isOpen={isOfferModalOpen}
                onClose={() => setIsOfferModalOpen(false)}
            />

            <LicensesModal 
                isOpen={isLicensesModalOpen}
                onClose={() => setIsLicensesModalOpen(false)}
            />
        </footer>
    );
};

export default Footer;