"use client";

import React from 'react';
import styles from './Modals.module.css';

interface OfferModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle}>
                        <i className="fas fa-file-contract"></i>
                        Договор публичной оферты
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className={styles.scrollContent}>
                    <div className={styles.modalBody}>
                        <div className={styles.infoBlock}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-handshake"></i>
                            </div>
                            <h3>Публичная оферта на оказание медицинских услуг</h3>
                            <p>Настоящий документ является официальным предложением Клиники "Паулла" заключить договор на оказание медицинских услуг.</p>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-gavel"></i> 1. Термины и определения</h4>
                            <div className={styles.definitions}>
                                <div className={styles.definitionItem}>
                                    <span className={styles.term}>Исполнитель:</span>
                                    <span className={styles.meaning}>Клиника пластической хирургии "Паулла", ОГРН 1234567890123</span>
                                </div>
                                <div className={styles.definitionItem}>
                                    <span className={styles.term}>Заказчик:</span>
                                    <span className={styles.meaning}>Физическое лицо, принявшее настоящую оферту</span>
                                </div>
                                <div className={styles.definitionItem}>
                                    <span className={styles.term}>Услуги:</span>
                                    <span className={styles.meaning}>Медицинские услуги, перечисленные в прайс-листе клиники</span>
                                </div>
                                <div className={styles.definitionItem}>
                                    <span className={styles.term}>Акцепт:</span>
                                    <span className={styles.meaning}>Оплата услуг или явка на прием</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-stethoscope"></i> 2. Предмет договора</h4>
                            <p>Исполнитель обязуется оказать Заказчику медицинские услуги, а Заказчик обязуется оплатить эти услуги.</p>
                            
                            <div className={styles.servicesList}>
                                <div className={styles.serviceCategory}>
                                    <h5><i className="fas fa-face-smile"></i> Пластическая хирургия лица</h5>
                                    <ul>
                                        <li>Блефаропластика</li>
                                        <li>Ринопластика</li>
                                        <li>Подтяжка лица</li>
                                        <li>Отопластика</li>
                                    </ul>
                                </div>
                                <div className={styles.serviceCategory}>
                                    <h5><i className="fas fa-user"></i> Пластика тела</h5>
                                    <ul>
                                        <li>Абдоминопластика</li>
                                        <li>Липосакция</li>
                                        <li>Маммопластика</li>
                                        <li>Брахиопластика</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-money-check-alt"></i> 3. Стоимость и оплата</h4>
                            <div className={styles.pricingInfo}>
                                <div className={styles.priceCard}>
                                    <div className={styles.priceHeader}>
                                        <i className="fas fa-wallet"></i>
                                        <h5>Способы оплаты</h5>
                                    </div>
                                    <ul>
                                        <li>Наличными в кассе клиники</li>
                                        <li>Банковской картой</li>
                                        <li>Безналичный расчет</li>
                                        <li>В рассрочку</li>
                                    </ul>
                                </div>
                                <div className={styles.priceCard}>
                                    <div className={styles.priceHeader}>
                                        <i className="fas fa-percentage"></i>
                                        <h5>Дополнительно</h5>
                                    </div>
                                    <ul>
                                        <li>Предоплата: 30% от стоимости</li>
                                        <li>Полный расчет: до операции</li>
                                        <li>Возврат: по медицинским показаниям</li>
                                        <li>НДС не облагается</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-calendar-alt"></i> 4. Порядок оказания услуг</h4>
                            <div className={styles.steps}>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>1</div>
                                    <div className={styles.stepContent}>
                                        <h6>Первичная консультация</h6>
                                        <p>Осмотр, сбор анамнеза, определение показаний</p>
                                    </div>
                                </div>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>2</div>
                                    <div className={styles.stepContent}>
                                        <h6>Обследование</h6>
                                        <p>Лабораторные анализы, инструментальные исследования</p>
                                    </div>
                                </div>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>3</div>
                                    <div className={styles.stepContent}>
                                        <h6>Планирование операции</h6>
                                        <p>Составление плана лечения, выбор методики</p>
                                    </div>
                                </div>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>4</div>
                                    <div className={styles.stepContent}>
                                        <h6>Оказание услуг</h6>
                                        <p>Проведение процедуры в условиях операционной</p>
                                    </div>
                                </div>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>5</div>
                                    <div className={styles.stepContent}>
                                        <h6>Реабилитация</h6>
                                        <p>Послеоперационное наблюдение, рекомендации</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-ban"></i> 5. Обязательства сторон</h4>
                            <div className={styles.obligations}>
                                <div className={styles.obligationCard}>
                                    <h5><i className="fas fa-user-md"></i> Обязанности Исполнителя</h5>
                                    <ul>
                                        <li>Оказать услуги в соответствии со стандартами</li>
                                        <li>Обеспечить квалифицированный персонал</li>
                                        <li>Предоставить необходимое оборудование</li>
                                        <li>Обеспечить безопасность пациента</li>
                                    </ul>
                                </div>
                                <div className={styles.obligationCard}>
                                    <h5><i className="fas fa-user"></i> Обязанности Заказчика</h5>
                                    <ul>
                                        <li>Предоставить достоверную информацию о здоровье</li>
                                        <li>Выполнять рекомендации врача</li>
                                        <li>Своевременно оплачивать услуги</li>
                                        <li>Являться на прием в назначенное время</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-exclamation-triangle"></i> 6. Ответственность</h4>
                            <div className={styles.warningCard}>
                                <i className="fas fa-exclamation-circle"></i>
                                <div>
                                    <h5>Важная информация</h5>
                                    <p>Клиника не несет ответственности за результаты, не соответствующие ожиданиям пациента, если они являются следствием индивидуальных особенностей организма.</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4><i className="fas fa-file-signature"></i> 7. Заключительные положения</h4>
                            <p>Договор вступает в силу с момента акцепта оферта и действует до полного исполнения обязательств.</p>
                            <p>Все споры решаются путем переговоров, при невозможности - в судебном порядке по месту нахождения Исполнителя.</p>
                        </div>

                        <div className={styles.signatureBlock}>
                            <h4><i className="fas fa-building"></i> Реквизиты Исполнителя</h4>
                            <div className={styles.requisites}>
                                <p><strong>Клиника пластической хирургии "Паулла"</strong></p>
                                <p>ОГРН: 1234567890123</p>
                                <p>ИНН: 1234567890</p>
                                <p>КПП: 123456789</p>
                                <p>Адрес: 644010, г. Омск, ул. 70 лет октября 26</p>
                                <p>Р/с: 40702810123456789012</p>
                                <p>Банк: ПАО "Сбербанк" г. Омск</p>
                                <p>БИК: 045209673</p>
                                <p>К/с: 30101810900000000673</p>
                            </div>
                        </div>

                        <div className={styles.legalInfo}>
                            <p><i className="fas fa-scale-balanced"></i> Настоящая оферта составлена в соответствии с Гражданским кодексом РФ, Федеральным законом "Об основах охраны здоровья граждан" и другими нормативными актами.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.printButton}>
                        <i className="fas fa-print"></i>
                        Распечатать
                    </button>
                    <button className={styles.agreeButton} onClick={onClose}>
                        <i className="fas fa-check"></i>
                        Принять условия
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfferModal;