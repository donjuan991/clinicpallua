import React from 'react';
import styles from './Testimonials.module.css';

const Testimonials = () => {
    const testimonials = [
        {
        id: 1,
        name: 'Виктория Морозова',
        role: 'Пациентка после ринопластики',
        text: 'Профессор Паллуа - волшебник! После ринопластики нос стал идеальной формы, дыхание улучшилось. Результат естественный, гармоничный. Мечтала об этом 10 лет!',
        rating: 5,
        date: 'Неделю назад'
    },
    {
        id: 2,
        name: 'Александр Крылов',
        role: 'Пациент после коррекции гинекомастии',
        text: 'Долгое время комплексовал из-за формы груди. Профессор провел коррекцию гинекомастии - результат превосходный! Теперь могу спокойно ходить на пляж и в спортзал.',
        rating: 5,
        date: '2 недели назад'
    },
    {
        id: 3,
        name: 'Анна Ковалева',
        role: 'Пациентка после подтяжки лица',
        text: 'SMAS-подтяжка лица у профессора Паллуа - лучшее решение в моей жизни! Выгляжу на 15 лет моложе, но без "кукольного" эффекта. Все знакомые спрашивают секрет омоложения.',
        rating: 5,
        date: '3 недели назад'
    },
    {
        id: 4,
        name: 'Дмитрий Орлов',
        role: 'Пациент после липосакции',
        text: 'Не помогали ни диеты, ни спортзал. Профессор Паллуа выполнил лазерную липосакцию живота и боков - теперь идеальный рельеф! Восстановление прошло легко и быстро.',
        rating: 5,
        date: 'Месяц назад'
    },
    {
        id: 5,
        name: 'Екатерина Волкова',
        role: 'Пациентка после маммопластики',
        text: 'После родов грудь потеряла форму. Профессор провел маммопластику с установкой имплантов - теперь идеальная грудь моей мечты! Качество соответствует европейскому стандарту ФЕБОПРАС.',
        rating: 5,
        date: '5 дней назад'
    },
    {
        id: 6,
        name: 'Ирина Семенова',
        role: 'Пациентка после блефаропластики',
        text: 'Веки нависали, выглядела уставшей даже после отдыха. После блефаропластики у профессора Паллуа глаза снова молодые и выразительные! Операция изменила всю мою жизнь.',
        rating: 5,
        date: '10 дней назад'
    },
    {
        id: 7,
        name: 'Максим Петров',
        role: 'Пациент после абдоминопластики',
        text: 'После резкого похудения остался избыток кожи на животе. Профессор выполнил абдоминопластику - теперь плоский живот и тонкая талия! Профессионализм высшего уровня.',
        rating: 5,
        date: '2 недели назад'
    },
    {
        id: 8,
        name: 'Ольга Романова',
        role: 'Пациентка после реконструкции груди',
        text: 'Обратилась для исправления последствий неудачной операции в другой клинике. Профессор Паллуа вернул груди естественную красоту! Настоящий мастер реконструктивной хирургии.',
        rating: 5,
        date: '3 недели назад'
    },
    {
        id: 9,
        name: 'Сергей Кузнецов',
        role: 'Пациент после омоложения',
        text: 'Комплексная программа омоложения: липофилинг лица и шеи. Результат - свежее, отдохнувшее лицо без морщин. Друзья спрашивают, где я отдыхал. Спасибо профессору!',
        rating: 5,
        date: '4 дня назад'
    },
    ];

    return (
        <section className={styles.testimonials}>
            <div className="container">
                {/* Заголовок секции */}
                <div className="section-header">
                    <h2 className="section-title">Рекомендации</h2>
                    <p className="section-subtitle">
                        Наши пациенты делятся своими историями выздоровления
                    </p>
                </div>

                {/* Карточки отзывов */}
                <div className={styles.testimonialsGrid}>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className={styles.testimonialCard}>
                            <div className={styles.testimonialHeader}>
                                <div className={styles.avatar}>
                                    <span>{testimonial.name.charAt(0)}</span>
                                </div>
                                
                                <div className={styles.testimonialInfo}>
                                    <h3 className={styles.testimonialName}>{testimonial.name}</h3>
                                    <p className={styles.testimonialRole}>{testimonial.role}</p>
                                    
                                    <div className={styles.rating}>
                                        {[...Array(5)].map((_, i) => (
                                            <i 
                                                key={i} 
                                                className={`fas fa-star ${i < testimonial.rating ? styles.starActive : styles.starInactive}`}
                                            ></i>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className={styles.testimonialDate}>
                                    <i className="far fa-clock"></i>
                                    {testimonial.date}
                                </div>
                            </div>
                            
                            <div className={styles.testimonialText}>
                                <p>"{testimonial.text}"</p>
                            </div>
                            
                            <div className={styles.testimonialFooter}>
                                <button className={styles.likeBtn}>
                                    <i className="far fa-thumbs-up"></i>
                                    24
                                </button>
                                <button className={styles.commentBtn}>
                                    <i className="far fa-comment"></i>
                                    Ответить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Статистика доверия */}
                <div className={styles.trustStats}>
                    <div className={styles.trustItem}>
                        <div className={styles.trustNumber}>95%</div>
                        <div className={styles.trustLabel}>Пациентов рекомендуют нас</div>
                    </div>
                    <div className={styles.trustItem}>
                        <div className={styles.trustNumber}>4.8</div>
                        <div className={styles.trustLabel}>Средняя оценка клиники</div>
                    </div>
                    <div className={styles.trustItem}>
                        <div className={styles.trustNumber}>1000+</div>
                        <div className={styles.trustLabel}>Положительных отзывов</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;