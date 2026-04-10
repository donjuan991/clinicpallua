"use client";

import React, { useState } from 'react';
import styles from './PricesModal.module.css';

interface Service {
    id: string;
    name: string;
    price: string;
    duration: string;
    popular?: boolean;
    includes?: string[];
    note?: string;
}

interface PriceCategory {
    id: string;
    name: string;
    services: Service[];
}

interface PricesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PricesModal: React.FC<PricesModalProps> = ({ isOpen, onClose }) => {
    const [activeCategory, setActiveCategory] = useState('face-surgery'); 
    const [selectedService, setSelectedService] = useState<string | null>(null);

    const priceCategories: PriceCategory[] = [
        {
            id: 'face-surgery',
            name: 'Хирургия лица',
            services: [
                { 
                    id: '1', 
                    name: 'Консультация профессора Паллуа', 
                    price: '5 000 ₽', 
                    duration: '60 мин', 
                    popular: true,
                },
                { 
                    id: '2', 
                    name: 'Ринопластика (коррекция носа)', 
                    price: 'от 150 000 ₽', 
                    duration: '2-3 часа',
                    note: 'Сложность определяет стоимость'
                },
                { 
                    id: '3', 
                    name: 'Блефаропластика (веки)', 
                    price: 'от 80 000 ₽', 
                    duration: '1-2 часа',
                    popular: true
                },
                { 
                    id: '4', 
                    name: 'SMAS-подтяжка лица', 
                    price: 'от 250 000 ₽', 
                    duration: '3-4 часа'
                },
                { 
                    id: '5', 
                    name: 'Липофилинг лица', 
                    price: 'от 120 000 ₽', 
                    duration: '2 часа'
                }
            ]
        },
        {
            id: 'body-surgery',
            name: 'Хирургия тела',
            services: [
                { 
                    id: '6', 
                    name: 'Липосакция (одна зона)', 
                    price: 'от 80 000 ₽', 
                    duration: '2-3 часа',
                    popular: true
                },
                { 
                    id: '7', 
                    name: 'Абдоминопластика (живот)', 
                    price: 'от 180 000 ₽', 
                    duration: '3-4 часа'
                },
                { 
                    id: '8', 
                    name: 'Брахиопластика (руки)', 
                    price: 'от 120 000 ₽', 
                    duration: '2 часа'
                },
                { 
                    id: '9', 
                    name: 'Подтяжка бедер', 
                    price: 'от 150 000 ₽', 
                    duration: '3 часа'
                },
                { 
                    id: '10', 
                    name: 'Глютеопластика (ягодицы)', 
                    price: 'от 200 000 ₽', 
                    duration: '3-4 часа',
                    popular: true
                }
            ]
        },
        {
            id: 'breast-surgery',
            name: 'Хирургия груди',
            services: [
                { 
                    id: '11', 
                    name: 'Увеличение груди (импланты)', 
                    price: 'от 220 000 ₽', 
                    duration: '2-3 часа',
                    popular: true
                },
                { 
                    id: '12', 
                    name: 'Подтяжка груди', 
                    price: 'от 180 000 ₽', 
                    duration: '2-3 часа'
                },
                { 
                    id: '13', 
                    name: 'Уменьшение груди', 
                    price: 'от 200 000 ₽', 
                    duration: '3-4 часа'
                },
                { 
                    id: '14', 
                    name: 'Липофилинг груди (собственный жир)', 
                    price: 'от 150 000 ₽', 
                    duration: '2 часа'
                },
                { 
                    id: '15', 
                    name: 'Коррекция асимметрии', 
                    price: 'от 170 000 ₽', 
                    duration: '2-3 часа'
                }
            ]
        },
        {
            id: 'male-surgery',
            name: 'Мужская пластика',
            services: [
                { 
                    id: '16', 
                    name: 'Коррекция гинекомастии', 
                    price: 'от 140 000 ₽', 
                    duration: '2 часа',
                    popular: true
                },
                { 
                    id: '17', 
                    name: 'Липосакция живота у мужчин', 
                    price: 'от 90 000 ₽', 
                    duration: '2-3 часа'
                },
                { 
                    id: '18', 
                    name: 'Удаление избытка кожи после похудения', 
                    price: 'от 160 000 ₽', 
                    duration: '3 часа'
                },
                { 
                    id: '19', 
                    name: 'Коррекция контуров тела', 
                    price: 'от 120 000 ₽', 
                    duration: '2-3 часа'
                }
            ]
        },
        {
            id: 'non-surgical',
            name: 'Безоперационные процедуры',
            services: [
                { 
                    id: '20', 
                    name: 'Консультация косметолога', 
                    price: '3 000 ₽', 
                    duration: '40 мин',
                    popular: true
                },
                { 
                    id: '21', 
                    name: 'Ботулинотерапия (одна зона)', 
                    price: 'от 8 000 ₽', 
                    duration: '20 мин'
                },
                { 
                    id: '22', 
                    name: 'Контурная пластика (1 мл)', 
                    price: 'от 15 000 ₽', 
                    duration: '30 мин'
                },
                { 
                    id: '23', 
                    name: 'PRP-терапия (омоложение)', 
                    price: 'от 12 000 ₽', 
                    duration: '40 мин',
                    popular: true
                },
                { 
                    id: '24', 
                    name: 'Лазерное омоложение', 
                    price: 'от 10 000 ₽', 
                    duration: '30 мин'
                }
            ]
        },
        {
            id: 'reconstruction',
            name: 'Реконструктивная хирургия',
            services: [
                { 
                    id: '25', 
                    name: 'Коррекция рубцов', 
                    price: 'от 50 000 ₽', 
                    duration: '1-2 часа'
                },
                { 
                    id: '26', 
                    name: 'Удаление старых имплантов', 
                    price: 'от 100 000 ₽', 
                    duration: '2-3 часа'
                },
                { 
                    id: '27', 
                    name: 'Реконструкция после неудачных операций', 
                    price: 'индивидуально', 
                    duration: 'зависит от сложности',
                    note: 'Требуется очная консультация'
                },
                { 
                    id: '28', 
                    name: 'Второе мнение', 
                    price: '8 000 ₽', 
                    duration: '60 мин',
                    popular: true
                }
            ]
        }
    ];

    const handleAppointment = (serviceName: string) => {
        alert(`Вы выбрали услугу: ${serviceName}\nДля записи нажмите "Записаться на прием"`);
        onClose();
    };

    // Функция для получения иконки по категории
    const getCategoryIcon = (categoryId: string) => {
        switch(categoryId) {
            case 'face-surgery':
                return 'fa-face-smile';
            case 'body-surgery':
                return 'fa-user';
            case 'breast-surgery':
                return 'fa-heart';
            case 'male-surgery':
                return 'fa-person';
            case 'non-surgical':
                return 'fa-syringe';
            case 'reconstruction':
                return 'fa-user-md';
            default:
                return 'fa-tag';
        }
    };

    if (!isOpen) return null;

    const activeCategoryData = priceCategories.find(c => c.id === activeCategory);

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <i className="fas fa-tag"></i>
                        Прайс-лист клиники Паллуа
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className={styles.pricesContent}>
                    {/* Категории */}
                    <div className={styles.categories}>
                        {priceCategories.map(category => (
                            <button
                                key={category.id}
                                className={`${styles.categoryBtn} ${activeCategory === category.id ? styles.active : ''}`}
                                onClick={() => setActiveCategory(category.id)}
                            >
                                <i className={`fas ${getCategoryIcon(category.id)}`}></i>
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Услуги */}
                    <div className={styles.servicesList}>
                        <h3 className={styles.servicesTitle}>
                            {activeCategoryData?.name}
                        </h3>
                        
                        {activeCategoryData?.services.map(service => (
                            <div 
                                key={service.id} 
                                className={`${styles.serviceItem} ${service.popular ? styles.popular : ''}`}
                                onClick={() => setSelectedService(service.id)}
                            >
                                <div className={styles.serviceInfo}>
                                    <div className={styles.serviceHeader}>
                                        <h4 className={styles.serviceName}>{service.name}</h4>
                                        {service.popular && (
                                            <span className={styles.popularBadge}>
                                                <i className="fas fa-star"></i>
                                                Популярная
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className={styles.serviceMeta}>
                                        <span className={styles.serviceDuration}>
                                            <i className="far fa-clock"></i>
                                            {service.duration}
                                        </span>
                                        
                                        {service.includes && service.includes.length > 0 && (
                                            <div className={styles.includesList}>
                                                <span className={styles.includesLabel}>Включает:</span>
                                                <div className={styles.includesItems}>
                                                    {service.includes.map((item, index) => (
                                                        <span key={index} className={styles.includesItem}>
                                                            <i className="fas fa-check-circle"></i>
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        

                                        {service.note && (
                                            <div className={styles.serviceNote}>
                                                <i className="fas fa-info-circle"></i>
                                                {service.note}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className={styles.servicePrice}>
                                    <div className={styles.priceValue}>{service.price}</div>
                                    <button 
                                        className={styles.priceButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAppointment(service.name);
                                        }}
                                    >
                                        <i className="fas fa-calendar-alt"></i>
                                        Записаться
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Дополнительная информация */}
                    <div className={styles.priceInfo}>
                        <div className={styles.infoCard}>
                            <i className="fas fa-percentage"></i>
                            <div className={styles.infoContent}>
                                <h4>Рассрочка и кредит</h4>
                                <p>Рассрочка 0% на 12 месяцев</p>
                                <p>Оплата частями</p>
                            </div>
                        </div>
                        
                        <div className={styles.infoCard}>
                            <i className="fas fa-gem"></i>
                            <div className={styles.infoContent}>
                                <h4>VIP-услуги</h4>
                                <p>Комплексные программы</p>
                                <p>Гостиница для иногородних</p>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <i className="fas fa-user-shield"></i>
                            <div className={styles.infoContent}>
                                <h4>Сертификация</h4>
                                <p>Все операции по ФЕБОПРАС</p>
                                <p>Европейские стандарты</p>
                            </div>
                        </div>
                    </div>

                    {/* Примечание */}
                    <div className={styles.priceNote}>
                        <p>
                            <i className="fas fa-info-circle"></i>
                            Точная стоимость определяется после очной консультации с профессором Паллуа. 
                            Цены указаны для первичных операций.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricesModal;