import React, { useState } from 'react';
import { useLanguage } from './languageContext';
import styles from './Header.module.css';


type LanguageCode = 'ru' | 'en' | 'de';

interface Language {
    code: LanguageCode;
    name: string;
    flag: string;
}

const LanguageToggle = () => {
    const { language, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    
    const languages: Language[] = [
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
    ];
    
    const currentLang = languages.find(lang => lang.code === language) || languages[0];
    
    const handleLanguageChange = (langCode: LanguageCode) => {
        changeLanguage(langCode);
        setIsOpen(false);
    };
    
    return (
        <div 
            className={styles.languageToggle}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button 
                className={styles.languageBtn}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Переключить язык"
            >
                <span className={styles.languageFlag}>{currentLang.flag}</span>
                <span>{currentLang.code.toUpperCase()}</span>
                <i className="fas fa-chevron-down"></i>
            </button>
            
            {isOpen && (
                <div className={styles.languageDropdown}>
                    <ul className={styles.languageList}>
                        {languages.map((lang) => (
                            <li key={lang.code} className={styles.languageItem}>
                                <button
                                    className={`${styles.languageOption} ${language === lang.code ? styles.active : ''}`}
                                    onClick={() => handleLanguageChange(lang.code)}
                                >
                                    <span className={styles.languageFlag}>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LanguageToggle;