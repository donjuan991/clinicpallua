"use client";

import React, { useEffect } from 'react';
import Hero from './components/Hero';
import AboutClinic from './components/AboutClinic';
import Specialists from './components/Specialists';
import WhyUs from './components/WhyUs';
import Reviews from './components/Reviews';
import Testimonials from './components/Testimonials';
import DiseasesMethods from './components/DiseasesMethods';
import Articles from './components/Articles';
import ContactForm from './components/ContactForm';
import './globals.css';

const HomePage = () => {
    useEffect(() => {
        // Обработчик для версии для слабовидящих
        const versionBtn = document.querySelector('.versionBtn');
        if (versionBtn) {
            versionBtn.addEventListener('click', () => {
                document.body.classList.toggle('accessibility-mode');
                alert('Режим для слабовидящих ' + 
                    (document.body.classList.contains('accessibility-mode') ? 'включен' : 'выключен'));
            });
        }
        
        // Обработчик кнопок записи
        const appointmentBtns = document.querySelectorAll('.consultationBtn, .appointmentBtn');
        appointmentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const appointmentSection = document.getElementById('appointment');
                if (appointmentSection) {
                    appointmentSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Плавная прокрутка для ссылок с якорями
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId || '');
                if (targetElement) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Проверка cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                const cookiesNotification = document.getElementById('cookiesNotification');
                if (cookiesNotification) {
                    cookiesNotification.style.display = 'block';
                }
            }, 2000);
            
            const acceptCookies = document.getElementById('acceptCookies');
            if (acceptCookies) {
                acceptCookies.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'true');
                    const cookiesNotification = document.getElementById('cookiesNotification');
                    if (cookiesNotification) {
                        cookiesNotification.style.display = 'none';
                    }
                });
            }
        }
        
        // Кнопка "Наверх"
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                if (scrollToTopBtn) scrollToTopBtn.style.display = 'flex';
            } else {
                if (scrollToTopBtn) scrollToTopBtn.style.display = 'none';
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Анимация появления элементов при скролле
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // все секции
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Обработка горячих клавиш для версии слабовидящих ctrl+ увеличить
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
                e.preventDefault();
                const currentSize = parseInt(document.documentElement.style.fontSize || '100');
                const newSize = Math.min(currentSize + 10, 200);
                document.documentElement.style.fontSize = `${newSize}%`;
                
                // Сохраняем в localStorage
                localStorage.setItem('fontSize', newSize.toString());
                
                // Показываем уведомление
                showQuickNotification(`Размер шрифта: ${newSize}%`);
            }
            // Обработка горячих клавиш для версии слабовидящих ctrl- уменьшить
            if ((e.ctrlKey || e.metaKey) && e.key === '-') {
                e.preventDefault();
                const currentSize = parseInt(document.documentElement.style.fontSize || '100');
                const newSize = Math.max(currentSize - 10, 70);
                document.documentElement.style.fontSize = `${newSize}%`;
                
                // Сохраняем в localStorage
                localStorage.setItem('fontSize', newSize.toString());
                
                // Показываем уведомление
                showQuickNotification(`Размер шрифта: ${newSize}%`);
            }
            
            // Ctrl+0 сброс шрифта
            if ((e.ctrlKey || e.metaKey) && e.key === '0') {
                e.preventDefault();
                document.documentElement.style.fontSize = '100%';
                localStorage.setItem('fontSize', '100');
                showQuickNotification('Размер шрифта сброшен');
            }
            
            // Alt+1 включение высокого контраста
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                document.documentElement.classList.toggle('high-contrast');
                const isHighContrast = document.documentElement.classList.contains('high-contrast');
                localStorage.setItem('highContrast', isHighContrast.toString());
                showQuickNotification(`Высокий контраст: ${isHighContrast ? 'включен' : 'выключен'}`);
            }
            
            // Alt+2 отключение изображений
            if (e.altKey && e.key === '2') {
                e.preventDefault();
                document.documentElement.classList.toggle('hide-images');
                const hideImages = document.documentElement.classList.contains('hide-images');
                localStorage.setItem('hideImages', hideImages.toString());
                showQuickNotification(`Изображения: ${hideImages ? 'скрыты' : 'показаны'}`);
            }
        };

        // Функция для быстрых уведомлений
        const showQuickNotification = (message: string) => {

            const existingNotification = document.getElementById('quickNotification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Создаем новое уведомление
            const notification = document.createElement('div');
            notification.id = 'quickNotification';
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #771d55, #4d1838ff);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                font-weight: 600;
                z-index: 10001;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            `;
            notification.textContent = message;
            
            // Добавляем стили для анимации
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 3000);
        };

        // Восстанавливаем сохраненные настройки
        const restoreSettings = () => {
            // Восстанавливаем размер шрифта
            const savedFontSize = localStorage.getItem('fontSize');
            if (savedFontSize) {
                document.documentElement.style.fontSize = `${savedFontSize}%`;
            }
            
            // Восстанавливаем высокий контраст
            const savedHighContrast = localStorage.getItem('highContrast');
            if (savedHighContrast === 'true') {
                document.documentElement.classList.add('high-contrast');
            }
            
            // Восстанавливаем скрытие изображений
            const savedHideImages = localStorage.getItem('hideImages');
            if (savedHideImages === 'true') {
                document.documentElement.classList.add('hide-images');
            }
            
            // Восстанавливаем другие настройки
            const savedLetterSpacing = localStorage.getItem('letterSpacing');
            if (savedLetterSpacing === 'true') {
                document.documentElement.classList.add('letter-spacing');
            }
            
            const savedLineHeight = localStorage.getItem('lineHeight');
            if (savedLineHeight === 'true') {
                document.documentElement.classList.add('line-height');
            }
            
            const savedGrayscale = localStorage.getItem('grayscale');
            if (savedGrayscale === 'true') {
                document.documentElement.classList.add('grayscale');
            }
        };

        // Восстанавливаем настройки при загрузке
        restoreSettings();

        // Добавляем обработчик клавиш
        document.addEventListener('keydown', handleKeyDown);

        // Очистка
        return () => {
            if (versionBtn) {
                versionBtn.removeEventListener('click', () => {});
            }
            
            appointmentBtns.forEach(btn => {
                btn.removeEventListener('click', () => {});
            });
            
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.removeEventListener('click', () => {});
            });
            
            window.removeEventListener('scroll', handleScroll);
            
            const acceptCookies = document.getElementById('acceptCookies');
            if (acceptCookies) {
                acceptCookies.removeEventListener('click', () => {});
            }
            
            if (scrollToTopBtn) {
                scrollToTopBtn.removeEventListener('click', () => {});
            }
            
            observer.disconnect();
            
            document.removeEventListener('keydown', handleKeyDown);
            

            const notification = document.getElementById('quickNotification');
            if (notification && notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        };
    }, []);

    return (
        <>
            <Hero />
            <AboutClinic />
            <Specialists />
            <WhyUs />
            <Reviews />
            <Testimonials />
            <DiseasesMethods />
            <Articles />
            <ContactForm />
            
            <div className="cookies-notification" id="cookiesNotification">
                <div className="cookies-content">
                    <p>
                        Мы используем файлы cookies для улучшения работы сайта. 
                        Оставаясь на нашем сайте, вы соглашаетесь с условиями использования файлов cookies.
                    </p>
                    <div className="cookies-buttons">
                        <button className="cookies-accept" id="acceptCookies">
                            Принять
                        </button>
                        <a href="/privacy" className="cookies-link">
                            Политика конфиденциальности
                        </a>
                    </div>
                </div>
            </div>
            
            <button className="scroll-to-top" id="scrollToTop">
                <i className="fas fa-chevron-up"></i>
            </button>
            
            <style jsx>{`
                .cookies-notification {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: #2c3e50;
                    color: white;
                    padding: 20px;
                    z-index: 10000;
                    display: none;
                }
                
                .cookies-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .cookies-content p {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.5;
                }
                
                .cookies-buttons {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                }
                
                .cookies-accept {
                    background-color: var(--primary-blue);
                    color: white;
                    border: none;
                    border-radius: var(--radius);
                    padding: 10px 20px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: var(--transition);
                }
                
                .cookies-accept:hover {
                    background-color: var(--primary-hover);
                }
                
                .cookies-link {
                    color: var(--primary-blue);
                    font-size: 14px;
                    text-decoration: none;
                }
                
                .cookies-link:hover {
                    text-decoration: underline;
                }
                
                .scroll-to-top {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background-color: var(--primary-blue);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    transition: var(--transition);
                    z-index: 1000;
                    box-shadow: var(--shadow);
                }
                
                .scroll-to-top:hover {
                    background-color: var(--primary-hover);
                    transform: translateY(-3px);
                }
                
                @media (max-width: 768px) {
                    .cookies-content {
                        text-align: center;
                    }
                    
                    .cookies-buttons {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .scroll-to-top {
                        bottom: 20px;
                        right: 20px;
                        width: 45px;
                        height: 45px;
                    }
                }
            `}</style>
        </>
    );
};

export default HomePage;