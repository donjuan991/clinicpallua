"use client";

import React from 'react';
import styles from './Modals.module.css';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle}>
                        <i className="fas fa-shield-alt"></i>
                        Политика конфиденциальности
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className={styles.scrollContent}>
                    <div className={styles.modalBody}>
                        <div className={styles.infoBlock}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <h3>Защита ваших персональных данных</h3>
                            <p>Клиника пластической хирургии "Паулла" уделяет особое внимание защите конфиденциальности пациентов.</p>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-file-contract"></i> 1. Общие положения</h4>
                            <p>Настоящая Политика конфиденциальности регулирует порядок обработки и защиты персональных данных пациентов и посетителей сайта клиники "Паулла".</p>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-database"></i> 2. Собираемые данные</h4>
                            <ul className={styles.list}>
                                <li><i className="fas fa-user"></i> Фамилия, имя, отчество</li>
                                <li><i className="fas fa-phone"></i> Контактный телефон</li>
                                <li><i className="fas fa-envelope"></i> Адрес электронной почты</li>
                                <li><i className="fas fa-calendar-alt"></i> Дата рождения</li>
                                <li><i className="fas fa-notes-medical"></i> Медицинская информация (с согласия пациента)</li>
                                <li><i className="fas fa-history"></i> История обращений и консультаций</li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-lock"></i> 3. Цели обработки данных</h4>
                            <div className={styles.cardGrid}>
                                <div className={styles.card}>
                                    <div className={styles.cardIcon}>
                                        <i className="fas fa-stethoscope"></i>
                                    </div>
                                    <h5>Медицинские услуги</h5>
                                    <p>Оказание пластических и реконструктивных операций, ведение медицинской документации</p>
                                </div>
                                <div className={styles.card}>
                                    <div className={styles.cardIcon}>
                                        <i className="fas fa-calendar-check"></i>
                                    </div>
                                    <h5>Запись на прием</h5>
                                    <p>Организация консультаций, напоминания о визитах, перенос записей</p>
                                </div>
                                <div className={styles.card}>
                                    <div className={styles.cardIcon}>
                                        <i className="fas fa-comment-medical"></i>
                                    </div>
                                    <h5>Информирование</h5>
                                    <p>Отправка важной информации о подготовке к процедурам и реабилитации</p>
                                </div>
                                <div className={styles.card}>
                                    <div className={styles.cardIcon}>
                                        <i className="fas fa-chart-line"></i>
                                    </div>
                                    <h5>Улучшение сервиса</h5>
                                    <p>Анализ качества услуг и улучшение работы клиники</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-user-check"></i> 4. Согласие на обработку данных</h4>
                            <p>Обработка персональных данных осуществляется только с вашего согласия, которое вы даете при заполнении форм на сайте или в клинике.</p>
                            <div className={styles.alert}>
                                <i className="fas fa-exclamation-circle"></i>
                                Вы можете отозвать согласие на обработку персональных данных, написав заявление в клинике.
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-shield-virus"></i> 5. Защита данных</h4>
                            <p>Мы используем современные технологии защиты:</p>
                            <div className={styles.protectionGrid}>
                                <div className={styles.protectionItem}>
                                    <i className="fas fa-server"></i>
                                    <span>Защищенные серверы</span>
                                </div>
                                <div className={styles.protectionItem}>
                                    <i className="fas fa-key"></i>
                                    <span>Шифрование SSL</span>
                                </div>
                                <div className={styles.protectionItem}>
                                    <i className="fas fa-user-lock"></i>
                                    <span>Контроль доступа</span>
                                </div>
                                <div className={styles.protectionItem}>
                                    <i className="fas fa-history"></i>
                                    <span>Регулярное резервное копирование</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-handshake"></i> 6. Передача третьим лицам</h4>
                            <p>Мы не передаем ваши персональные данные третьим лицам, за исключением:</p>
                            <ul className={styles.list}>
                                <li>Медицинских учреждений по вашему запросу</li>
                                <li>Страховых компаний при оформлении страховки</li>
                                <li>Государственных органов по законным требованиям</li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-clock"></i> 7. Сроки хранения</h4>
                            <p>Персональные данные хранятся в течение срока, установленного законодательством РФ о медицинской деятельности, но не менее 5 лет после последнего обращения.</p>
                        </div>

                        <div className={styles.contactBlock}>
                            <h4><i className="fas fa-question-circle"></i> Вопросы и контакты</h4>
                            <p>По вопросам обработки персональных данных обращайтесь:</p>
                            <div className={styles.contactInfo}>
                                <p><i className="fas fa-user-tie"></i> Ответственный: Доктор Паулл</p>
                                <p><i className="fas fa-phone"></i> Телефон: +7 (3812) 20-91-42</p>
                                <p><i className="fas fa-envelope"></i> Email: dpo@pallua-clinic.com</p>
                                <p><i className="fas fa-map-marker-alt"></i> Адрес: Омск, ул. 70 лет октября 26</p>
                            </div>
                        </div>

                        <div className={styles.updateInfo}>
                            <p><i className="fas fa-sync-alt"></i> Последнее обновление: 01 января 2025 года</p>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.agreeButton} onClick={onClose}>
                        <i className="fas fa-check"></i>
                        Понятно
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyModal;