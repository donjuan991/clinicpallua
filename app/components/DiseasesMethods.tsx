"use client";

import React, { useState } from 'react';
import styles from './DiseasesMethods.module.css';
import AppointmentModal from './AppointmentModal';
import CallbackModal from './CallbackModal';
import ConsultationModal from './ConsultationModal';

const DiseasesMethods = () => {
    const [activeTab, setActiveTab] = useState('diagnosis');
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
    const [isDiagnosticsModalOpen, setIsDiagnosticsModalOpen] = useState(false);
    const [isSecondOpinionModalOpen, setIsSecondOpinionModalOpen] = useState(false);

    const diagnosisMethods = [
        {
            id: 2,
            title: 'Голова и лицо',
            methods: ['Липофилинг', 'Подтяжка лица', 'Коррекция ушей','Мезотерапия с гиалуроновой кислотой и витаминами','Биоразлагаемые филлеры гиалуроновая кислота','PRP-терапия вампирская подтяжка лица','Лечение ботоксом','Коррекция результатов лечения филлерами','Пятна Фордайса (губы)','Подтяжка средней части лица','Ринопластика','Подтяжка век','PRP-терапия при выпадении волос']
        },
        {
            id: 3,
            title: 'Тело',
            methods: ['Увеличение ягодиц', 'Подъем верхней части руки', 'Удаление потовых желез', 'Подтяжка бедра', 'Коррекция контуров тела/подтяжка тела', 'Абдоминопластика', 'Контуринг тела', 'Липоксация']
        }
    ];

    const treatmentMethods = [
        {
            id: 1,
            title: 'Грудь',
            methods: ['Подтяжка и увеличение груди', 'Увеличение груди (с использованием собственного жира организма)', 'Увеличение груди (имплантаты)', 'Уменьшение груди']
        },
        {
            id: 2,
            title: 'Голова и лицо',
            methods: ['Подтяжка шеи', 'Липофилинг', 'Подтяжка лица', 'Коррекция ушей','Мезотерапия с гиалуроновой кислотой и витаминами','Биоразлагаемые филлеры гиалуроновая кислота','PRP-терапия вампирская подтяжка лица','Лечение ботоксом','Коррекция результатов лечения филлерами','Пятна Фордайса (губы)','Подтяжка средней части лица','Ринопластика','Подтяжка век','PRP-терапия при выпадении волос']
        },
        {
            id: 3,
            title: 'Тело',
            methods: ['Увеличение ягодиц', 'Подъем верхней части руки', 'Удаление потовых желез', 'Подтяжка бедра', 'Коррекция контуров тела/подтяжка тела', 'Абдоминопластика', 'Контуринг тела', 'Липосакция']
        }
    ];

    const handleConsultationClick = () => {
        setIsConsultationModalOpen(true);
    };

    const handleDiagnosticsClick = () => {
        setIsDiagnosticsModalOpen(true);
    };

    const handleSecondOpinionClick = () => {
        setIsSecondOpinionModalOpen(true);
    };

   return (
    <section id="diseasesmethods" className={styles.diseasesMethods}>
        <div className="container">
            <div className="section-header">
                <h2 className="section-title">Наши услуги</h2>
            </div>

                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tab} ${activeTab === 'diagnosis' ? styles.active : ''}`}
                        onClick={() => setActiveTab('diagnosis')}
                    >
                        <i className="fas fa-user-tie"></i> 
                        Мужчины
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'treatment' ? styles.active : ''}`}
                        onClick={() => setActiveTab('treatment')}
                    >
                        <i className="fa-solid fa-person-dress"></i>
                        Женщины
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'diagnosis' && (
                        <div className={styles.methodsGrid}>
                            {diagnosisMethods.map((method) => (
                                <div key={method.id} className={styles.methodCard}>
                                    <div className={styles.methodIcon}>
                                       <i className="fas fa-user-tie"></i>
                                    </div>
                                    <h3 className={styles.methodTitle}>{method.title}</h3>
                                    <ul className={styles.methodList}>
                                        {method.methods.map((item, index) => (
                                            <li key={index} className={styles.methodItem}>
                                                <i className="fas fa-check"></i>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'treatment' && (
                        <div className={styles.methodsGrid}>
                            {treatmentMethods.map((method) => (
                                <div key={method.id} className={styles.methodCard}>
                                    <div className={styles.methodIcon}>
                                        <i className="fa-solid fa-person-dress"></i>
                                    </div>
                                    <h3 className={styles.methodTitle}>{method.title}</h3>
                                    <ul className={styles.methodList}>
                                        {method.methods.map((item, index) => (
                                            <li key={index} className={styles.methodItem}>
                                                <i className="fas fa-check"></i>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.additionalInfo}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <i className="fas fa-calendar-check"></i>
                        </div>
                        <div className={styles.infoContent}>
                            <h4>Запись на диагностику</h4>
                            <p>Запишитесь на комплексное обследование со скидкой 15%</p>
                        </div>
                        <button 
                            className={styles.infoBtn}
                            onClick={handleDiagnosticsClick}
                        >
                            Записаться
                        </button>
                    </div>
                    
                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <i className="fas fa-user-md"></i>
                        </div>
                        <div className={styles.infoContent}>
                            <h4>Второе мнение</h4>
                            <p>Получите консультацию нескольких специалистов</p>
                        </div>
                        <button 
                            className={styles.infoBtn}
                            onClick={handleSecondOpinionClick}
                        >
                            Узнать больше
                        </button>
                    </div>
                </div>
            </div>

            {/* Модальные окна */}
            <ConsultationModal 
                isOpen={isConsultationModalOpen}
                onClose={() => setIsConsultationModalOpen(false)}
            />

            <AppointmentModal 
                isOpen={isDiagnosticsModalOpen}
                onClose={() => setIsDiagnosticsModalOpen(false)}
                initialService="diagnostics"
            />

            <CallbackModal 
                isOpen={isSecondOpinionModalOpen}
                onClose={() => setIsSecondOpinionModalOpen(false)}
            />
        </section>
    );
};

export default DiseasesMethods;