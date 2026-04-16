import { Resend } from 'resend';

// Инициализация Resend
const getResend = () => {
  if (process.env.RESEND_API_KEY) {
    return new Resend(process.env.RESEND_API_KEY);
  }
  return null;
};

export async function sendEmail(to: string, subject: string, html: string) {
  const resend = getResend();
  
  if (!resend) {
    console.log('[EMAIL] Resend not configured. Would send to:', to, subject);
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Pallua Clinic <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('[EMAIL] Resend error:', error);
      return false;
    }

    console.log('[EMAIL] Sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('[EMAIL] Error sending email:', error);
    return false;
  }
}

// Шаблон письма о записи на прием
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
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #771d55 0%, #9a366e 100%); padding: 30px 20px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🏥 Клиника Паллуа</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Пластическая хирургия высшего уровня</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #771d55; margin: 0 0 20px; font-size: 20px;">📋 Информация о записи</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Пациент:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #2d2d2d; font-weight: 500;">${data.patientName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Врач:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #2d2d2d; font-weight: 500;">${data.doctorName}</td>
          </tr>
          ${data.serviceName ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Услуга:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #2d2d2d; font-weight: 500;">${data.serviceName}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Дата:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #2d2d2d; font-weight: 500;">${new Date(data.date).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Время:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #2d2d2d; font-weight: 500;">${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #666;">Статус:</td>
            <td style="padding: 12px 0;">
              <span style="background: ${statusColor[data.status]}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                ${statusText[data.status] || data.status}
              </span>
            </td>
          </tr>
        </table>
        
        <hr style="margin: 30px 0 20px; border: none; border-top: 1px solid #e8e8e8;">
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Если у вас есть вопросы, свяжитесь с нами:<br>
          📞 <a href="tel:+79131489142" style="color: #771d55; text-decoration: none;">+7 (913) 148-91-42</a><br>
          📧 <a href="mailto:info@pallua-clinic.com" style="color: #771d55; text-decoration: none;">info@pallua-clinic.com</a>
        </p>
        
        <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 12px; text-align: center;">
          <p style="margin: 0 0 10px; color: #2d2d2d; font-weight: 500;">📍 Адрес клиники</p>
          <p style="margin: 0; color: #666; font-size: 14px;">г. Омск, ул. 70 лет Октября, 26</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>© 2025 Клиника Паллуа. Все права защищены.</p>
        <p>
          <a href="#" style="color: #999; text-decoration: none;">Политика конфиденциальности</a> • 
          <a href="#" style="color: #999; text-decoration: none;">Отписаться</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

// Шаблон письма о регистрации
export function getRegistrationEmailTemplate(data: {
  name: string;
  email: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #771d55 0%, #9a366e 100%); padding: 30px 20px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Добро пожаловать!</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #771d55; margin: 0 0 20px; font-size: 20px;">Здравствуйте, ${data.name}!</h2>
        
        <p style="color: #2d2d2d; line-height: 1.6; margin-bottom: 20px;">
          Спасибо за регистрацию в личном кабинете Клиники Паллуа. 
          Мы рады приветствовать вас среди наших пациентов!
        </p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="color: #2d2d2d; margin: 0 0 15px; font-size: 16px;">✨ Теперь вы можете:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li style="margin-bottom: 8px;">Записываться на прием онлайн в любое время</li>
            <li style="margin-bottom: 8px;">Отслеживать статус своих записей</li>
            <li style="margin-bottom: 8px;">Получать персональные рекомендации</li>
            <li style="margin-bottom: 8px;">Сохранять историю обращений</li>
          </ul>
        </div>
        
        <div style="padding: 15px; background: rgba(119, 29, 85, 0.05); border-radius: 12px; margin-bottom: 25px;">
          <p style="margin: 0; color: #2d2d2d;">
            <strong>Ваш email для входа:</strong> ${data.email}
          </p>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #771d55 0%, #9a366e 100%); 
                    color: white; padding: 14px 30px; border-radius: 12px; text-decoration: none; 
                    font-weight: 500; box-shadow: 0 4px 12px rgba(119, 29, 85, 0.3);">
            Перейти в личный кабинет
          </a>
        </div>
        
        <hr style="margin: 30px 0 20px; border: none; border-top: 1px solid #e8e8e8;">
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          С уважением,<br>
          <strong>Клиника пластической хирургии "Паллуа"</strong><br>
          📞 <a href="tel:+79131489142" style="color: #771d55; text-decoration: none;">+7 (913) 148-91-42</a>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>© 2025 Клиника Паллуа. Все права защищены.</p>
      </div>
    </body>
    </html>
  `;
}

// Шаблон уведомления администратору
export function getAdminNotificationTemplate(data: {
  type: 'new_appointment' | 'new_user' | 'status_change';
  details: Record<string, any>;
}) {
  const typeTitles = {
    new_appointment: '📅 Новая запись на прием',
    new_user: '👤 Новый пользователь',
    status_change: '🔄 Изменение статуса записи',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #771d55;">${typeTitles[data.type]}</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        ${Object.entries(data.details).map(([key, value]) => `
          <p><strong>${key}:</strong> ${value}</p>
        `).join('')}
      </div>
      
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin" 
           style="background: #771d55; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
          Перейти в админ-панель
        </a>
      </p>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        Автоматическое уведомление от системы Клиники Паллуа
      </p>
    </body>
    </html>
  `;
}