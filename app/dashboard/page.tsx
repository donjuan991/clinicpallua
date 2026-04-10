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
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
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
        fetchAppointments(); // Обновляем список
      } else {
        alert('Ошибка при отмене записи');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Ошибка при отмене записи');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения';
      case 'confirmed': return 'Подтверждена';
      case 'cancelled': return 'Отменена';
      case 'completed': return 'Завершена';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'confirmed': return styles.statusConfirmed;
      case 'cancelled': return styles.statusCancelled;
      case 'completed': return styles.statusCompleted;
      default: return '';
    }
  };

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
            <p>{user.email}</p>
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
              Записаться на прием
            </button>
          </div>
        ) : (
          <div className={styles.appointmentsList}>
            {appointments.map((apt) => (
              <div key={apt.id} className={styles.appointmentCard}>
                <div className={styles.appointmentHeader}>
                  <span className={styles.appointmentDate}>
                    <i className="fas fa-calendar"></i>
                    {new Date(apt.appointmentDate).toLocaleDateString('ru-RU')}
                  </span>
                  <span className={styles.appointmentTime}>
                    <i className="fas fa-clock"></i>
                    {apt.appointmentTime}
                  </span>
                  <span className={`${styles.status} ${getStatusClass(apt.status)}`}>
                    {getStatusText(apt.status)}
                  </span>
                </div>
                <div className={styles.appointmentBody}>
                  <div className={styles.appointmentInfo}>
                    <div className={styles.infoRow}>
                      <i className="fas fa-user-md"></i>
                      <strong>Врач:</strong> {apt.doctor_name}
                    </div>
                    {apt.service_name && (
                      <div className={styles.infoRow}>
                        <i className="fas fa-stethoscope"></i>
                        <strong>Услуга:</strong> {apt.service_name}
                      </div>
                    )}
                    {apt.comment && (
                      <div className={styles.infoRow}>
                        <i className="fas fa-comment"></i>
                        <strong>Комментарий:</strong> {apt.comment}
                      </div>
                    )}
                  </div>
                  {apt.status === 'pending' && (
                    <button 
                      className={styles.cancelBtn}
                      onClick={() => cancelAppointment(apt.id)}
                    >
                      Отменить запись
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