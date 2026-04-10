"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './CallbackModal.module.css'; 

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        concern: '', 
        comment: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const problemOptions = [
        { value: '', label: 'Выберите проблемную зону' },
        { value: 'face-nose', label: 'Нос (ринопластика)' },
        { value: 'face-eyes', label: 'Веки (блефаропластика)' },
        { value: 'face-lift', label: 'Подтяжка лица' },
        { value: 'breast-augmentation', label: 'Увеличение груди' },
        { value: 'breast-lift', label: 'Подтяжка груди' },
        { value: 'breast-reduction', label: 'Уменьшение груди' },
        { value: 'body-abdomen', label: 'Живот (абдоминопластика)' },
        { value: 'body-liposuction', label: 'Липосакция' },
        { value: 'male-gynecomastia', label: 'Мужская грудь (гинекомастия)' },
        { value: 'intimate-labia', label: 'Интимная пластика' },
        { value: 'reconstruction', label: 'Реконструкция/коррекция' },
        { value: 'injections', label: 'Инъекционные процедуры' },
        { value: 'multiple', label: 'Несколько проблемных зон' },
        { value: 'other', label: 'Другое' }
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

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Заявка на консультацию:', formData);
        
        //название проблемы по значению
        const selectedProblem = problemOptions.find(option => option.value === formData.concern);
        const problemName = selectedProblem ? selectedProblem.label : formData.concern;
        
        setIsLoading(false);
        alert(`Спасибо, ${formData.name}! Наш специалист свяжется с вами для консультации по вопросу "${problemName}".`);
        onClose();
        setFormData({ name: '', phone: '', concern: '', comment: '' });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <i className="fas fa-user-md"></i>
                        Консультация пластического хирурга
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
                        <label htmlFor="concern" className={styles.formLabel}>
                            <i className="fas fa-heartbeat"></i> 
                            Проблемная зона
                        </label>
                        <select
                            id="concern"
                            name="concern" 
                            value={formData.concern}
                            onChange={handleChange}
                            className={styles.formSelect}
                        >
                            {problemOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="comment" className={styles.formLabel}>
                            <i className="fas fa-comment-medical"></i>
                            Дополнительная информация
                        </label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            className={styles.formTextarea}
                            placeholder="Опишите вашу ситуацию, историю предыдущих операций, желаемый результат..."
                            rows={4}
                        ></textarea>
                    </div>

                    <div className={styles.formCheckbox}>
                        <input
                            type="checkbox"
                            id="consultationPrivacy"
                            required
                            className={styles.checkboxInput}
                        />
                        <label htmlFor="consultationPrivacy" className={styles.checkboxLabel}>
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
                                    <i className="fas fa-calendar-check"></i>
                                    Записаться на консультацию
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className={styles.modalFooter}>
                    <p className={styles.modalInfo}>
                        <i className="fas fa-info-circle"></i>
                        Консультация включает: осмотр, 3D-моделирование результата, 
                        составление индивидуального плана лечения и стоимости
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConsultationModal;