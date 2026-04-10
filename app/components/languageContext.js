import React, { createContext, useState, useContext, useEffect } from 'react';

// Переводы для сайта
const translations = {
    ru: {
        // Общие
        appointment: 'Запись на прием',
        consultation: 'Консультация',
        more: 'Подробнее',
        readMore: 'Читать далее',
        all: 'Все',
        back: 'Назад',
        next: 'Далее',
        submit: 'Отправить',
        cancel: 'Отмена',
        close: 'Закрыть',
        send: 'Отправить',
        search: 'Поиск',
        
        // Меню
        home: 'Главная',
        about: 'О клинике',
        services: 'Услуги',
        specialists: 'Специалисты',
        prices: 'Цены',
        reviews: 'Отзывы',
        contacts: 'Контакты',
        appointmentMenu: 'Записаться',
        
        // Шапка
        address: 'Адрес',
        callback: 'Обратный звонок',
        toggleTheme: 'Переключить тему',
        toDark: 'на темную',
        toLight: 'на светлую',
        openMenu: 'Открыть меню',
        
    },
    
    en: {
        // Общие
        appointment: 'Make an Appointment',
        consultation: 'Consultation',
        more: 'More',
        readMore: 'Read More',
        all: 'All',
        back: 'Back',
        next: 'Next',
        submit: 'Submit',
        cancel: 'Cancel',
        close: 'Close',
        send: 'Send',
        search: 'Search',
        
        // Меню
        home: 'Home',
        about: 'About Clinic',
        services: 'Services',
        specialists: 'Specialists',
        prices: 'Prices',
        reviews: 'Reviews',
        contacts: 'Contacts',
        appointmentMenu: 'Book Appointment',
        
        // Шапка
        address: 'Address',
        callback: 'Callback',
        toggleTheme: 'Toggle theme',
        toDark: 'to dark',
        toLight: 'to light',
        openMenu: 'Open menu',
        
    },
    
    de: {
        // Общие
        appointment: 'Termin vereinbaren',
        consultation: 'Beratung',
        more: 'Mehr',
        readMore: 'Weiterlesen',
        all: 'Alle',
        back: 'Zurück',
        next: 'Weiter',
        submit: 'Absenden',
        cancel: 'Abbrechen',
        close: 'Schließen',
        send: 'Senden',
        search: 'Suchen',
        
        // Меню
        home: 'Startseite',
        about: 'Über die Klinik',
        services: 'Dienstleistungen',
        specialists: 'Spezialisten',
        prices: 'Preise',
        reviews: 'Bewertungen',
        contacts: 'Kontakte',
        appointmentMenu: 'Termin vereinbaren',
        
        // Шапка
        address: 'Adresse',
        callback: 'Rückruf',
        toggleTheme: 'Thema wechseln',
        toDark: 'zu dunkel',
        toLight: 'zu hell',
        openMenu: 'Menü öffnen',
        
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('ru');
    
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && translations[savedLanguage]) {
            setLanguage(savedLanguage);
        }
    }, []);
    
    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
    }, [language]);
    

    const t = (key) => {
        return translations[language]?.[key] || key;
    };
    

    const changeLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
        }
    };
    
    return (
        <LanguageContext.Provider value={{ language, t, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};


export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};