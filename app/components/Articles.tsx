import React from 'react';
import styles from './Articles.module.css';

const Articles = () => {
    const articles = [
    {
        id: 1,
        title: 'Ринопластика: ключ к гармонии лица',
        excerpt: 'Современные подходы к коррекции формы носа и восстановлению дыхательной функции',
        category: 'Пластическая хирургия',
        date: '20.03.2024',
        readTime: '8 мин',
        imageColor: '#771d55',
        tags: ['ринопластика', 'коррекция носа', 'эстетика']
    },
    {
        id: 2,
        title: 'Блефаропластика век: возвращение молодого взгляда',
        excerpt: 'Техники устранения возрастных изменений век и периорбитальной области',
        category: 'Эстетическая хирургия',
        date: '18.03.2024',
        readTime: '7 мин',
        imageColor: '#9d4b7c',
        tags: ['блефаропластика', 'омоложение глаз', 'хирургия век']
    },
    {
        id: 3,
        title: 'Липосакция: не просто удаление жира',
        excerpt: 'Современные технологии контурной пластики и моделирования фигуры',
        category: 'Пластическая хирургия',
        date: '15.03.2024',
        readTime: '9 мин',
        imageColor: '#631846',
        tags: ['липосакция', 'контурная пластика', 'моделирование']
    },
    {
        id: 4,
        title: 'Подтяжка лица: от классических до миниинвазивных методик',
        excerpt: 'Сравнение различных техник омоложения лица и их эффективность',
        category: 'Реконструктивная хирургия',
        date: '12.03.2024',
        readTime: '10 мин',
        imageColor: '#4e1337',
        tags: ['подтяжка лица', 'омоложение', 'SMAS-техника']
    },
    {
        id: 5,
        title: 'Коррекция фигуры после беременности',
        excerpt: 'Комплексный подход к восстановлению после родов: абдоминопластика и маммопластика',
        category: 'Пластическая хирургия',
        date: '10.03.2024',
        readTime: '8 мин',
        imageColor: '#8a3a6a',
        tags: ['абдоминопластика', 'послеродовое восстановление', 'маммопластика']
    },
    {
        id: 6,
        title: 'Устранение осложнений после неудачных операций',
        excerpt: 'Опыт профессора Паллуа в ревизионной и коррекционной хирургии',
        category: 'Реконструктивная хирургия',
        date: '08.03.2024',
        readTime: '11 мин',
        imageColor: '#3d0f2b',
        tags: ['ревизионная хирургия', 'коррекция осложнений', 'реконструкция']
    },
    {
        id: 7,
        title: 'Импланты груди: выбор, установка, замена',
        excerpt: 'Все что нужно знать о маммопластике: от первичной до ревизионной операции',
        category: 'Эстетическая хирургия',
        date: '05.03.2024',
        readTime: '9 мин',
        imageColor: '#b56a9d',
        tags: ['маммопластика', 'импланты', 'увеличение груди']
    },
    {
        id: 8,
        title: 'Лазерные технологии в эстетической хирургии',
        excerpt: 'Современные лазерные методы для омоложения кожи и коррекции рубцов',
        category: 'Эстетическая медицина',
        date: '01.03.2024',
        readTime: '6 мин',
        imageColor: '#d18dbb',
        tags: ['лазерные технологии', 'омоложение кожи', 'коррекция рубцов']
    }
];

    return (
        <section className={styles.articles}>
            <div className="container">
                {/* Заголовок секции */}
                <div className="section-header">
                    <h2 className="section-title">Полезные статьи</h2>
                    <p className="section-subtitle">
                        Актуальная информация
                    </p>
                </div>

                {/* Сетка статей */}
                <div className={styles.articlesGrid}>
                    {articles.map((article) => (
                        <article key={article.id} className={styles.articleCard}>
                            {/* Изображение статьи */}
                            <div 
                                className={styles.articleImage}
                                style={{ backgroundColor: article.imageColor }}
                            >
                                <div className={styles.imageContent}>
                                    <i className="fas fa-newspaper"></i>
                                </div>
                                <div className={styles.articleCategory}>
                                    {article.category}
                                </div>
                            </div>
                            
                            {/* Контент статьи */}
                            <div className={styles.articleContent}>
                                <div className={styles.articleMeta}>
                                    <span className={styles.articleDate}>
                                        <i className="far fa-calendar"></i>
                                        {article.date}
                                    </span>
                                    <span className={styles.articleReadTime}>
                                        <i className="far fa-clock"></i>
                                        {article.readTime}
                                    </span>
                                </div>
                                
                                <h3 className={styles.articleTitle}>
                                    <a href="#" className={styles.articleLink}>
                                        {article.title}
                                    </a>
                                </h3>
                                
                                <p className={styles.articleExcerpt}>
                                    {article.excerpt}
                                </p>
                                
                                {/* Теги статьи */}
                                <div className={styles.articleTags}>
                                    {article.tags.map((tag, index) => (
                                        <span key={index} className={styles.tag}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Кнопка чтения */}
                                <div className={styles.articleFooter}>
                                    <a href="#" className={styles.readMoreBtn}>
                                        Читать статью
                                        <i className="fas fa-arrow-right"></i>
                                    </a>
                                    <button className={styles.bookmarkBtn}>
                                        <i className="far fa-bookmark"></i>
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Articles;