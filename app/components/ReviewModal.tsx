"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './ReviewModal.module.css';

interface ReviewFormData {
    name: string;
    email: string;
    rating: number;
    doctor: string;
    treatment: string;
    review: string;
    privacy: boolean;
}

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<ReviewFormData>({
        name: '',
        email: '',
        rating: 5,
        doctor: '',
        treatment: '',
        review: '',
        privacy: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const doctors = [
        { id: 'any', name: 'Любой доступный врач' },
        { id: '1', name: 'Проф. Н. Паллуа (Главный пластический хирург)' },
        { id: '2', name: 'Др. Мария Делакур (Эксперт по лицу)' },
        { id: '3', name: 'Др. Ханс Мюллер (Реконструктивная хирургия)' },
        { id: '4', name: 'Др. Анна Вольф (Хирургия тела)' },
        { id: '5', name: 'Др. Луиджи Росси (Мужская пластика)' },
        { id: '6', name: 'Др. София Гарсия (Интимная пластика)' },
        { id: '7', name: 'Др. Эмили Чен (Косметолог-дерматолог)' },
        { id: '8', name: 'Др. Джеймс Картер (Анестезиолог)' }
    ];

    const treatments = [
        'Консультация профессора Паллуа',
        'Ринопластика (коррекция носа)',
        'Блефаропластика (веки)',
        'Подтяжка лица',
        'Липосакция',
        'Абдоминопластика (живот)',
        'Маммопластика (грудь)',
        'Безоперационные процедуры',
        'Реконструктивная хирургия',
        'Другое'
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRatingChange = (rating: number) => {
        setFormData(prev => ({
            ...prev,
            rating
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.privacy) {
            alert('Пожалуйста, согласитесь на обработку персональных данных');
            return;
        }

        setIsLoading(true);

        // Имитация отправки
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Отзыв отправлен:', formData);


        setIsLoading(false);
        setSubmitted(true);
        
        setTimeout(() => {
            setSubmitted(false);
            onClose();
            setFormData({
                name: '',
                email: '',
                rating: 5,
                doctor: '',
                treatment: '',
                review: '',
                privacy: false
            });
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <i className="fas fa-comment-medical"></i>
                        {submitted ? 'Спасибо за отзыв!' : 'Оставить отзыв о лечении'}
                    </h2>
                    {!submitted && (
                        <button className={styles.closeButton} onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>

                {submitted ? (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h3>Ваш отзыв успешно отправлен!</h3>
                        <p>После проверки модератором он появится на сайте. Спасибо за ваше мнение!</p>
                        <button 
                            className={styles.closeSuccessBtn}
                            onClick={onClose}
                        >
                            Закрыть
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.reviewForm}>
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
                                <label htmlFor="email" className={styles.formLabel}>
                                    <i className="fas fa-envelope"></i>
                                    Email (не публикуется)
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    placeholder="example@mail.ru"
                                    required
                                />
                            </div>
                        </div>

                        {/* Рейтинг */}
                        <div className={styles.ratingSection}>
                            <label className={styles.formLabel}>
                                <i className="fas fa-star"></i>
                                Оценка лечения
                            </label>
                            <div className={styles.ratingStars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`${styles.starButton} ${star <= formData.rating ? styles.active : ''}`}
                                        onClick={() => handleRatingChange(star)}
                                    >
                                        <i className="fas fa-star"></i>
                                    </button>
                                ))}
                                <span className={styles.ratingText}>
                                    {formData.rating}.0 из 5
                                </span>
                            </div>
                        </div>

                        <div className={styles.formRow}>
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
                                    <option value="">Выберите врача</option>
                                    {doctors.map((doctor, index) => (
                                        <option key={doctor.id} value={doctor.name}>
                                            {doctor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="treatment" className={styles.formLabel}>
                                    <i className="fas fa-heartbeat"></i>
                                    Процедура/операция
                                </label>
                                <select
                                    id="treatment"
                                    name="treatment"
                                    value={formData.treatment}
                                    onChange={handleChange}
                                    className={styles.formSelect}
                                >
                                    <option value="">Выберите процедуру</option>
                                    {treatments.map((treatment, index) => (
                                        <option key={index} value={treatment}>
                                            {treatment}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="review" className={styles.formLabel}>
                                <i className="fas fa-comment-dots"></i>
                                Ваш отзыв *
                            </label>
                            <textarea
                                id="review"
                                name="review"
                                value={formData.review}
                                onChange={handleChange}
                                className={styles.formTextarea}
                                placeholder="Поделитесь вашим опытом лечения в клинике Паллуа. Расскажите о результате операции, периоде восстановления, отношении врача и персонала..."
                                rows={6}
                                required
                            ></textarea>
                            <div className={styles.reviewHint}>
                                <i className="fas fa-lightbulb"></i>
                                Расскажите о результатах, ощущениях, реабилитации и общем впечатлении
                            </div>
                        </div>

                        <div className={styles.privacySection}>
                            <div className={styles.formCheckbox}>
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    name="privacy"
                                    checked={formData.privacy}
                                    onChange={handleChange}
                                    className={styles.checkboxInput}
                                    required
                                />
                                <label htmlFor="privacy" className={styles.checkboxLabel}>
                                    Я согласен на обработку персональных данных и публикацию отзыва на сайте
                                </label>
                            </div>
                            <div className={styles.formCheckbox}>
                                <input
                                    type="checkbox"
                                    id="anonymous"
                                    name="anonymous"
                                    className={styles.checkboxInput}
                                />
                                <label htmlFor="anonymous" className={styles.checkboxLabel}>
                                    Опубликовать анонимно (только инициалы)
                                </label>
                            </div>
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
                                        <i className="fas fa-paper-plane"></i>
                                        Опубликовать отзыв
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReviewModal;