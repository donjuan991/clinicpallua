"use client";

import React, { useState } from 'react';
import styles from './Reviews.module.css';
import ReviewModal from './ReviewModal';

const Reviews = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const reviews = [
    {
        id: 1,
        name: 'Елена Иванова',
        age: 38,
        treatment: 'Ринопластика и блефаропластика',
        text: 'Профессор Паллуа совершил чудо! После ринопластики и блефаропластики выгляжу на 10 лет моложе. Результат превзошел все ожидания - естественно и гармонично. Восстановление прошло быстро, персонал клиники очень внимательный.',
        rating: 5,
        date: '20.03.2024',
        avatarColor: '#9d4b7c'
    },
    {
        id: 2,
        name: 'Анна Козлова',
        age: 45,
        treatment: 'Подтяжка лица SMAS',
        text: 'После рождения детей лицо сильно изменилось. Профессор Паллуа выполнил SMAS-подтяжку - результат потрясающий! Лицо свежее, подтянутое, но без эффекта "натянутой маски". 30 лет опыта чувствуются в каждой детали.',
        rating: 5,
        date: '18.03.2024',
        avatarColor: '#771d55'
    },
    {
        id: 3,
        name: 'Ирина Петрова',
        age: 32,
        treatment: 'Коррекция груди после неудачной операции',
        text: 'Обратилась к профессору Паллуа для исправления последствий неудачной маммопластики в другой клинике. Доктор не только устранил все дефекты, но и вернул груди естественную красоту. Настоящий мастер своего дела!',
        rating: 5,
        date: '15.03.2024',
        avatarColor: '#b56a9d'
    },
    {
        id: 4,
        name: 'Сергей Волков',
        age: 41,
        treatment: 'Коррекция гинекомастии',
        text: 'Долгое время комплексовал из-за груди. Профессор Паллуа провел операцию по коррекции гинекомастии. Результат отличный - грудь стала мужской, плоской. Восстановился быстро, швы почти не заметны.',
        rating: 5,
        date: '12.03.2024',
        avatarColor: '#1979FF'
    },
    {
        id: 5,
        name: 'Мария Семенова',
        age: 50,
        treatment: 'Липофилинг лица и абдоминопластика',
        text: 'Комплексное омоложение: липофилинг для восстановления объема лица и абдоминопластика после родов. Профессор Паллуа - хирург от Бога! Результат естественный, выгляжу как в 35. Клиника соответствует европейским стандартам ФЕБОПРАС.',
        rating: 5,
        date: '10.03.2024',
        avatarColor: '#8a3a6a'
    },
    {
        id: 6,
        name: 'Дмитрий Ковалев',
        age: 48,
        treatment: 'Липосакция живота и боков',
        text: 'Не мог избавиться от "пивного живота" даже в спортзале. Профессор провел липосакцию - теперь плоский живот и рельефный торс. Операция прошла без осложнений, реабилитация комфортная. Рекомендую мужчинам!',
        rating: 5,
        date: '08.03.2024',
        avatarColor: '#00508B'
    },
    {
        id: 8,
        name: 'Юлия Казанцева',
        age: 52,
        treatment: 'Удаление имплантов и реконструкция груди',
        text: 'Импланты, установленные 15 лет назад, начали вызывать проблемы. Профессор Паллуа выполнил сложную реконструктивную операцию по удалению старых имплантов и коррекции тканей. Результат отличный, здоровье восстановлено.',
        rating: 5,
        date: '01.03.2024',
        avatarColor: '#4e1337'
    }
];

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % reviews.length);
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const handleReviewClick = () => {
        setIsReviewModalOpen(true);
    };

    return (
        <section id="reviews" className={styles.reviews}>
            <div className="container">
                {/* Заголовок секции */}
                <div className="section-header">
                    <h2 className="section-title">Отзывы пациентов</h2>
                    <p className="section-subtitle">
                        Что говорят наши пациенты о лечении в клинике. 
                        Мы ценим каждое мнение и постоянно работаем над улучшением качества услуг
                    </p>
                </div>

                {/* Слайдер отзывов */}
                <div className={styles.reviewsSlider}>
                    <button className={styles.sliderBtnPrev} onClick={prevSlide}>
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    
                    <div className={styles.sliderContainer}>
                        <div 
                            className={styles.sliderTrack}
                            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                        >
                            {reviews.map((review) => (
                                <div key={review.id} className={styles.reviewSlide}>
                                    <div className={styles.reviewCard}>
                                        {/* Верхняя часть отзыва */}
                                        <div className={styles.reviewHeader}>
                                            <div 
                                                className={styles.avatar}
                                                style={{ backgroundColor: review.avatarColor }}
                                            >
                                                <span>{review.name.charAt(0)}</span>
                                            </div>
                                            
                                            <div className={styles.reviewerInfo}>
                                                <h3 className={styles.reviewerName}>{review.name}</h3>
                                                <div className={styles.reviewerDetails}>
                                                    <span className={styles.reviewerAge}>{review.age} лет</span>
                                                    <span className={styles.reviewTreatment}>{review.treatment}</span>
                                                </div>
                                                
                                                <div className={styles.rating}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <i 
                                                            key={i} 
                                                            className={`fas fa-star ${i < review.rating ? styles.starActive : styles.starInactive}`}
                                                        ></i>
                                                    ))}
                                                    <span className={styles.ratingText}>{review.rating}.0</span>
                                                </div>
                                            </div>
                                            
                                            <div className={styles.reviewDate}>
                                                <i className="fas fa-calendar-alt"></i>
                                                {review.date}
                                            </div>
                                        </div>
                                        
                                        {/* Текст отзыва */}
                                        <div className={styles.reviewText}>
                                            <p>{review.text}</p>
                                        </div>
                                        
                                        {/* Дополнительные действия */}
                                        <div className={styles.reviewActions}>
                                            <button className={styles.likeBtn}>
                                                <i className="fas fa-thumbs-up"></i>
                                                Полезно
                                            </button>
                                            <button className={styles.replyBtn}>
                                                <i className="fas fa-reply"></i>
                                                Ответить
                                            </button>
                                            <button className={styles.shareBtn}>
                                                <i className="fas fa-share"></i>
                                                Поделиться
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button className={styles.sliderBtnNext} onClick={nextSlide}>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>

                {/* Индикаторы слайдов */}
                <div className={styles.sliderIndicators}>
                    {reviews.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.indicator} ${index === activeSlide ? styles.active : ''}`}
                            onClick={() => setActiveSlide(index)}
                        />
                    ))}
                </div>

                {/* Кнопка оставить отзыв */}
                <div className={styles.addReview}>
                    <button 
                        className={styles.addReviewBtn}
                        onClick={handleReviewClick}
                    >
                        <i className="fas fa-pen"></i>
                        Оставить отзыв
                    </button>
                    <p className={styles.reviewNote}>
                        Ваше мнение помогает нам становиться лучше
                    </p>
                </div>
            </div>

            {/* Модальное окно для отзыва */}
            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
            />
        </section>
    );
};

export default Reviews;