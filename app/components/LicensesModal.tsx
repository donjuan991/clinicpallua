"use client";

import React from 'react';
import styles from './Modals.module.css';

interface LicensesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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

const LicensesModal: React.FC<LicensesModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const licenses = [
        {
            id: 1,
            title: "Лицензия на медицинскую деятельность",
            number: "ЛО-55-01-002345",
            issued: "Министерство здравоохранения Омской области",
            date: "15.03.2023",
            expiry: "15.03.2028",
            description: "Разрешение на осуществление медицинской деятельности по специальностям: пластическая хирургия, хирургия, анестезиология-реаниматология."
        },
        {
            id: 2,
            title: "Лицензия на оборот наркотических средств",
            number: "ФС-55-123456",
            issued: "Федеральная служба по надзору в сфере здравоохранения",
            date: "20.04.2023",
            expiry: "20.04.2028",
            description: "Право на приобретение, хранение и использование наркотических средств и психотропных веществ для медицинских целей."
        },
        {
            id: 3,
            title: "Сертификат соответствия ГОСТ",
            number: "СС-55-789012",
            issued: "Росстандарт",
            date: "10.05.2023",
            expiry: "10.05.2026",
            description: "Подтверждение соответствия медицинского оборудования и инструментов требованиям безопасности."
        },
        {
            id: 4,
            title: "Аккредитация медицинской организации",
            number: "АКК-55-345678",
            issued: "Министерство здравоохранения РФ",
            date: "05.06.2023",
            expiry: "05.06.2028",
            description: "Подтверждение соответствия высшим стандартам качества медицинской помощи."
        }
    ];

    const doctors: Doctor[] = [
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

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle}>
                        <i className="fas fa-award"></i>
                        Лицензии и сертификаты
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className={styles.scrollContent}>
                    <div className={styles.modalBody}>
                        <div className={styles.infoBlock}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-certificate"></i>
                            </div>
                            <h3>Официальные документы клиники</h3>
                            <p>Все необходимые лицензии и разрешения для оказания медицинских услуг высшего качества.</p>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-file-medical"></i> Действующие лицензии</h4>
                            <p>Клиника "Паулла" имеет полный пакет разрешительной документации:</p>
                            
                            <div className={styles.licensesGrid}>
                                {licenses.map(license => (
                                    <div key={license.id} className={styles.licenseCard}>
                                        <div className={styles.licenseHeader}>
                                            <div className={styles.licenseIcon}>
                                                <i className="fas fa-file-certificate"></i>
                                            </div>
                                            <div>
                                                <h5>{license.title}</h5>
                                                <span className={styles.licenseNumber}>№ {license.number}</span>
                                            </div>
                                        </div>
                                        <div className={styles.licenseBody}>
                                            <div className={styles.licenseDetail}>
                                                <i className="fas fa-building"></i>
                                                <span>Выдано: {license.issued}</span>
                                            </div>
                                            <div className={styles.licenseDetail}>
                                                <i className="fas fa-calendar-day"></i>
                                                <span>Дата выдачи: {license.date}</span>
                                            </div>
                                            <div className={styles.licenseDetail}>
                                                <i className="fas fa-calendar-check"></i>
                                                <span>Действует до: {license.expiry}</span>
                                            </div>
                                            <p className={styles.licenseDescription}>{license.description}</p>
                                        </div>
                                        <div className={styles.licenseStatus}>
                                            <span className={styles.statusBadge}>
                                                <i className="fas fa-check-circle"></i>
                                                Действителен
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-user-md"></i> Сертификаты специалистов</h4>
                            <p>Наши врачи имеют высшую квалификацию и регулярно подтверждают свои компетенции:</p>
                            
                            <div className={styles.doctorsGrid}>
                                {doctors.map(doctor => (
                                    <div key={doctor.id} className={styles.doctorCard}>
                                        <div className={styles.doctorHeader}>
                                            <div className={styles.doctorAvatar} style={{ backgroundColor: doctor.imageColor }}>
                                                <i className="fas fa-user-md"></i>
                                            </div>
                                            <div>
                                                <h5>{doctor.name}</h5>
                                                <p className={styles.doctorPosition}>{doctor.position}</p>
                                                <div className={styles.doctorInfo}>
                                                    <span><i className="fas fa-clock"></i> Опыт: {doctor.experience}</span>
                                                    <span><i className="fas fa-star"></i> Рейтинг: {doctor.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.doctorDetails}>
                                            <div className={styles.doctorEducation}>
                                                <h6><i className="fas fa-graduation-cap"></i> Образование:</h6>
                                                <p>{doctor.education}</p>
                                            </div>
                                            <div className={styles.doctorSpecialty}>
                                                <h6><i className="fas fa-stethoscope"></i> Специализация:</h6>
                                                <ul>
                                                    {doctor.specialty.map((spec, index) => (
                                                        <li key={index}>{spec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className={styles.doctorCertifications}>
                                                <h6><i className="fas fa-certificate"></i> Сертификаты:</h6>
                                                <div className={styles.certificationsList}>
                                                    {doctor.certifications.map((cert, index) => (
                                                        <span key={index} className={styles.certificationBadge}>
                                                            {cert}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-clipboard-check"></i> Проверки и аккредитации</h4>
                            <div className={styles.accreditations}>
                                <div className={styles.accreditationItem}>
                                    <div className={styles.accreditationIcon}>
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <div>
                                        <h5>Аккредитация JCI</h5>
                                        <p>Международная аккредитация качества медицинской помощи (в процессе)</p>
                                    </div>
                                </div>
                                <div className={styles.accreditationItem}>
                                    <div className={styles.accreditationIcon}>
                                        <i className="fas fa-star"></i>
                                    </div>
                                    <div>
                                        <h5>Рейтинг Росздравнадзора</h5>
                                        <p>Высокий уровень соблюдения стандартов медицинской деятельности</p>
                                    </div>
                                </div>
                                <div className={styles.accreditationItem}>
                                    <div className={styles.accreditationIcon}>
                                        <i className="fas fa-heartbeat"></i>
                                    </div>
                                    <div>
                                        <h5>Членство в ассоциациях</h5>
                                        <p>ОПРЭХ, РОХ, Ассоциация пластических хирургов</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-clinic-medical"></i> Оснащение клиники</h4>
                            <div className={styles.equipmentGrid}>
                                <div className={styles.equipmentItem}>
                                    <i className="fas fa-laptop-medical"></i>
                                    <span>Цифровое оборудование</span>
                                </div>
                                <div className={styles.equipmentItem}>
                                    <i className="fas fa-procedures"></i>
                                    <span>Современные операционные</span>
                                </div>
                                <div className={styles.equipmentItem}>
                                    <i className="fas fa-thermometer"></i>
                                    <span>Стерилизационные барьеры</span>
                                </div>
                                <div className={styles.equipmentItem}>
                                    <i className="fas fa-monitor-heart-rate"></i>
                                    <span>Мониторинг пациента</span>
                                </div>
                            </div>
                        </div>


                        <div className={styles.updateInfo}>
                            <p><i className="fas fa-sync-alt"></i> Информация актуальна на январь 2025 года</p>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
  <button className={styles.agreeButton} onClick={onClose}>
    <i className="fas fa-check"></i>
    Закрыть
  </button>
</div>
            </div>
        </div>
    );
};

export default LicensesModal;