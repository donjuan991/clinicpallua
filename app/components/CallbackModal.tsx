"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './CallbackModal.module.css';

interface CallbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CallbackModal: React.FC<CallbackModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        time: '',
        comment: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const timeSlots = [
        'В любое время',
        '9:00 - 12:00',
        '12:00 - 15:00', 
        '15:00 - 18:00',
        '18:00 - 20:00'
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Имитация отправки
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Заявка на обратный звонок:', formData);

        setIsLoading(false);
        alert(`Спасибо, ${formData.name}! Мы позвоним вам на номер ${formData.phone} в указанное время.`);
        onClose();
        setFormData({ name: '', phone: '', time: '', comment: '' });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <i className="fas fa-phone-volume"></i>
                        Заказать обратный звонок
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.callbackForm}>
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

                    <div className={styles.formGroup}>
                        <label htmlFor="time" className={styles.formLabel}>
                            <i className="fas fa-clock"></i>
                            Удобное время для звонка
                        </label>
                        <select
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className={styles.formSelect}
                        >
                            <option value="">Выберите время</option>
                            {timeSlots.map((time, index) => (
                                <option key={index} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="comment" className={styles.formLabel}>
                            <i className="fas fa-comment"></i>
                            Тема звонка (необязательно)
                        </label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            className={styles.formTextarea}
                            placeholder="По какому вопросу вам перезвонить?"
                            rows={3}
                        ></textarea>
                    </div>

                    <div className={styles.formCheckbox}>
                        <input
                            type="checkbox"
                            id="callbackPrivacy"
                            required
                            className={styles.checkboxInput}
                        />
                        <label htmlFor="callbackPrivacy" className={styles.checkboxLabel}>
                            Я согласен на обработку персональных данных
                        </label>
                    </div>

                    <div className={styles.formActions}>
                        <button 
                            type="button" 
                            className={styles.cancelButton}
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Отправка...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-phone"></i>
                                    Заказать звонок
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CallbackModal;