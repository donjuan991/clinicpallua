"use client";

import React, { useState, useEffect } from 'react';
import styles from './ServiceModal.module.css';

interface Service {
  id?: number;
  name: string;
  description: string;
  price: number | null;
  duration: number | null;
  category: string;
  is_active: boolean;
  order_index: number;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
  service?: Service | null;
}

const categories = [
  { value: 'consultation', label: 'Консультация' },
  { value: 'face-surgery', label: 'Хирургия лица' },
  { value: 'body-surgery', label: 'Хирургия тела' },
  { value: 'breast-surgery', label: 'Хирургия груди' },
  { value: 'male-surgery', label: 'Мужская пластика' },
  { value: 'non-surgical', label: 'Безоперационные процедуры' },
  { value: 'reconstruction', label: 'Реконструктивная хирургия' },
];

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, onSave, service }) => {
  const [formData, setFormData] = useState<Service>({
    name: '',
    description: '',
    price: null,
    duration: null,
    category: 'consultation',
    is_active: true,
    order_index: 0,
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: '',
        description: '',
        price: null,
        duration: null,
        category: 'consultation',
        is_active: true,
        order_index: 0,
      });
    }
  }, [service, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? (value ? parseInt(value) : null) : value
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
            <i className="fas fa-stethoscope"></i>
            {service ? 'Редактировать услугу' : 'Добавить услугу'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              <i className="fas fa-tag"></i>
              Название услуги *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Консультация профессора"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.formLabel}>
              <i className="fas fa-folder"></i>
              Категория *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.formSelect}
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.formLabel}>
                <i className="fas fa-ruble-sign"></i>
                Цена (₽)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="5000"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="duration" className={styles.formLabel}>
                <i className="fas fa-clock"></i>
                Длительность (мин)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration || ''}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="60"
                min="0"
              />
            </div>
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
              placeholder="Описание услуги..."
              rows={3}
            />
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
                    {formData.is_active ? 'Активна' : 'Неактивна'}
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
              {service ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;