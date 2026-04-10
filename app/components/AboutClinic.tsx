import React from 'react';
import styles from './AboutClinic.module.css';

const AboutClinic = () => {
    const features = [
        {
            id: 1,
            title: 'Современное оборудование',
            description: 'Используем только новейшее оборудование',
            icon: 'fas fa-microscope'
        },
        {
            id: 2,
            title: 'Опытные специалисты',
            description: 'Врачи с многолетним стажем и регулярным повышением квалификации',
            icon: 'fas fa-user-md'
        },
        {
            id: 3,
            title: 'Индивидуальный подход',
            description: 'Для каждого пациента разрабатывается персональная программа',
            icon: 'fas fa-hand-holding-heart'
        },
        {
            id: 4,
            title: 'Комфортные условия',
            description: 'Уютные кабинеты и заботливый персонал для вашего удобства',
            icon: 'fas fa-home'
        }
    ];

    const milestones = [
        { year: '2010', text: 'Основание клиники' },
        { year: '2015', text: 'Сертификации' },
        { year: '2018', text: 'Внедрение новых технологий' },
        { year: '2020', text: 'Открытие новых клиник' },
        { year: '2023', text: '10 000+ довольных пациентов' }
    ];

    return (
        <section id="about" className={styles.about}>
            <div className="container">
                {/* Заголовок секции */}
                <div className="section-header">
                    <h2 className="section-title">Наши сильные стороны</h2>
                    <p className="section-subtitle">
                        Благодаря нашему многолетнему опыту и проверенной специализации, наши сильные стороны находятся там, где другие достигают предела своих возможностей:
                    </p>
                </div>

                <div className={styles.aboutContent}>
                    {/* Текстовый блок */}
                    <div className={styles.aboutText}>
                        <div className={styles.aboutMain}>
                            <h3>Среди прочего:</h3>
                            <p>
                                - Сложные процедуры в области лица и шеи<br />
                                - Корректирующие операции после неудачных процедур<br />
                                - Удаление имплантированных инородных материалов, приводящих к обезображиванию<br />
                            </p>
                        </div>
                        
                        <div className={styles.features}>
                            {features.map((feature) => (
                                <div key={feature.id} className={styles.feature}>
                                    <div className={styles.featureIcon}>
                                        <i className={feature.icon}></i>
                                    </div>
                                    <div className={styles.featureContent}>
                                        <h4>{feature.title}</h4>
                                        <p>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                 <div className={styles.aboutVisual}>
    <div className={styles.clinicImage}>
        <div className={styles.imagePlaceholder}>
            <img 
                src="/images/team.jpg" 
                alt="Наша команда" 
                className={styles.teamPhoto}
            />
        </div>
    </div>
                        
                        <div className={styles.milestones}>
                            <h3>Наша история</h3>
                            <div className={styles.timeline}>
                                {milestones.map((milestone, index) => (
                                    <div key={index} className={styles.milestone}>
                                        <div className={styles.milestoneYear}>
                                            {milestone.year}
                                        </div>
                                        <div className={styles.milestoneText}>
                                            {milestone.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Статистика */}
                <div className={styles.aboutStats}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>12</div>
                        <div className={styles.statLabel}>Лет успешной работы</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>25+</div>
                        <div className={styles.statLabel}>Врачей-специалистов</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>400+</div>
                        <div className={styles.statLabel}>Публикаций</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>99%</div>
                        <div className={styles.statLabel}>Довольных пациентов</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutClinic;