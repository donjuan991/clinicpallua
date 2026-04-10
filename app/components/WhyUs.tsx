import React from 'react';
import styles from './WhyUs.module.css';

const WhyUs = () => {
    const advantages = [
    {
        id: 1,
        title: 'Международный уровень',
        description: 'Работа по европейским стандартам ФЕБОПРАС',
        icon: 'fas fa-globe-europe',
        details: [
            'Сертифицированные европейские хирурги',
            'Международные протоколы лечения',
            'Обучение в ведущих клиниках Европы',
            'Членство в ISAPS'
        ]
    },
    {
        id: 2,
        title: '30+ лет опыта',
        description: 'Профессор Паллуа - основатель клиники с 1990-х годов',
        icon: 'fas fa-award',
        details: [
            'Более 10 000 успешных операций',
            'Эксперт по сложным случаям',
            'Автор научных методик',
            'Обучение молодых хирургов'
        ]
    },
    {
        id: 3,
        title: 'Индивидуальный подход',
        description: 'Каждая операция тщательно планируется под конкретного пациента',
        icon: 'fas fa-user-md',
        details: [
            '3D-моделирование результата',
            'Учет анатомических особенностей',
            'Персональный план реабилитации',
            'Пожизненное сопровождение'
        ]
    },
    {
        id: 4,
        title: 'Современные технологии',
        description: 'Используем передовое оборудование и методики',
        icon: 'fas fa-microscope',
        details: [
            'Лазерные технологии VASER',
            'Эндоскопические методики',
            '3D-визуализация результатов',
            'Микрохирургическое оборудование'
        ]
    },
    {
        id: 5,
        title: 'Естественные результаты',
        description: 'Сохранение индивидуальности и гармонии черт',
        icon: 'fas fa-heart',
        details: [
            'Отсутствие "кукольного" эффекта',
            'Гармоничные пропорции',
            'Незаметные швы',
            'Естественная мимика'
        ]
    },
    {
        id: 6,
        title: 'Комплексный подход',
        description: 'От консультации до полной реабилитации',
        icon: 'fas fa-clinic-medical',
        details: [
            'Предоперационная подготовка',
            'Современная операционная',
            'Стационар европейского уровня',
            'Реабилитация с косметологом'
        ]
    }
];

return (
    <section className={styles.whyUs}>
        <div className="container">
            {/* Заголовок секции */}
            <div className="section-header">
                <h2 className="section-title">Почему выбирают Клинику Паллуа</h2>
                <p className="section-subtitle">
                    На протяжении десятилетий мы сочетаем безупречную хирургическую технику, 
                    международный опыт и индивидуальный подход к каждому пациенту
                </p>
            </div>

            {/* Основные преимущества */}
            <div className={styles.advantagesGrid}>
                {advantages.map((advantage) => (
                    <div key={advantage.id} className={styles.advantageCard}>
                        <div className={styles.advantageIcon}>
                            <i className={advantage.icon}></i>
                        </div>
                        
                        <div className={styles.advantageContent}>
                            <h3 className={styles.advantageTitle}>{advantage.title}</h3>
                            <p className={styles.advantageDescription}>{advantage.description}</p>
                            
                            <ul className={styles.advantageDetails}>
                                {advantage.details.map((detail, index) => (
                                    <li key={index} className={styles.detailItem}>
                                        <i className="fas fa-check-circle"></i>
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className={styles.advantageDecor}></div>
                    </div>
                ))}
            </div>

            {/* Дополнительные факты */}
            <div className={styles.facts}>
                <div className={styles.fact}>
                    <div className={styles.factIcon}>
                        <i className="fas fa-shield-alt"></i>
                    </div>
                    <div className={styles.factContent}>
                        <h4>Безопасность и качество</h4>
                        <p>Сертификация ФЕБОПРАС гарантирует европейские стандарты безопасности всех процедур</p>
                    </div>
                </div>
                
                <div className={styles.fact}>
                    <div className={styles.factIcon}>
                        <i className="fas fa-comments"></i>
                    </div>
                    <div className={styles.factContent}>
                        <h4>Конфиденциальность</h4>
                        <p>Полная анонимность и конфиденциальность лечения. Мы ценим ваше доверие</p>
                    </div>
                </div>
                
                <div className={styles.fact}>
                    <div className={styles.factIcon}>
                        <i className="fas fa-star"></i>
                    </div>
                    <div className={styles.factContent}>
                        <h4>Экспертная оценка</h4>
                        <p>Более 10 000 довольных пациентов и сотни коллег по всему миру рекомендуют нас</p>
                    </div>
                </div>
            </div>

            {/* Дополнительный блок с цифрами */}
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <div className={styles.statNumber}>30+</div>
                    <div className={styles.statText}>лет опыта профессора Паллуа</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statNumber}>10,000+</div>
                    <div className={styles.statText}>успешных операций</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statNumber}>15+</div>
                    <div className={styles.statText}>стран, откуда к нам приезжают пациенты</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statNumber}>99%</div>
                    <div className={styles.statText}>пациентов рекомендуют нас друзьям</div>
                </div>
            </div>
        </div>
    </section>
);
};

export default WhyUs;