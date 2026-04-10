// app/types/index.ts
export interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: 'admin' | 'patient';
  createdAt: Date;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  description: string | null;
  imageUrl: string | null;
  experience: number | null;
  rating: number;
  isActive: boolean;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  duration: number | null;
  category: string;
  isActive: boolean;
}

export interface Appointment {
  id: number;
  userId: number | null;
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  doctorId: number;
  serviceId: number | null;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  comment: string | null;
  createdAt: Date;
}

export interface CreateAppointmentData {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  doctorId: number;
  serviceId?: number;
  appointmentDate: string;
  appointmentTime: string;
  comment?: string;
  userId?: number;
}