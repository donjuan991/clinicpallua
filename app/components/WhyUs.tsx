"use client";

import React from 'react';
import styles from './WhyUs.module.css';
import { useLanguage } from './languageContext';

const WhyUs = () => {
    const { t } = useLanguage();

    const advantages = [
        {
            id: 1,
            title: t('internationalLevel'),
            description: t('internationalDesc'),
            icon: 'fas fa-globe-europe',
            details: [
                'Сертифицированные европейские хирурги',
                'Международные протоколы лечения',
                'Обучение в ведущих клиниках Европы',
                'Членство в ISAPS'
            ]
        },
        {
            id: 2,
            title: t('yearsExperience'),
            description: t('experienceDesc'),
            icon: 'fas fa-award',
            details: [
                'Более 10 000 успешных операций',
                'Эксперт по сложным случаям',
                'Автор научных методик',
                'Обучение молодых хирургов'
            ]
        },
        {
            id: 3,
            title: t('individualApproachTitle'),
            description: t('individualDesc'),
            icon: 'fas fa-user-md',
            details: [
                '3D-моделирование результата',
                'Учет анатомических особенностей',
                'Персональный план реабилитации',
                'Пожизненное сопровождение'
            ]
        },
        {
            id: 4,
            title: t('modernTech'),
            description: t('techDesc'),
            icon: 'fas fa-microscope',
            details: [
                'Лазерные технологии VASER',
                'Эндоскопические методики',
                '3D-визуализация результатов',
                'Микрохирургическое оборудование'
            ]
        },
        {
            id: 5,
            title: t('naturalResults'),
            description: t('naturalDesc'),
            icon: 'fas fa-heart',
            details: [
                'Отсутствие "кукольного" эффекта',
                'Гармоничные пропорции',
                'Незаметные швы',
                'Естественная мимика'
            ]
        },
        {
            id: 6,
            title: t('complexApproach'),
            description: t('complexDesc'),
            icon: 'fas fa-clinic-medical',
            details: [
                'Предоперационная подготовка',
                'Современная операционная',
                'Стационар европейского уровня',
                'Реабилитация с косметологом'
            ]
        }
    ];

    return (
        <section className={styles.whyUs}>
            <div className="container">
                {/* Заголовок секции */}
                <div className="section-header">
                    <h2 className="section-title">{t('whyChooseUs')}</h2>
                    <p className="section-subtitle">
                        {t('whyDescription')}
                    </p>
                </div>

                {/* Основные преимущества */}
                <div className={styles.advantagesGrid}>
                    {advantages.map((advantage) => (
                        <div key={advantage.id} className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>
                                <i className={advantage.icon}></i>
                            </div>
                            
                            <div className={styles.advantageContent}>
                                <h3 className={styles.advantageTitle}>{advantage.title}</h3>
                                <p className={styles.advantageDescription}>{advantage.description}</p>
                                
                                <ul className={styles.advantageDetails}>
                                    {advantage.details.map((detail, index) => (
                                        <li key={index} className={styles.detailItem}>
                                            <i className="fas fa-check-circle"></i>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className={styles.advantageDecor}></div>
                        </div>
                    ))}
                </div>

                {/* Дополнительные факты */}
                <div className={styles.facts}>
                    <div className={styles.fact}>
                        <div className={styles.factIcon}>
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <div className={styles.factContent}>
                            <h4>{t('safetyQuality')}</h4>
                            <p>{t('safetyDesc')}</p>
                        </div>
                    </div>
                    
                    <div className={styles.fact}>
                        <div className={styles.factIcon}>
                            <i className="fas fa-comments"></i>
                        </div>
                        <div className={styles.factContent}>
                            <h4>{t('confidentiality')}</h4>
                            <p>{t('confidentialityDesc')}</p>
                        </div>
                    </div>
                    
                    <div className={styles.fact}>
                        <div className={styles.factIcon}>
                            <i className="fas fa-star"></i>
                        </div>
                        <div className={styles.factContent}>
                            <h4>{t('expertRating')}</h4>
                            <p>{t('expertDesc')}</p>
                        </div>
                    </div>
                </div>

                {/* Дополнительный блок с цифрами */}
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>30+</div>
                        <div className={styles.statText}>{t('yearsProfExperience')}</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>10,000+</div>
                        <div className={styles.statText}>{t('successfulSurgeries')}</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>15+</div>
                        <div className={styles.statText}>{t('countriesPatients')}</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>99%</div>
                        <div className={styles.statText}>{t('recommendFriends')}</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;