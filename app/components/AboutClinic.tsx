"use client";

import React from 'react';
import styles from './AboutClinic.module.css';
import { useLanguage } from './languageContext';

const AboutClinic = () => {
    const { t } = useLanguage();

    const features = [
        {
            id: 1,
            title: t('modernEquipment'),
            description: t('equipmentDesc'),
            icon: 'fas fa-microscope'
        },
        {
            id: 2,
            title: t('experiencedSpecialists'),
            description: t('specialistsDesc'),
            icon: 'fas fa-user-md'
        },
        {
            id: 3,
            title: t('individualApproach'),
            description: t('approachDesc'),
            icon: 'fas fa-hand-holding-heart'
        },
        {
            id: 4,
            title: t('comfortableConditions'),
            description: t('conditionsDesc'),
            icon: 'fas fa-home'
        }
    ];

    const milestones = [
        { year: '2010', text: t('foundation') },
        { year: '2015', text: t('certification') },
        { year: '2018', text: t('newTechnologies') },
        { year: '2020', text: t('newClinics') },
        { year: '2023', text: t('happyPatients10k') }
    ];

    return (
        <section id="about" className={styles.about}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{t('ourStrengths')}</h2>
                    <p className="section-subtitle">
                        {t('aboutDescription')}
                    </p>
                </div>

                <div className={styles.aboutContent}>
                    <div className={styles.aboutText}>
                        <div className={styles.aboutMain}>
                            <h3>{t('amongOther')}</h3>
                            <p>
                                - {t('complexProcedures')}<br />
                                - {t('correctiveSurgeries')}<br />
                                - {t('removalImplants')}<br />
                            </p>
                        </div>
                        
                        <div className={styles.features}>
                            {features.map((feature) => (
                                <div key={feature.id} className={styles.feature}>
                                    <div className={styles.featureIcon}>
                                        <i className={feature.icon}></i>
                                    </div>
                                    <div className={styles.featureContent}>
                                        <h4>{feature.title}</h4>
                                        <p>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.aboutVisual}>
                        <div className={styles.clinicImage}>
                            <div className={styles.imagePlaceholder}>
                                <img 
                                    src="/images/team.jpg" 
                                    alt={t('ourSpecialists')}
                                    className={styles.teamPhoto}
                                />
                            </div>
                        </div>
                        
                        <div className={styles.milestones}>
                            <h3>{t('ourHistory')}</h3>
                            <div className={styles.timeline}>
                                {milestones.map((milestone, index) => (
                                    <div key={index} className={styles.milestone}>
                                        <div className={styles.milestoneYear}>
                                            {milestone.year}
                                        </div>
                                        <div className={styles.milestoneText}>
                                            {milestone.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.aboutStats}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>12</div>
                        <div className={styles.statLabel}>{t('yearsSuccessful')}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>25+</div>
                        <div className={styles.statLabel}>{t('doctorsSpecialists')}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>400+</div>
                        <div className={styles.statLabel}>{t('publications')}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>99%</div>
                        <div className={styles.statLabel}>{t('satisfiedPatients')}</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutClinic;