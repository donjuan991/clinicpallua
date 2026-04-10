"use client";

import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from './components/ThemeContext';
import { LanguageProvider } from './components/languageContext';
import './globals.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <html lang="ru">
                    <head>
                        <meta charSet="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>Клиника Паулла | Омск</title>
                        <meta 
                            name="description" 
                            content="Многопрофильная медицинская клиника в Омске. Консультации врачей, диагностика, лечение. Запись на прием онлайн." 
                        />
                        <link 
                            rel="stylesheet" 
                            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
                        />
                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                        <link 
                            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
                            rel="stylesheet" 
                        />
                    </head>
                    <body>
                        <div className="app">
                            <Header /> 
                            <main className="main-content">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </body>
                </html>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default Layout;