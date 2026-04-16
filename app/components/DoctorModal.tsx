"use client";

import React, { useState, useEffect } from 'react';
import styles from './DoctorModal.module.css';

interface Doctor {
  id?: number;
  name: string;
  specialization: string;
  description: string;
  experience: number;
  rating: number;
  is_active: boolean;
  order_index: number;
}

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doctor: Doctor) => void;
  doctor?: Doctor | null;
}

const DoctorModal: React.FC<DoctorModalProps> = ({ isOpen, onClose, onSave, doctor }) => {
  const [formData, setFormData] = useState<Doctor>({
    name: '',
    specialization: '',
    description: '',
    experience: 0,
    rating: 0,
    is_active: true,
    order_index: 0,
  });

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    } else {
      setFormData({
        name: '',
        specialization: '',
        description: '',
        experience: 0,
        rating: 0,
        is_active: true,
        order_index: 0,
      });
    }
  }, [doctor, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <i className="fas fa-user-md"></i>
            {doctor ? 'Редактировать врача' : 'Добавить врача'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              <i className="fas fa-user"></i>
              ФИО врача *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Проф. Н. Паллуа"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="specialization" className={styles.formLabel}>
              <i className="fas fa-stethoscope"></i>
              Специализация *
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Главный пластический хирург"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.formLabel}>
              <i className="fas fa-align-left"></i>
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.formTextarea}
              placeholder="Образование, сертификаты, опыт..."
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="experience" className={styles.formLabel}>
                <i className="fas fa-briefcase"></i>
                Опыт (лет)
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={styles.formInput}
                min="0"
                max="50"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rating" className={styles.formLabel}>
                <i className="fas fa-star"></i>
                Рейтинг
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className={styles.formInput}
                min="0"
                max="5"
                step="0.1"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="order_index" className={styles.formLabel}>
                <i className="fas fa-sort"></i>
                Порядок
              </label>
              <input
                type="number"
                id="order_index"
                name="order_index"
                value={formData.order_index}
                onChange={handleChange}
                className={styles.formInput}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <i className="fas fa-toggle-on"></i>
                Статус
              </label>
              <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  <span className={styles.toggleText}>
                    {formData.is_active ? 'Активен' : 'Неактивен'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              <i className="fas fa-times"></i>
              Отмена
            </button>
            <button type="submit" className={styles.saveButton}>
              <i className="fas fa-save"></i>
              {doctor ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorModal;