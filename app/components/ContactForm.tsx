"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './ContactForm.module.css';

interface FormData {
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
}

const ContactForm = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    });

    const subjects: string[] = [
        'Общий вопрос',
        'Запись на прием',
        'Вопрос по лечению',
        'Отзыв о работе',
        'Сотрудничество',
        'Другое'
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
        console.log('Контактная форма отправлена:', formData);
        alert('Спасибо за обращение! Мы ответим вам в ближайшее время.');
        setFormData({
            name: '',
            phone: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <section className={styles.contactForm} id="contactForm">
            <div className="container">
                <div className={styles.contactContainer}>
                    <div className={styles.contactInfo}>
                        <div className={styles.infoHeader}>
                            <h2 className={styles.infoTitle}>Контакты</h2>
                            <p className={styles.infoSubtitle}>
                                Свяжитесь с нами любым удобным способом
                            </p>
                        </div>

                        <div className={styles.contactDetails}>
                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div className={styles.contactContent}>
                                    <h4>Адрес</h4>
                                    <p>г. Омск, ул. 70 лет октября 26</p>
                                    <button className={styles.mapLink}>
                                        <i className="fas fa-directions"></i>
                                        Посмотреть на карте
                                    </button>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <i className="fas fa-phone"></i>
                                </div>
                                <div className={styles.contactContent}>
                                    <h4>Телефоны</h4>
                                    <div className={styles.phones}>
                                        <a href="tel:+79131489142" className={styles.phone}>
                                            +7 (913) 148-91-42
                                        </a>
                                        <a href="tel:+73812209142" className={styles.phone}>
                                            +7 (3812) 20-91-42
                                        </a>
                                    </div>
                                    <p className={styles.contactNote}>
                                        Звонки принимаются ежедневно с 8:00 до 20:00
                                    </p>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div className={styles.contactContent}>
                                    <h4>Email</h4>
                                    <a href="mailto:info@clinic-omsk.ru" className={styles.email}>
                                        info@pallua-clinic.com
                                    </a>
                                    <p className={styles.contactNote}>
                                        Отвечаем в течение 24 часов
                                    </p>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className={styles.contactContent}>
                                    <h4>График работы</h4>
                                    <div className={styles.schedule}>
                                        <div className={styles.scheduleRow}>
                                            <span>Пн-Пт:</span>
                                            <span>8:00 - 20:00</span>
                                        </div>
                                        <div className={styles.scheduleRow}>
                                            <span>Сб-Вс:</span>
                                            <span>9:00 - 18:00</span>
                                        </div>
                                    </div>
                                    <p className={styles.contactNote}>
                                        Прием по предварительной записи
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.socialSection}>
                            <h4>Мы в социальных сетях</h4>
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
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Напишите нам</h2>
                            <p className={styles.formSubtitle}>
                                Заполните форму и мы свяжемся с вами в ближайшее время
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.contactFormElement}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={styles.formInput}
                                        placeholder="Ваше имя *"
                                        required
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={styles.formInput}
                                        placeholder="Телефон *"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    placeholder="Email (необязательно)"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={styles.formSelect}
                                    required
                                >
                                    <option value="">Тема обращения *</option>
                                    {subjects.map((subject, index) => (
                                        <option key={index} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={styles.formTextarea}
                                    placeholder="Ваше сообщение *"
                                    rows={5}
                                    required
                                ></textarea>
                            </div>

                            <div className={styles.formCheckbox}>
                                <input
                                    type="checkbox"
                                    id="contactPrivacy"
                                    required
                                    className={styles.checkboxInput}
                                />
                                <label htmlFor="contactPrivacy" className={styles.checkboxLabel}>
                                    Я согласен на обработку персональных данных
                                </label>
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                <i className="fas fa-paper-plane"></i>
                                Отправить сообщение
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;