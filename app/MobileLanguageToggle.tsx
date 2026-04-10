import React from 'react';
import { useLanguage } from './components/languageContext';
import styles from './MobileMenu.module.css';

const MobileLanguageToggle = () => {
    const { language, changeLanguage, t } = useLanguage();
    
    const languages = [
        { code: 'ru', name: t('russian'), flag: '🇷🇺' },
        { code: 'en', name: t('english'), flag: '🇺🇸' },
        { code: 'de', name: t('german'), flag: '🇩🇪' }
    ];
    
    return (
        <div className={styles.menuLanguage}>
            <div className={styles.menuLanguageTitle}>
                <i className="fas fa-globe"></i>
                <span>{t('language')}</span>
            </div>
            <div className={styles.menuLanguageButtons}>
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        className={`${styles.menuLanguageBtn} ${language === lang.code ? styles.active : ''}`}
                        onClick={() => changeLanguage(lang.code)}
                    >
                        <span className={styles.menuLanguageFlag}>{lang.flag}</span>
                        <span>{lang.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileLanguageToggle;