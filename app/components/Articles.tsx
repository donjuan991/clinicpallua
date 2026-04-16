"use client";

import React, { useState } from 'react';
import styles from './Articles.module.css';
import ArticleModal from './ArticleModal';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  imageColor: string;
  tags: string[];
}

const Articles = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favoriteArticles');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const articles: Article[] = [
    {
      id: 1,
      title: 'Ринопластика: ключ к гармонии лица',
      excerpt: 'Современные подходы к коррекции формы носа и восстановлению дыхательной функции',
      content: 'Ринопластика — одна из самых востребованных операций в пластической хирургии. Профессор Паллуа использует современные методики, позволяющие достичь естественного результата, сохраняя индивидуальные черты лица. Операция проводится под общим наркозом и занимает 2-3 часа. Восстановительный период составляет около 2 недель, окончательный результат оценивается через 6-12 месяцев.',
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
      content: 'Блефаропластика позволяет устранить нависание верхних век, мешки под глазами и мелкие морщины. В клинике Паллуа применяются как классические, так и лазерные методики. Операция длится 1-2 часа, реабилитация занимает 7-10 дней. Результат сохраняется на 10-15 лет.',
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
      content: 'Липосакция в клинике Паллуа выполняется с использованием технологии VASER, которая позволяет не только удалить жировые отложения, но и подтянуть кожу. Процедура проводится под местной или общей анестезией, длительность зависит от количества зон. Реабилитация занимает 2-4 недели.',
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
      content: 'SMAS-подтяжка лица — золотой стандарт омоложения, позволяющий добиться естественного результата без эффекта "натянутой маски". Профессор Паллуа выполняет эту операцию с учетом анатомических особенностей каждого пациента. Восстановление занимает 3-4 недели, результат сохраняется до 10 лет.',
      category: 'Реконструктивная хирургия',
      date: '12.03.2024',
      readTime: '10 мин',
      imageColor: '#4e1337',
      tags: ['подтяжка лица', 'омоложение', 'SMAS-техника']
    }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id];
      localStorage.setItem('favoriteArticles', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  return (
    <section className={styles.articles}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Полезные статьи</h2>
          <p className="section-subtitle">
            Актуальная информация
          </p>
        </div>

        <div className={styles.articlesGrid}>
          {articles.map((article) => (
            <article key={article.id} className={styles.articleCard}>
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
                  <a 
                    href="#" 
                    className={styles.articleLink}
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle(article);
                    }}
                  >
                    {article.title}
                  </a>
                </h3>
                
                <p className={styles.articleExcerpt}>
                  {article.excerpt}
                </p>
                
                <div className={styles.articleTags}>
                  {article.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className={styles.articleFooter}>
                  <a 
                    href="#" 
                    className={styles.readMoreBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      openArticle(article);
                    }}
                  >
                    Читать статью
                    <i className="fas fa-arrow-right"></i>
                  </a>
                  <button 
                    className={`${styles.bookmarkBtn} ${favorites.includes(article.id) ? styles.active : ''}`}
                    onClick={() => toggleFavorite(article.id)}
                  >
                    <i className={`fa${favorites.includes(article.id) ? 's' : 'r'} fa-bookmark`}></i>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ArticleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={selectedArticle}
      />
    </section>
  );
};

export default Articles;