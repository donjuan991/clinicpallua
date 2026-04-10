// app/components/AppointmentModal.tsx (обновленная версия)
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from './AppointmentModal.module.css';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Service {
  id: number;
  name: string;
  category: string;
}

interface AppointmentFormData {
  name: string;
  phone: string;
  email: string;
  serviceId: string;
  date: string;
  time: string;
  doctorId: string;
  comment: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialDoctor?: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ 
  isOpen, 
  onClose, 
  initialService = '', 
  initialDoctor = '' 
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    phone: '',
    email: '',
    serviceId: '',
    date: '',
    time: '',
    doctorId: '',
    comment: ''
  });

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  // Загрузка врачей при открытии модалки
  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
      fetchServices();
    }
  }, [isOpen]);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      if (data.doctors) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchAvailableSlots = async (doctorId: string, date: string) => {
    if (!doctorId || !date) return;
    
    try {
      const res = await fetch(`/api/slots?doctorId=${doctorId}&date=${date}`);
      const data = await res.json();
      if (data.slots) {
        setAvailableSlots(data.slots);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Если изменился врач или дата, обновляем доступные слоты
    if (name === 'doctorId' || name === 'date') {
      if (formData.doctorId && (name === 'date' ? value : formData.date)) {
        fetchAvailableSlots(
          name === 'doctorId' ? value : formData.doctorId,
          name === 'date' ? value : formData.date
        );
      }
    }
  };

  const getNextDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Только рабочие дни (пн-пт)
      const dayOfWeek = date.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const formattedDate = date.toISOString().split('T')[0];
        const displayDate = date.toLocaleDateString('ru-RU', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
        dates.push({ value: formattedDate, label: displayDate });
      }
    }
    
    return dates;
  };

  const handleNextStep = () => {
    if (step === 1 && (!formData.name || !formData.phone)) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }
    if (step === 2 && (!formData.doctorId || !formData.date || !formData.time)) {
      alert('Пожалуйста, выберите врача, дату и время');
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: formData.name,
          patientPhone: formData.phone,
          patientEmail: formData.email,
          doctorId: parseInt(formData.doctorId),
          serviceId: formData.serviceId ? parseInt(formData.serviceId) : null,
          appointmentDate: formData.date,
          appointmentTime: formData.time,
          comment: formData.comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Запись успешно оформлена! Мы свяжемся с вами для подтверждения.');
        onClose();
        // Сброс формы
        setFormData({
          name: '',
          phone: '',
          email: '',
          serviceId: '',
          date: '',
          time: '',
          doctorId: '',
          comment: ''
        });
        setStep(1);
      } else {
        alert(data.error || 'Ошибка при создании записи');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const dateOptions = getNextDates();
  const timeSlots = availableSlots;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
            <div className={styles.progressSteps}>
              <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
                <span className={styles.stepNumber}>1</span>
                <span className={styles.stepLabel}>Данные</span>
              </div>
              <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
                <span className={styles.stepNumber}>2</span>
                <span className={styles.stepLabel}>Врач и время</span>
              </div>
              <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
                <span className={styles.stepNumber}>3</span>
                <span className={styles.stepLabel}>Подтверждение</span>
              </div>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.appointmentForm}>
          {step === 1 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className="fas fa-user-circle"></i>
                Ваши контактные данные
              </h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  <i className="fas fa-user"></i>
                  ФИО *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Иванов Иван Иванович"
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
                <label htmlFor="email" className={styles.formLabel}>
                  <i className="fas fa-envelope"></i>
                  Email (для уведомлений)
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

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.nextButton}
                  onClick={handleNextStep}
                >
                  Далее
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className="fas fa-calendar-alt"></i>
                Выбор врача и времени
              </h3>

              <div className={styles.formGroup}>
                <label htmlFor="doctorId" className={styles.formLabel}>
                  <i className="fas fa-user-md"></i>
                  Врач *
                </label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className={styles.formSelect}
                  required
                >
                  <option value="">Выберите врача</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="serviceId" className={styles.formLabel}>
                  <i className="fas fa-stethoscope"></i>
                  Услуга (по желанию)
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="">Выберите услугу</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.dateTimeGroup}>
                <div className={styles.formGroup}>
                  <label htmlFor="date" className={styles.formLabel}>
                    <i className="fas fa-calendar"></i>
                    Дата *
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
                    {dateOptions.map(date => (
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
                    disabled={!formData.doctorId || !formData.date}
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
                  Комментарий (описание симптомов)
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

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.backButton}
                  onClick={handlePrevStep}
                >
                  <i className="fas fa-arrow-left"></i>
                  Назад
                </button>
                <button 
                  type="button" 
                  className={styles.nextButton}
                  onClick={handleNextStep}
                >
                  Далее
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className="fas fa-check-circle"></i>
                Подтверждение записи
              </h3>

              <div className={styles.confirmationInfo}>
                <div className={styles.infoCard}>
                  <h4>Ваши данные</h4>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>ФИО:</span>
                    <span className={styles.infoValue}>{formData.name}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Телефон:</span>
                    <span className={styles.infoValue}>{formData.phone}</span>
                  </div>
                  {formData.email && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Email:</span>
                      <span className={styles.infoValue}>{formData.email}</span>
                    </div>
                  )}
                </div>

                <div className={styles.infoCard}>
                  <h4>Детали записи</h4>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Врач:</span>
                    <span className={styles.infoValue}>
                      {doctors.find(d => d.id.toString() === formData.doctorId)?.name || 'Не выбрано'}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Услуга:</span>
                    <span className={styles.infoValue}>
                      {services.find(s => s.id.toString() === formData.serviceId)?.name || 'Не выбрано'}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Дата и время:</span>
                    <span className={styles.infoValue}>
                      {formData.date ? new Date(formData.date).toLocaleDateString('ru-RU') : 'Не выбрано'} в {formData.time}
                    </span>
                  </div>
                </div>

                {formData.comment && (
                  <div className={styles.infoCard}>
                    <h4>Комментарий</h4>
                    <p className={styles.commentText}>{formData.comment}</p>
                  </div>
                )}

                <div className={styles.formCheckbox}>
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className={styles.checkboxInput}
                  />
                  <label htmlFor="privacy" className={styles.checkboxLabel}>
                    Я согласен на обработку персональных данных и подтверждаю корректность указанной информации
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.backButton}
                  onClick={handlePrevStep}
                >
                  <i className="fas fa-arrow-left"></i>
                  Назад
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
                      Записаться на прием
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;