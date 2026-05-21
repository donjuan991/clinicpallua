// app/components/AppointmentModal.tsx
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from './AppointmentModal.module.css';
import { useLanguage } from './languageContext';

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
  const { t } = useLanguage();
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    phone: '',
    email: '',
    serviceId: initialService,
    date: '',
    time: '',
    doctorId: initialDoctor,
    comment: ''
  });

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
      fetchServices();
      if (initialDoctor) {
        setFormData(prev => ({ ...prev, doctorId: initialDoctor }));
      }
    }
  }, [isOpen, initialDoctor]);

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      fetchAvailableSlots(formData.doctorId, formData.date);
    } else {
      setAvailableSlots([]);
    }
  }, [formData.doctorId, formData.date]);

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
    
    console.log('Fetching slots for:', { doctorId, date });
    setIsLoadingSlots(true);
    
    try {
      const res = await fetch(`/api/slots?doctorId=${doctorId}&date=${date}`);
      const data = await res.json();
      console.log('Slots response:', data);
      
      if (data.slots && Array.isArray(data.slots)) {
        setAvailableSlots(data.slots);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getNextDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
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
      alert(t('fillRequiredFields'));
      return;
    }
    if (step === 2 && (!formData.doctorId || !formData.date || !formData.time)) {
      alert(t('selectDoctorDateTime'));
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
        alert(data.message || t('appointmentSuccess'));
        onClose();
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
        alert(data.error || t('appointmentError'));
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert(t('appointmentNetworkError'));
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
                <span className={styles.stepLabel}>{t('stepData')}</span>
              </div>
              <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
                <span className={styles.stepNumber}>2</span>
                <span className={styles.stepLabel}>{t('stepDoctorTime')}</span>
              </div>
              <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
                <span className={styles.stepNumber}>3</span>
                <span className={styles.stepLabel}>{t('stepConfirm')}</span>
              </div>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.appointmentForm}>
          {/* Шаг 1: Данные */}
          {step === 1 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className="fas fa-user-circle"></i>
                {t('yourContactDetails')}
              </h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  <i className="fas fa-user"></i>
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder={t('fullNamePlaceholder')}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.formLabel}>
                  <i className="fas fa-phone"></i>
                  {t('phone')} *
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
                  {t('emailOptional')}
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
                  {t('next')}
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Шаг 2: Врач и время */}
          {step === 2 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className="fas fa-calendar-alt"></i>
                {t('selectDoctorAndTime')}
              </h3>

              <div className={styles.formGroup}>
                <label htmlFor="doctorId" className={styles.formLabel}>
                  <i className="fas fa-user-md"></i>
                  {t('selectDoctor')} *
                </label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className={styles.formSelect}
                  required
                >
                  <option value="">{t('selectDoctor')}</option>
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
                  {t('selectService')}
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="">{t('selectService')}</option>
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
                    {t('selectDate')} *
                  </label>
                  <select
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={styles.formSelect}
                    required
                  >
                    <option value="">{t('selectDate')}</option>
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
                    {t('selectTime')} *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={styles.formSelect}
                    required
                    disabled={!formData.doctorId || !formData.date || isLoadingSlots}
                  >
                    <option value="">
                      {isLoadingSlots ? t('loading') : t('selectTime')}
                    </option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {formData.doctorId && formData.date && timeSlots.length === 0 && !isLoadingSlots && (
                    <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                      {t('noAvailableSlots')}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="comment" className={styles.formLabel}>
                  <i className="fas fa-comment"></i>
                  {t('comment')}
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className={styles.formTextarea}
                  placeholder={t('commentPlaceholder')}
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
                  {t('back')}
                </button>
                <button 
                  type="button" 
                  className={styles.nextButton}
                  onClick={handleNextStep}
                >
                  {t('next')}
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Шаг 3: Подтверждение */}
          {step === 3 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className="fas fa-check-circle"></i>
                {t('confirmAppointment')}
              </h3>

              {/* Памятка перед записью */}
              <div style={{
                background: 'rgba(255, 193, 7, 0.08)',
                border: '1px solid rgba(255, 193, 7, 0.2)',
                borderLeft: '4px solid #ffc107',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  color: '#856404', 
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <i className="fas fa-info-circle"></i>
                  {t('importantInfo')}
                </h4>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px', 
                  color: '#856404', 
                  fontSize: '13px',
                  lineHeight: '1.8'
                }}>
                  <li>{t('reminder1')}</li>
                  <li>{t('reminder2')}</li>
                  <li>{t('reminder3')}</li>
                  <li>{t('reminder4')}</li>
                </ul>
              </div>

              <div className={styles.confirmationInfo}>
                <div className={styles.infoCard}>
                  <h4><i className="fas fa-user"></i> {t('yourData')}</h4>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('fullName')}:</span>
                    <span className={styles.infoValue}>{formData.name}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('phone')}:</span>
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
                  <h4><i className="fas fa-calendar-check"></i> {t('appointmentDetails')}</h4>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('doctor')}:</span>
                    <span className={styles.infoValue}>
                      {doctors.find(d => d.id.toString() === formData.doctorId)?.name || t('notSelected')}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('service')}:</span>
                    <span className={styles.infoValue}>
                      {services.find(s => s.id.toString() === formData.serviceId)?.name || t('notSelected')}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('dateTime')}:</span>
                    <span className={styles.infoValue}>
                      {formData.date ? new Date(formData.date).toLocaleDateString('ru-RU') : t('notSelected')} {t('at')} {formData.time}
                    </span>
                  </div>
                </div>

                {formData.comment && (
                  <div className={styles.infoCard}>
                    <h4><i className="fas fa-comment"></i> {t('comment')}</h4>
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
                    {t('agreePrivacy')} <a href="#" onClick={(e) => { e.preventDefault(); alert(t('privacyPolicyText')); }} style={{ color: '#771d55', textDecoration: 'underline' }}>{t('privacyPolicy')}</a> {t('confirmInfo')}
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
                  {t('back')}
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      {t('sending')}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      {t('bookAppointment')}
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