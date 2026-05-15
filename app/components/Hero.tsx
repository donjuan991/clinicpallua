"use client";

import React, { useState } from 'react';
import styles from './Hero.module.css';
import AppointmentModal from './AppointmentModal';
import CallbackModal from './CallbackModal';
import { useLanguage } from './languageContext';

const Hero = () => {
    const { t } = useLanguage();
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleAppointmentClick = () => {
        setIsAppointmentModalOpen(true);
    };

    const handleCallbackClick = () => {
        setIsCallbackModalOpen(true);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <section className={styles.hero}>
            <div className={`container ${styles.heroContainer}`}>
                
                {/* Текстовый блок */}
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.titleHighlight}>{t('heroTitle')}</span>
                        {t('heroSubtitle')}
                    </h1>
                    
                    <p className={styles.heroSubtitle}>
                        {t('heroDescription')}
                    </p>
                    
                    <div className={styles.heroButtons}>
                        <button 
                            className={`${styles.heroBtn} ${styles.primaryBtn}`}
                            onClick={handleAppointmentClick}
                        >
                            <i className="fas fa-calendar-check"></i>
                            {t('bookAppointment')}
                        </button>
                        <button 
                            className={`${styles.heroBtn} ${styles.secondaryBtn}`}
                            onClick={handleCallbackClick}
                        >
                            <i className="fas fa-phone-alt"></i>
                            {t('callUs')}
                        </button>
                    </div>
                    
                    {/* Преимущества в герое */}
                    <div className={styles.heroFeatures}>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <i className="fas fa-user-md"></i>
                            </div>
                            <div className={styles.featureText}>
                                <span className={styles.featureNumber}>25+</span>
                                <span className={styles.featureLabel}>{t('expertDoctors')}</span>
                            </div>
                        </div>
                        
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <i className="fas fa-hospital"></i>
                            </div>
                            <div className={styles.featureText}>
                                <span className={styles.featureNumber}>12</span>
                                <span className={styles.featureLabel}>{t('yearsOfWork')}</span>
                            </div>
                        </div>
                        
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <i className="fas fa-heart"></i>
                            </div>
                            <div className={styles.featureText}>
                                <span className={styles.featureNumber}>10,000+</span>
                                <span className={styles.featureLabel}>{t('happyPatients')}</span>
                            </div>
                        </div>
                        
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <i className="fas fa-award"></i>
                            </div>
                            <div className={styles.featureText}>
                                <span className={styles.featureNumber}>{t('qualityMark')}</span>
                                <span className={styles.featureLabel}>{t('qualityMark')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Изображение доктора с 3D переворотом */}
                <div className={styles.heroImage}>
                    <div 
                        className={`${styles.imageWrapper} ${isFlipped ? styles.flipped : ''}`}
                        onClick={handleFlip}
                    >
                        {/* Передняя сторона - фото доктора */}
                        <div className={styles.cardFront}>
                            <img 
                                src="/images/paull_solo.jpg" 
                                alt="Доктор Паллуа" 
                                className={styles.doctorImage}
                            />
                            
                            {/* Бейдж на изображении */}
                            <div className={styles.imageBadge} style={{ top: '90.55%'}}>
                                <i className="fas fa-user-doctor"></i>
                                <span>{t('Профессор Паллуа')}</span>
                            </div>
                            
                            {/* Подсказка о перевороте */}
                            <div className={styles.flipHint}>
                                <i className="fas fa-sync-alt"></i>
                                <span>{t('clickToFlip')}</span>
                            </div>
                        </div>
                        
                        {/* Задняя сторона - QR код */}
                        <div className={styles.cardBack}>
                            <div className={styles.qrContainer}>
                                <h3 className={styles.qrTitle}>{t('scanQR')}</h3>
                                <div className={styles.qrCode}>
                                    <img 
                                        src="/images/QRCODE.png" 
                                        alt="QR код для записи" 
                                        className={styles.qrImage}
                                    />
                                </div>
                                <p className={styles.qrDescription}>
                                    {t('qrDescription')}
                                </p>
                                <div className={styles.qrActions}>
                                    <a 
                                        href="tel:+79131489142" 
                                        className={styles.qrPhoneBtn}
                                    >
                                        <i className="fas fa-phone"></i>
                                        +7 (913) 148-91-42
                                    </a>
                                    <button 
                                        className={styles.qrAppointmentBtn}
                                        onClick={handleAppointmentClick}
                                    >
                                        <i className="fas fa-calendar-alt"></i>
                                        {t('bookAppointment')}
                                    </button>
                                </div>
                            </div>
                            {/* Подсказка о перевороте обратно */}
                            <div className={styles.flipBackHint}>
                                <i className="fas fa-sync-alt"></i>
                                <span>{t('clickToFlipBack')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Декоративные элементы */}
            <div className={styles.heroDecorations}>
                <div className={styles.decorationCircle}></div>
                <div className={styles.decorationCircle}></div>
                <div className={styles.decorationCircle}></div>
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
        </section>
    );
};

export default Hero;