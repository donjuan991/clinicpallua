"use client";

import React, { useState } from 'react';
import styles from './Hero.module.css';
import AppointmentModal from './AppointmentModal';
import CallbackModal from './CallbackModal';
import Image from 'next/image';

const Hero = () => {
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);

    const handleAppointmentClick = () => {
        setIsAppointmentModalOpen(true);
    };

    const handleCallbackClick = () => {
        setIsCallbackModalOpen(true);
    };

    return (
        <section className={styles.hero}>
            <div className={`container ${styles.heroContainer}`}>
                
                {/* Текстовый блок */}
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.titleHighlight}>Клиника Паллуа</span>
                        Профессор, Доктор Мед. Н. Паллуа ФЕБОПРАС
                    </h1>
                    
                    <p className={styles.heroSubtitle}>
                        На протяжении десятилетий пластическая, реконструктивная и эстетическая
                        хирургия на самом высоком международном уровне.
                    </p>
                    
                    <div className={styles.heroButtons}>
                        <button 
                            className={`${styles.heroBtn} ${styles.primaryBtn}`}
                            onClick={handleAppointmentClick}
                        >
                            <i className="fas fa-calendar-check"></i>
                            Записаться на прием
                        </button>
                        <button 
                            className={`${styles.heroBtn} ${styles.secondaryBtn}`}
                            onClick={handleCallbackClick}
                        >
                            <i className="fas fa-phone-alt"></i>
                            Позвонить нам
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
                                <span className={styles.featureLabel}>Врачей экспертов</span>
                            </div>
                        </div>
                        
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <i className="fas fa-hospital"></i>
                            </div>
                            <div className={styles.featureText}>
                                <span className={styles.featureNumber}>12</span>
                                <span className={styles.featureLabel}>Лет работы</span>
                            </div>
                        </div>
                        
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <i className="fas fa-heart"></i>
                            </div>
                            <div className={styles.featureText}>
                                <span className={styles.featureNumber}>10,000+</span>
                                <span className={styles.featureLabel}>Довольных пациентов</span>
                            </div>
                        </div>
                        
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <i className="fas fa-award"></i>
                            </div>
                            <div className={styles.featureText}>
                                <span className={styles.featureNumber}>Разрешение Палаты</span>
                                <span className={styles.featureLabel}>Наш знак качества</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Изображение доктора */}
                <div className={styles.heroImage}>
                    <div className={styles.imageWrapper}>
                        <img 
    src="/images/paull_solo.jpg" 
    alt="Доктор Паллуа" 
    className={styles.doctorImage}
    style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '20px'
    }}
/>
                        
                        {/* Бейджи на изображении */}
                        <div className={styles.imageBadge} style={{ top: '90.55%'}}>
                            <i className="fas fa-stethoscope"></i>
                            <span>Консультация</span>
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