"use client";

import React from 'react';
import styles from './DoctorDetailsModal.module.css';

interface DoctorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointment: () => void;
  doctor: {
    name: string;
    position: string;
    experience: string;
    education: string;
    specialty: string[];
    imageColor: string;
    rating: number;
    certifications: string[];
  } | null;
}

const DoctorDetailsModal: React.FC<DoctorDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  onAppointment,
  doctor 
}) => {
  if (!isOpen || !doctor) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <i className="fas fa-user-md"></i>
            <span>{doctor.name}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.doctorHeader}>
            <div 
              className={styles.doctorAvatar}
              style={{ backgroundColor: doctor.imageColor }}
            >
              <i className="fas fa-user-md"></i>
            </div>
            <div className={styles.doctorInfo}>
              <h3>{doctor.name}</h3>
              <p className={styles.doctorPosition}>{doctor.position}</p>
              <div className={styles.rating}>
                <i className="fas fa-star"></i>
                <span>{doctor.rating}</span>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h4><i className="fas fa-briefcase"></i> Опыт работы</h4>
            <p>{doctor.experience}</p>
          </div>

          <div className={styles.infoSection}>
            <h4><i className="fas fa-graduation-cap"></i> Образование</h4>
            <p>{doctor.education}</p>
          </div>

          <div className={styles.infoSection}>
            <h4><i className="fas fa-stethoscope"></i> Специализация</h4>
            <ul className={styles.specialtyList}>
              {doctor.specialty.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>

          <div className={styles.infoSection}>
            <h4><i className="fas fa-certificate"></i> Сертификаты</h4>
            <div className={styles.certifications}>
              {doctor.certifications.map((cert, index) => (
                <span key={index} className={styles.certBadge}>{cert}</span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
            Закрыть
          </button>
          <button className={styles.appointmentBtn} onClick={onAppointment}>
            <i className="fas fa-calendar-alt"></i>
            Записаться
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsModal;