"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './Appointment.module.css';

interface FormData {
    name: string;
    phone: string;
    email: string;
    service: string;
    date: string;
    time: string;
    doctor: string;
    comment: string;
}

interface Service {
    id: string;
    name: string;
}

interface Doctor {
    id: string;
    name: string;
}

interface DateOption {
    value: string;
    label: string;
}

const Appointment = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        email: '',
        service: '',
        date: '',
        time: '',
        doctor: '',
        comment: ''
    });

    const services: Service[] = [
    { id: 'face-surgery', name: 'Хирургия лица' },
    { id: 'body-surgery', name: 'Хирургия тела' },
    { id: 'breast-surgery', name: 'Хирургия груди' },
    { id: 'male-surgery', name: 'Мужская пластика' },
    { id: 'non-surgical', name: 'Безоперационные процедуры' },
    { id: 'reconstruction', name: 'Реконструктивная хирургия' },
    { id: 'consultation', name: 'Консультация' }
];

const doctors: Doctor[] = [
    { id: '1', name: 'Проф. Н. Паллуа (Главный пластический хирург)' },
    { id: '2', name: 'Др. Мария Делакур (Эксперт по лицу)' },
    { id: '3', name: 'Др. Анна Вольф (Хирургия тела)' },
    { id: '4', name: 'Др. Ханс Мюллер (Реконструктивная хирургия)' },
    { id: '5', name: 'Др. Луиджи Росси (Мужская пластика)' },
    { id: '6', name: 'Др. София Гарсия (Интимная пластика)' },
    { id: '7', name: 'Др. Эмили Чен (Косметолог-дерматолог)' },
    { id: '8', name: 'Др. Джеймс Картер (Анестезиолог)' },
    { id: 'any', name: 'Любой доступный врач' }
];

    const timeSlots: string[] = [
        '09:00', '10:00', '11:00', '12:00', 
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Форма отправлена:', formData);
        alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
        setFormData({
            name: '',
            phone: '',
            email: '',
            service: '',
            date: '',
            time: '',
            doctor: '',
            comment: ''
        });
    };

    const getNextDates = (): DateOption[] => {
        const dates: DateOption[] = [];
        const today = new Date();
        
        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const formattedDate = date.toISOString().split('T')[0];
            const displayDate = date.toLocaleDateString('ru-RU', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });
            dates.push({ value: formattedDate, label: displayDate });
        }
        
        return dates;
    };

    return (
        <section id="appointment" className={styles.appointment}>
            <div className="container">
                <div className={styles.appointmentContainer}>
                    <div className={styles.formSection}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Запись на прием</h2>
                            <p className={styles.formSubtitle}>
                                Заполните форму и мы свяжемся с вами для подтверждения записи
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.appointmentForm}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.formLabel}>
                                        <i className="fas fa-user"></i>
                                        Ваше имя *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={styles.formInput}
                                        placeholder="Иванов Иван"
                                        required
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label htmlFor="phone" className={styles.formLabel}>
                                        <i className="fas fa-phone"></i>
                                        Телефон *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={styles.formInput}
                                        placeholder="+7 (900) 123-45-67"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.formLabel}>
                                    <i className="fas fa-envelope"></i>
                                    Email (необязательно)
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    placeholder="example@mail.ru"
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="service" className={styles.formLabel}>
                                        <i className="fas fa-stethoscope"></i>
                                        Услуга *
                                    </label>
                                    <select
                                        id="service"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        className={styles.formSelect}
                                        required
                                    >
                                        <option value="">Выберите услугу</option>
                                        {services.map(service => (
                                            <option key={service.id} value={service.id}>
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label htmlFor="doctor" className={styles.formLabel}>
                                        <i className="fas fa-user-md"></i>
                                        Врач (необязательно)
                                    </label>
                                    <select
                                        id="doctor"
                                        name="doctor"
                                        value={formData.doctor}
                                        onChange={handleChange}
                                        className={styles.formSelect}
                                    >
                                        <option value="">Любой врач</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="date" className={styles.formLabel}>
                                        <i className="fas fa-calendar"></i>
                                        Дата приема *
                                    </label>
                                    <select
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className={styles.formSelect}
                                        required
                                    >
                                        <option value="">Выберите дату</option>
                                        {getNextDates().map(date => (
                                            <option key={date.value} value={date.value}>
                                                {date.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label htmlFor="time" className={styles.formLabel}>
                                        <i className="fas fa-clock"></i>
                                        Время *
                                    </label>
                                    <select
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className={styles.formSelect}
                                        required
                                    >
                                        <option value="">Выберите время</option>
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="comment" className={styles.formLabel}>
                                    <i className="fas fa-comment"></i>
                                    Комментарий (необязательно)
                                </label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    className={styles.formTextarea}
                                    placeholder="Опишите вашу проблему или пожелания..."
                                    rows={3}
                                ></textarea>
                            </div>

                            <div className={styles.formCheckbox}>
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    name="privacy"
                                    required
                                    className={styles.checkboxInput}
                                />
                                <label htmlFor="privacy" className={styles.checkboxLabel}>
                                    Я согласен на обработку персональных данных и ознакомлен с 
                                    <a href="#" className={styles.privacyLink}> политикой конфиденциальности</a>
                                </label>
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                <i className="fas fa-paper-plane"></i>
                                Записаться на прием
                            </button>
                        </form>
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-phone-volume"></i>
                            </div>
                            <h3>Телефон для записи</h3>
                            <div className={styles.phoneNumbers}>
                                <a href="tel:+79131489142" className={styles.phoneLink}>
                                    +7 (913) 148-91-42
                                </a>
                                <a href="tel:+73812209142" className={styles.phoneLink}>
                                    +7 (3812) 20-91-42
                                </a>
                            </div>
                            <p className={styles.infoText}>
                                Звонки принимаются ежедневно с 8:00 до 20:00
                            </p>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-clock"></i>
                            </div>
                            <h3>График работы</h3>
                            <div className={styles.schedule}>
                                <div className={styles.scheduleItem}>
                                    <span>Понедельник - Пятница</span>
                                    <span>8:00 - 20:00</span>
                                </div>
                                <div className={styles.scheduleItem}>
                                    <span>Суббота</span>
                                    <span>9:00 - 18:00</span>
                                </div>
                                <div className={styles.scheduleItem}>
                                    <span>Воскресенье</span>
                                    <span>9:00 - 18:00</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <h3>Адрес клиники</h3>
                            <p className={styles.address}>
                                г. Омск, ул. 70 лет октября 26
                            </p>
                            <button className={styles.mapBtn}>
                                <i className="fas fa-directions"></i>
                                Построить маршрут
                            </button>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-info-circle"></i>
                            </div>
                            <h3>Важная информация</h3>
                            <ul className={styles.infoList}>
                                <li>При себе иметь паспорт</li>
                                <li>Предыдущие медицинские документы</li>
                                <li>Запись подтверждается по телефону</li>
                                <li>Отмена за 2 часа до приема</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Appointment;