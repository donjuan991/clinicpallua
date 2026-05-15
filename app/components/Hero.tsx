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

    const handleAppointmentClick = () => {
        setIsAppointmentModalOpen(true);
    };

    const handleCallbackClick = () => {
        setIsCallbackModalOpen(true);
    };

    return (
        <section className={styles.hero}>
            <div className={`container ${styles.heroContainer}`}>
                
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
                        
                        <div className={styles.imageBadge} style={{ top: '90.55%'}}>
                            <i className="fas fa-stethoscope"></i>
                            <span>{t('consultation')}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles.heroDecorations}>
                <div className={styles.decorationCircle}></div>
                <div className={styles.decorationCircle}></div>
                <div className={styles.decorationCircle}></div>
            </div>

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