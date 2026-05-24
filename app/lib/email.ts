import nodemailer from 'nodemailer';

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[EMAIL] Email credentials not configured');
    return null;
  }

  console.log('[EMAIL] Configuring transporter for:', process.env.EMAIL_USER);

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = getTransporter();
  
  if (!transporter) {
    console.log('[EMAIL] Not configured. Would send to:', to, subject);
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Клиника Паллуа" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('[EMAIL] Sent successfully to:', to, '| ID:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('[EMAIL] Error sending to:', to, '| Error:', error.message);
    return false;
  }
}

// Шаблон письма о записи
export function getAppointmentEmailTemplate(data: {
  patientName: string;
  doctorName: string;
  serviceName?: string;
  date: string;
  time: string;
  status: string;
}) {
  const statusText: Record<string, string> = {
    pending: 'Ожидает подтверждения',
    confirmed: 'Подтверждена',
    cancelled: 'Отменена',
    completed: 'Завершена',
  };

  const statusColor: Record<string, string> = {
    pending: '#ffc107',
    confirmed: '#28a745',
    cancelled: '#dc3545',
    completed: '#17a2b8',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #771d55, #9a366e); padding: 25px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Клиника Паллуа</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Пластическая хирургия</p>
      </div>
      <div style="background: white; padding: 25px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #771d55; margin: 0 0 20px; font-size: 18px;">📋 Информация о записи</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666;">Пациент:</td><td style="padding: 8px 0; font-weight: 500;">${data.patientName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Врач:</td><td style="padding: 8px 0; font-weight: 500;">${data.doctorName}</td></tr>
          ${data.serviceName ? `<tr><td style="padding: 8px 0; color: #666;">Услуга:</td><td style="padding: 8px 0; font-weight: 500;">${data.serviceName}</td></tr>` : ''}
          <tr><td style="padding: 8px 0; color: #666;">Дата:</td><td style="padding: 8px 0; font-weight: 500;">${new Date(data.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Время:</td><td style="padding: 8px 0; font-weight: 500;">${data.time}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Статус:</td><td style="padding: 8px 0;"><span style="background: ${statusColor[data.status]}; color: white; padding: 3px 10px; border-radius: 15px; font-size: 13px;">${statusText[data.status]}</span></td></tr>
        </table>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #777; font-size: 13px; margin: 0;">📍 Омск, ул. 70 лет Октября, 26 | 📞 +7 (913) 148-91-42</p>
      </div>
    </body>
    </html>
  `;
}

// Шаблон письма о регистрации
export function getRegistrationEmailTemplate(data: { name: string; email: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clinicpallua.vercel.app';
  
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #771d55, #9a366e); padding: 25px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🎉 Добро пожаловать!</h1>
      </div>
      <div style="background: white; padding: 25px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #771d55; margin: 0 0 15px;">Здравствуйте, ${data.name}!</h2>
        <p style="color: #333; line-height: 1.6;">Спасибо за регистрацию в личном кабинете Клиники Паллуа. Мы рады приветствовать вас!</p>
        <p style="color: #333;">Ваш email для входа: <strong>${data.email}</strong></p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${siteUrl}/dashboard" style="background: #771d55; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Перейти в личный кабинет
          </a>
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #777; font-size: 13px; margin: 0;">📍 Омск, ул. 70 лет Октября, 26 | 📞 +7 (913) 148-91-42</p>
      </div>
    </body>
    </html>
  `;
}

// Шаблон уведомления администратору
export function getAdminNotificationTemplate(data: {
  type: 'new_appointment' | 'new_user' | 'status_change';
  details: Record<string, string>;
}) {
  const titles: Record<string, string> = {
    new_appointment: '📅 Новая запись на прием',
    new_user: '👤 Новый пользователь',
    status_change: '🔄 Изменение статуса записи',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
      <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; border-left: 4px solid #771d55;">
        <h2 style="color: #771d55; margin: 0 0 15px;">${titles[data.type]}</h2>
        ${Object.entries(data.details).map(([key, value]) => 
          `<p style="margin: 5px 0;"><strong>${key}:</strong> ${value}</p>`
        ).join('')}
      </div>
      <p style="color: #999; font-size: 12px; margin-top: 15px;">Автоматическое уведомление системы</p>
    </body>
    </html>
  `;
}

// Шаблон письма для восстановления пароля
export function getResetPasswordEmailTemplate(name: string, resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #771d55, #9a366e); padding: 25px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🔐 Восстановление пароля</h1>
      </div>
      <div style="background: white; padding: 25px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #771d55; margin: 0 0 15px;">Здравствуйте, ${name}!</h2>
        <p style="color: #333; line-height: 1.6;">Вы запросили восстановление пароля для входа в личный кабинет Клиники Паллуа.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" style="background: #771d55; color: white; padding: 14px 35px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            Сбросить пароль
          </a>
        </div>
        <p style="color: #777; font-size: 13px;">⚠️ Ссылка действительна в течение <strong>1 часа</strong>. Если вы не запрашивали восстановление, проигнорируйте это письмо.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #777; font-size: 13px; margin: 0;">📍 Омск, ул. 70 лет Октября, 26 | 📞 +7 (913) 148-91-42</p>
      </div>
    </body>
    </html>
  `;
}