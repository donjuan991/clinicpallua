// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

interface Appointment {
  id: number;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  doctor_name: string;
  service_name: string | null;
  status: string;
  comment: string | null;
  patient_name?: string;
  patient_phone?: string;
  appointment_date?: string;
  appointment_time?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchAppointments();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      console.log('Appointments data:', data);
      
      if (data.appointments) {
        // Нормализуем данные: API может возвращать разные названия полей
        const normalized = data.appointments.map((apt: any) => ({
          ...apt,
          // Используем оба варианта названий полей
          patientName: apt.patient_name || apt.patientName || '',
          patientPhone: apt.patient_phone || apt.patientPhone || '',
          appointmentDate: apt.appointment_date || apt.appointmentDate || '',
          appointmentTime: apt.appointment_time || apt.appointmentTime || '',
        }));
        setAppointments(normalized);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Безопасное форматирование даты
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Дата не указана';
      
      // Пробуем создать объект Date
      const date = new Date(dateString);
      
      // Проверяем валидность
      if (isNaN(date.getTime())) {
        // Если невалидная дата, пробуем распарсить вручную
        // Формат YYYY-MM-DD
        if (dateString.includes('-')) {
          const parts = dateString.split('-');
          if (parts.length === 3) {
            const [year, month, day] = parts.map(Number);
            const manualDate = new Date(year, month - 1, day);
            if (!isNaN(manualDate.getTime())) {
              return manualDate.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });
            }
          }
        }
        
        // Формат DD.MM.YYYY
        if (dateString.includes('.')) {
          const parts = dateString.split('.');
          if (parts.length === 3) {
            const [day, month, year] = parts.map(Number);
            const manualDate = new Date(year, month - 1, day);
            if (!isNaN(manualDate.getTime())) {
              return manualDate.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });
            }
          }
        }
        
        // Если ничего не помогло, возвращаем исходную строку
        console.warn('Could not parse date:', dateString);
        return dateString;
      }
      
      // Форматируем валидную дату
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return dateString || 'Ошибка даты';
    }
  };

  const cancelAppointment = async (appointmentId: number) => {
    if (!confirm('Вы уверены, что хотите отменить запись?')) return;

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        alert('Запись успешно отменена');
        fetchAppointments();
      } else {
        const error = await res.json().catch(() => ({}));
        alert('Ошибка при отмене записи: ' + (error.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Ошибка при отмене записи. Попробуйте позже.');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Ожидает подтверждения',
      'confirmed': 'Подтверждена',
      'cancelled': 'Отменена',
      'completed': 'Завершена',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classMap: Record<string, string> = {
      'pending': styles.statusPending,
      'confirmed': styles.statusConfirmed,
      'cancelled': styles.statusCancelled,
      'completed': styles.statusCompleted,
    };
    return classMap[status] || '';
  };

  // Получаем данные записи (поддержка обоих форматов названий полей)
  const getAppointmentDate = (apt: any) => apt.appointmentDate || apt.appointment_date || '';
  const getAppointmentTime = (apt: any) => apt.appointmentTime || apt.appointment_time || '';
  const getPatientName = (apt: any) => apt.patientName || apt.patient_name || '';
  const getPatientPhone = (apt: any) => apt.patientPhone || apt.patient_phone || '';
  const getDoctorName = (apt: any) => apt.doctor_name || '';
  const getServiceName = (apt: any) => apt.service_name || null;
  const getComment = (apt: any) => apt.comment || null;

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <i className="fas fa-spinner fa-spin"></i>
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.notLoggedIn}>
          <i className="fas fa-lock"></i>
          <h2>Войдите в личный кабинет</h2>
          <p>Для просмотра записей необходимо авторизоваться</p>
          <button className={styles.loginBtn} onClick={() => window.location.href = '/login'}>
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Личный кабинет</h1>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <i className="fas fa-user-circle"></i>
          </div>
          <div className={styles.userDetails}>
            <h2>{user.name}</h2>
            <p><i className="fas fa-envelope"></i> {user.email}</p>
            {user.phone && <p><i className="fas fa-phone"></i> {user.phone}</p>}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Мои записи</h2>
        {appointments.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-calendar-alt"></i>
            <p>У вас пока нет записей</p>
            <button 
              className={styles.appointmentBtn}
              onClick={() => window.location.href = '/#appointment'}
            >
              <i className="fas fa-calendar-plus"></i> Записаться на прием
            </button>
          </div>
        ) : (
          <div className={styles.appointmentsList}>
            {appointments.map((apt) => (
              <div key={apt.id} className={styles.appointmentCard}>
                <div className={styles.appointmentHeader}>
                  <span className={styles.appointmentDate}>
                    <i className="fas fa-calendar"></i>
                    {formatDate(getAppointmentDate(apt))}
                  </span>
                  <span className={styles.appointmentTime}>
                    <i className="fas fa-clock"></i>
                    {getAppointmentTime(apt)}
                  </span>
                  <span className={`${styles.status} ${getStatusClass(apt.status)}`}>
                    {getStatusText(apt.status)}
                  </span>
                </div>
                <div className={styles.appointmentBody}>
                  <div className={styles.appointmentInfo}>
                    <div className={styles.infoRow}>
                      <i className="fas fa-user-md"></i>
                      <strong>Врач:</strong> {getDoctorName(apt)}
                    </div>
                    {getServiceName(apt) && (
                      <div className={styles.infoRow}>
                        <i className="fas fa-stethoscope"></i>
                        <strong>Услуга:</strong> {getServiceName(apt)}
                      </div>
                    )}
                    {getComment(apt) && (
                      <div className={styles.infoRow}>
                        <i className="fas fa-comment"></i>
                        <strong>Комментарий:</strong> {getComment(apt)}
                      </div>
                    )}
                  </div>
                  {apt.status === 'pending' && (
                    <button 
                      className={styles.cancelBtn}
                      onClick={() => cancelAppointment(apt.id)}
                    >
                      <i className="fas fa-times-circle"></i> Отменить запись
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;