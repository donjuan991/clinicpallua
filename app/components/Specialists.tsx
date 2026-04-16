"use client";

import React, { useState } from 'react';
import styles from './Specialists.module.css';
import AppointmentModal from './AppointmentModal';
import DoctorDetailsModal from './DoctorDetailsModal';

interface Doctor {
    id: number;
    name: string;
    position: string;
    experience: string;
    education: string;
    specialty: string[];
    imageColor: string;
    rating: number;
    certifications: string[];
}

const Specialists = () => {
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const specialists: Doctor[] = [
        {
            id: 1,
            name: 'Профессор Н. Паллуа',
            position: 'Главный пластический хирург, Доктор медицинских наук',
            experience: '30+ лет',
            education: 'Европейская ассоциация пластических хирургов (ФЕБОПРАС), Высшая категория',
            specialty: ['Пластическая хирургия лица', 'Реконструктивная хирургия', 'Эстетическая хирургия тела', 'Коррекция осложнений'],
            imageColor: '#771d55',
            rating: 5.0,
            certifications: ['ФЕБОПРАС', 'ISAPS', 'РФХ']
        },
        {
            id: 2,
            name: 'Доктор Мария Делакур',
            position: 'Пластический хирург, эксперт по эстетике лица',
            experience: '15 лет',
            education: 'Университет Париж Декарт, Франция, Сертификат ФЕБОПРАС',
            specialty: ['Ринопластика', 'Блефаропластика', 'SMAS-подтяжка лица', 'Липофилинг'],
            imageColor: '#9d4b7c',
            rating: 4.9,
            certifications: ['ФЕБОПРАС', 'SOFCEP']
        },
        {
            id: 3,
            name: 'Доктор Ханс Мюллер',
            position: 'Пластический хирург, специалист по реконструкции',
            experience: '12 лет',
            education: 'Шарите - Медицинский университет Берлина, Германия',
            specialty: ['Реконструктивная хирургия груди', 'Удаление имплантов', 'Коррекция рубцов', 'Посттравматическая реконструкция'],
            imageColor: '#631846',
            rating: 4.9,
            certifications: ['ФЕБОПРАС', 'DGPRÄC', 'EURAPS']
        },
        {
            id: 4,
            name: 'Доктор Анна Вольф',
            position: 'Эстетический хирург, специалист по телу',
            experience: '10 лет',
            education: 'Венский медицинский университет, Австрия',
            specialty: ['Маммопластика', 'Абдоминопластика', 'Липосакция', 'Контурная пластика тела'],
            imageColor: '#b56a9d',
            rating: 4.8,
            certifications: ['ФЕБОПРАС', 'ÖGPÄC']
        },
        {
            id: 5,
            name: 'Доктор Луиджи Росси',
            position: 'Пластический хирург, эксперт по мужской эстетике',
            experience: '8 лет',
            education: 'Миланский университет, Италия',
            specialty: ['Мужская пластическая хирургия', 'Коррекция гинекомастии', 'Липосакция у мужчин', 'Омоложение'],
            imageColor: '#1979FF',
            rating: 4.8,
            certifications: ['ФЕБОПРАС', 'SICPRE']
        },
        {
            id: 7,
            name: 'Доктор Джеймс Картер',
            position: 'Анестезиолог-реаниматолог',
            experience: '20 лет',
            education: 'Кембриджский университет, Великобритания, Доктор наук',
            specialty: ['Анестезия в пластической хирургии', 'Интенсивная терапия', 'Обезболивание', 'Медицинская реабилитация'],
            imageColor: '#4e1337',
            rating: 5.0,
            certifications: ['ФЕБОПРАС', 'RCA']
        },
        {
            id: 8,
            name: 'Доктор Эмили Чен',
            position: 'Косметолог-дерматолог',
            experience: '8 лет',
            education: 'Гарвардская медицинская школа, США',
            specialty: ['Инъекционная косметология', 'Лазерные процедуры', 'Эстетическая дерматология', 'Аппаратные методики'],
            imageColor: '#8a3a6a',
            rating: 4.9,
            certifications: ['AAD', 'ASDS']
        }
    ];

    const handleAppointmentClick = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setIsAppointmentModalOpen(true);
    };

    const handleDetailsClick = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setIsDetailsModalOpen(true);
    };

    const handleAppointmentFromDetails = () => {
        setIsDetailsModalOpen(false);
        setIsAppointmentModalOpen(true);
    };

    return (
        <section id="specialists" className={styles.specialists}>
            <div className="container">
                {/* Заголовок секции */}
                <div className="section-header">
                    <h2 className="section-title">Наши специалисты</h2>
                    <p className="section-subtitle">
                        Высококвалифицированные врачи с многолетним опытом работы. 
                        Постоянно повышают квалификацию и следят за новейшими разработками в медицине
                    </p>
                </div>

                {/* Сетка специалистов */}
                <div className={styles.specialistsGrid}>
                    {specialists.map((doctor) => (
                        <div key={doctor.id} className={styles.specialistCard}>
                            {/* Верхняя часть карточки */}
                            <div className={styles.cardTop}>
                                <div 
                                    className={styles.doctorImage}
                                    style={{ backgroundColor: doctor.imageColor }}
                                >
                                    <div className={styles.imagePlaceholder}>
                                        <i className="fas fa-user-md"></i>
                                    </div>
                                    <div className={styles.rating}>
                                        <i className="fas fa-star"></i>
                                        <span>{doctor.rating}</span>
                                    </div>
                                </div>
                                
                                <div className={styles.doctorInfo}>
                                    <h3 className={styles.doctorName}>{doctor.name}</h3>
                                    <p className={styles.doctorPosition}>{doctor.position}</p>
                                    
                                    <div className={styles.experience}>
                                        <i className="fas fa-briefcase"></i>
                                        <span>Опыт: {doctor.experience}</span>
                                    </div>
                                    
                                    <div className={styles.education}>
                                        <i className="fas fa-graduation-cap"></i>
                                        <span>{doctor.education}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Специализации */}
                            <div className={styles.specialties}>
                                <h4>Специализация:</h4>
                                <div className={styles.specialtyTags}>
                                    {doctor.specialty.slice(0, 3).map((spec, index) => (
                                        <span key={index} className={styles.specialtyTag}>
                                            {spec}
                                        </span>
                                    ))}
                                    {doctor.specialty.length > 3 && (
                                        <span className={styles.specialtyTag}>
                                            +{doctor.specialty.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Кнопки действий */}
                            <div className={styles.cardActions}>
                                <button 
                                    className={styles.appointmentBtn}
                                    onClick={() => handleAppointmentClick(doctor)}
                                >
                                    <i className="fas fa-calendar-alt"></i>
                                    Записаться
                                </button>
                                <button 
                                    className={styles.detailsBtn}
                                    onClick={() => handleDetailsClick(doctor)}
                                >
                                    <i className="fas fa-info-circle"></i>
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Блок статистики */}
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>25+</div>
                        <div className={styles.statLabel}>Специалистов</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>50+</div>
                        <div className={styles.statLabel}>Направлений</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>100%</div>
                        <div className={styles.statLabel}>Квалификация</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>24/7</div>
                        <div className={styles.statLabel}>Консультации</div>
                    </div>
                </div>
            </div>

            {/* Модальное окно записи */}
            <AppointmentModal 
                isOpen={isAppointmentModalOpen}
                onClose={() => {
                    setIsAppointmentModalOpen(false);
                    setSelectedDoctor(null);
                }}
                initialDoctor={selectedDoctor?.name || ''}
            />

            {/* Модальное окно с подробной информацией */}
            <DoctorDetailsModal 
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedDoctor(null);
                }}
                onAppointment={handleAppointmentFromDetails}
                doctor={selectedDoctor}
            />
        </section>
    );
};

export default Specialists;