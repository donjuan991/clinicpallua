"use client";

import React from 'react';
import styles from './ArticleModal.module.css';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    content: string;
    category: string;
    date: string;
    readTime: string;
    tags: string[];
  } | null;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <i className="fas fa-newspaper"></i>
            <span>{article.title}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.articleMeta}>
            <span className={styles.articleCategory}>
              <i className="fas fa-folder"></i>
              {article.category}
            </span>
            <span className={styles.articleDate}>
              <i className="fas fa-calendar"></i>
              {article.date}
            </span>
            <span className={styles.articleReadTime}>
              <i className="fas fa-clock"></i>
              {article.readTime}
            </span>
          </div>

          <div className={styles.articleTags}>
            {article.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>

          <div className={styles.articleContent}>
            <p>{article.content}</p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;