// app/admin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  description: string;
  experience: number;
  rating: number;
  is_active: boolean;
  order_index: number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  is_active: boolean;
  order_index: number;
}

interface Appointment {
  id: number;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  doctor_name: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  comment: string;
  user_name: string | null;
}

type TabType = 'appointments' | 'doctors' | 'services' | 'schedule';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });

  const [filters, setFilters] = useState({
    status: '',
    doctorId: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, filters]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'appointments') {
        await fetchAppointments();
      } else if (activeTab === 'doctors') {
        await fetchDoctors();
      } else if (activeTab === 'services') {
        await fetchServices();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    const res = await fetch(`/api/admin/appointments?${params}`);
    const data = await res.json();
    if (data.appointments) {
      setAppointments(data.appointments);
      const total = data.appointments.length;
      const pending = data.appointments.filter((a: any) => a.status === 'pending').length;
      const confirmed = data.appointments.filter((a: any) => a.status === 'confirmed').length;
      const completed = data.appointments.filter((a: any) => a.status === 'completed').length;
      const cancelled = data.appointments.filter((a: any) => a.status === 'cancelled').length;
      setStats({ totalAppointments: total, pendingAppointments: pending, confirmedAppointments: confirmed, completedAppointments: completed, cancelledAppointments: cancelled });
    }
  };

  const fetchDoctors = async () => {
    const res = await fetch('/api/admin/doctors');
    const data = await res.json();
    if (data.doctors) setDoctors(data.doctors);
  };

  const fetchServices = async () => {
    const res = await fetch('/api/admin/services');
    const data = await res.json();
    if (data.services) setServices(data.services);
  };

  // ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ВРАЧАМИ ==========
  
  const handleAddDoctor = async () => {
    const name = prompt('Введите ФИО врача:');
    if (!name) return;
    
    const specialization = prompt('Введите специализацию:');
    if (!specialization) return;
    
    const description = prompt('Введите описание (необязательно):') || '';
    const experience = parseInt(prompt('Введите опыт работы (лет):') || '0');
    
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          specialization, 
          description, 
          experience,
          rating: 0,
          isActive: true,
          orderIndex: doctors.length + 1
        })
      });
      
      if (res.ok) {
        alert('Врач успешно добавлен!');
        fetchDoctors();
      } else {
        const error = await res.json();
        alert('Ошибка: ' + (error.error || 'Не удалось добавить врача'));
      }
    } catch (error) {
      alert('Ошибка при добавлении врача');
    }
  };

  const handleEditDoctor = async (doctor: Doctor) => {
    const newName = prompt('Новое ФИО:', doctor.name);
    if (!newName) return;
    
    const newSpecialization = prompt('Новая специализация:', doctor.specialization);
    if (!newSpecialization) return;
    
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: doctor.id,
          name: newName,
          specialization: newSpecialization,
          description: doctor.description,
          experience: doctor.experience,
          rating: doctor.rating,
          isActive: doctor.is_active,
          orderIndex: doctor.order_index
        })
      });
      
      if (res.ok) {
        alert('Данные врача обновлены!');
        fetchDoctors();
      } else {
        alert('Ошибка при обновлении');
      }
    } catch (error) {
      alert('Ошибка при обновлении');
    }
  };

  const handleDeleteDoctor = async (id: number, name: string) => {
    if (!confirm(`Удалить врача "${name}"?`)) return;
    
    try {
      const res = await fetch(`/api/admin/doctors?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        alert('Врач удален!');
        fetchDoctors();
      } else {
        alert('Ошибка при удалении');
      }
    } catch (error) {
      alert('Ошибка при удалении');
    }
  };

  // ========== ФУНКЦИИ ДЛЯ РАБОТЫ С УСЛУГАМИ ==========

  const handleAddService = async () => {
    const name = prompt('Введите название услуги:');
    if (!name) return;
    
    const price = parseInt(prompt('Введите цену (в рублях):') || '0');
    const category = prompt('Введите категорию (consultation/face-surgery/body-surgery/breast-surgery/non-surgical):') || 'consultation';
    const duration = parseInt(prompt('Введите длительность (в минутах):') || '60');
    const description = prompt('Введите описание (необязательно):') || '';
    
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price,
          duration,
          category,
          isActive: true,
          orderIndex: services.length + 1
        })
      });
      
      if (res.ok) {
        alert('Услуга успешно добавлена!');
        fetchServices();
      } else {
        const error = await res.json();
        alert('Ошибка: ' + (error.error || 'Не удалось добавить услугу'));
      }
    } catch (error) {
      alert('Ошибка при добавлении услуги');
    }
  };

  const handleEditService = async (service: Service) => {
    const newName = prompt('Новое название:', service.name);
    if (!newName) return;
    
    const newPrice = parseInt(prompt('Новая цена:', String(service.price)) || '0');
    
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          name: newName,
          description: service.description,
          price: newPrice,
          duration: service.duration,
          category: service.category,
          isActive: service.is_active,
          orderIndex: service.order_index
        })
      });
      
      if (res.ok) {
        alert('Услуга обновлена!');
        fetchServices();
      } else {
        alert('Ошибка при обновлении');
      }
    } catch (error) {
      alert('Ошибка при обновлении');
    }
  };

  const handleDeleteService = async (id: number, name: string) => {
    if (!confirm(`Удалить услугу "${name}"?`)) return;
    
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        alert('Услуга удалена!');
        fetchServices();
      } else {
        alert('Ошибка при удалении');
      }
    } catch (error) {
      alert('Ошибка при удалении');
    }
  };

  const updateAppointmentStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: id, status }),
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const deleteAppointment = async (id: number) => {
    if (!confirm('Удалить запись?')) return;
    try {
      const res = await fetch(`/api/admin/appointments?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Админ-панель</h1>
        <p>Управление клиникой</p>
      </div>

      {/* Статистика */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.totalAppointments}</div>
            <div className={styles.statLabel}>Всего записей</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
            <i className="fas fa-clock" style={{ color: '#ffc107' }}></i>
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.pendingAppointments}</div>
            <div className={styles.statLabel}>Ожидают</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
            <i className="fas fa-check-circle" style={{ color: '#28a745' }}></i>
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.confirmedAppointments}</div>
            <div className={styles.statLabel}>Подтверждены</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(23, 162, 184, 0.1)' }}>
            <i className="fas fa-check-double" style={{ color: '#17a2b8' }}></i>
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.completedAppointments}</div>
            <div className={styles.statLabel}>Завершены</div>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'appointments' ? styles.active : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <i className="fas fa-calendar-check"></i>
          Записи
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'doctors' ? styles.active : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          <i className="fas fa-user-md"></i>
          Врачи
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'services' ? styles.active : ''}`}
          onClick={() => setActiveTab('services')}
        >
          <i className="fas fa-stethoscope"></i>
          Услуги
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'schedule' ? styles.active : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <i className="fas fa-calendar-week"></i>
          Расписание
        </button>
      </div>

      {/* Контент */}
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>
            <i className="fas fa-spinner fa-spin"></i>
            Загрузка...
          </div>
        ) : (
          <>
            {/* Записи */}
            {activeTab === 'appointments' && (
              <div>
                <div className={styles.filters}>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className={styles.filterSelect}
                  >
                    <option value="">Все статусы</option>
                    <option value="pending">Ожидает</option>
                    <option value="confirmed">Подтверждена</option>
                    <option value="completed">Завершена</option>
                    <option value="cancelled">Отменена</option>
                  </select>
                  <select
                    value={filters.doctorId}
                    onChange={(e) => setFilters({ ...filters, doctorId: e.target.value })}
                    className={styles.filterSelect}
                  >
                    <option value="">Все врачи</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className={styles.filterInput}
                    placeholder="Дата от"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className={styles.filterInput}
                    placeholder="Дата до"
                  />
                  <button
                    className={styles.resetBtn}
                    onClick={() => setFilters({ status: '', doctorId: '', dateFrom: '', dateTo: '' })}
                  >
                    <i className="fas fa-undo"></i>
                    Сбросить
                  </button>
                </div>

                <div className={styles.appointmentsTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Дата</th>
                        <th>Время</th>
                        <th>Пациент</th>
                        <th>Врач</th>
                        <th>Услуга</th>
                        <th>Статус</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map(apt => (
                        <tr key={apt.id}>
                          <td>{new Date(apt.appointment_date).toLocaleDateString('ru-RU')}</td>
                          <td>{apt.appointment_time}</td>
                          <td>
                            <strong>{apt.patient_name}</strong>
                            <br />
                            <small>{apt.patient_phone}</small>
                          </td>
                          <td>{apt.doctor_name}</td>
                          <td>{apt.service_name || '—'}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${getStatusClass(apt.status)}`}>
                              {getStatusText(apt.status)}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              {apt.status === 'pending' && (
                                <button
                                  className={styles.confirmBtn}
                                  onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                  title="Подтвердить"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              )}
                              {apt.status === 'confirmed' && (
                                <button
                                  className={styles.completeBtn}
                                  onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                  title="Завершить"
                                >
                                  <i className="fas fa-check-double"></i>
                                </button>
                              )}
                              {apt.status === 'pending' && (
                                <button
                                  className={styles.cancelBtn}
                                  onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                  title="Отменить"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                              <button
                                className={styles.deleteBtn}
                                onClick={() => deleteAppointment(apt.id)}
                                title="Удалить"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {appointments.length === 0 && (
                    <div className={styles.emptyState}>
                      <i className="fas fa-calendar-alt"></i>
                      <p>Нет записей</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Врачи */}
            {activeTab === 'doctors' && (
              <div className={styles.doctorsList}>
                <button className={styles.addBtn} onClick={handleAddDoctor}>
                  <i className="fas fa-plus"></i>
                  Добавить врача
                </button>
                <div className={styles.doctorsGrid}>
                  {doctors.map(doctor => (
                    <div key={doctor.id} className={styles.doctorCard}>
                      <div className={styles.doctorHeader}>
                        <div className={styles.doctorAvatar}>
                          <i className="fas fa-user-md"></i>
                        </div>
                        <div className={styles.doctorInfo}>
                          <h3>{doctor.name}</h3>
                          <p>{doctor.specialization}</p>
                        </div>
                        <span className={doctor.is_active ? styles.activeBadge : styles.inactiveBadge}>
                          {doctor.is_active ? 'Активен' : 'Неактивен'}
                        </span>
                      </div>
                      <div className={styles.doctorBody}>
                        <div className={styles.infoRow}>
                          <i className="fas fa-briefcase"></i>
                          <span>Опыт: {doctor.experience} лет</span>
                        </div>
                        <div className={styles.infoRow}>
                          <i className="fas fa-star"></i>
                          <span>Рейтинг: {doctor.rating}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <i className="fas fa-align-left"></i>
                          <span>{doctor.description}</span>
                        </div>
                      </div>
                      <div className={styles.doctorActions}>
                        <button className={styles.editBtn} onClick={() => handleEditDoctor(doctor)}>
                          <i className="fas fa-edit"></i>
                          Редактировать
                        </button>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteDoctor(doctor.id, doctor.name)}>
                          <i className="fas fa-trash"></i>
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Услуги */}
            {activeTab === 'services' && (
              <div className={styles.servicesList}>
                <button className={styles.addBtn} onClick={handleAddService}>
                  <i className="fas fa-plus"></i>
                  Добавить услугу
                </button>
                <div className={styles.servicesTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Название</th>
                        <th>Категория</th>
                        <th>Цена</th>
                        <th>Длительность</th>
                        <th>Статус</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map(service => (
                        <tr key={service.id}>
                          <td><strong>{service.name}</strong><br /><small>{service.description}</small></td>
                          <td>{service.category}</td>
                          <td>{service.price ? `${service.price.toLocaleString()} ₽` : '—'}</td>
                          <td>{service.duration ? `${service.duration} мин` : '—'}</td>
                          <td>
                            <span className={service.is_active ? styles.activeBadge : styles.inactiveBadge}>
                              {service.is_active ? 'Активна' : 'Неактивна'}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              <button className={styles.editBtn} onClick={() => handleEditService(service)}>
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className={styles.deleteBtn} onClick={() => handleDeleteService(service.id, service.name)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Расписание */}
            {activeTab === 'schedule' && (
              <div className={styles.scheduleSection}>
                <div className={styles.scheduleHeader}>
                  <h3>Настройка расписания врачей</h3>
                  <select className={styles.doctorSelect}>
                    <option value="">Выберите врача</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.scheduleGrid}>
                  {['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'].map((day, index) => (
                    <div key={index} className={styles.scheduleDayCard}>
                      <div className={styles.dayHeader}>
                        <h4>{day}</h4>
                        <label className={styles.workingToggle}>
                          <input type="checkbox" defaultChecked={index < 5} />
                          <span>Рабочий день</span>
                        </label>
                      </div>
                      <div className={styles.timeInputs}>
                        <input type="time" defaultValue="09:00" className={styles.timeInput} disabled={index >= 5} />
                        <span>—</span>
                        <input type="time" defaultValue={index < 5 ? "18:00" : "09:00"} className={styles.timeInput} disabled={index >= 5} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.exceptionsSection}>
                  <h4>Исключения (отпуск, больничный)</h4>
                  <div className={styles.exceptionForm}>
                    <input type="date" className={styles.dateInput} />
                    <select className={styles.exceptionType}>
                      <option value="vacation">Отпуск</option>
                      <option value="sick">Больничный</option>
                      <option value="other">Другое</option>
                    </select>
                    <button className={styles.addExceptionBtn}>
                      <i className="fas fa-plus"></i>
                      Добавить
                    </button>
                  </div>
                  <div className={styles.exceptionsList}>
                    <div className={styles.exceptionItem}>
                      <span>15.03.2024 - 20.03.2024</span>
                      <span className={styles.exceptionType}>Отпуск</span>
                      <button className={styles.removeExceptionBtn}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <button className={styles.saveScheduleBtn}>
                  <i className="fas fa-save"></i>
                  Сохранить расписание
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;