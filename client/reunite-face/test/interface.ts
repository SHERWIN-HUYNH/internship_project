declare type Gender = 'MALE' | 'FEMALE' | 'OTHER'
declare type Status = 'PENDING' | 'SCHEDULED' | 'CANCELLED'
export interface Profile {
  id: string
  name: string
  birthDate?: Date | null
  gender: Gender
  email: string
  phone: string
  allergies?: string | null
  symptom: string
  identificationType: string
  identificationNumber: string
  identificationDocumentUrl: string
  pastMedicalHistory: string
  userId: string
}
export interface UserInfor {
  id: string
  name: string
  email: string
  roleName: string
  phone: number
}
export interface UserRole {
  id: string
  name: string
  email: string
  roleName: string
}
export interface Faculty {
  id: string
  name: string
  description: string
  image: string
}

export interface Service {
  id: string
  name: string
  price: number
  facultyId: string
  description: string
}
export interface Schedule {
  id: string
  date: string
  timeSlot: string
  isAvailable: boolean
  doctorScheduleId: string
}

export interface Comment {
  id: string
  date: string
  content: string
  rating: number
  doctorId: string
  userId: string
  appointmentId: string
}

export interface Doctor {
  id: string
  name: string
  academicTitle: string
  description?: string
  isDeleted: boolean
  image?: string
  gender: boolean
  facultyId: string
  isActive: boolean
  averageRating?: number
  comments: Comment[]
  doctorSchedule: Schedule[]
  faculty: Faculty
}
export interface Appointment {
  profileId: string
  doctorScheduleId: string
  serviceId: string
  note: string
  status: Status
  cancellationReason: string
}

export interface AppointmentSchedule {
  id: string
  status: Status
  cancellationReason: string | null
  profileId: string
  serviceId: string
  stripeCustomerId: string
  doctorScheduleId: string
  profile: Profile
  doctorSchedule: DoctorSchedule
  Service: Service
}
export interface CreateAppointment {
  userId: string
  profileId: string
  doctorScheduleId: string
  serviceId: string
  stripeCustomerId: string
}

interface DoctorSchedule {
  id: string
  doctorId: string
  scheduleId: string
  isAvailable: boolean
  schedule: Schedule // Full schedule object
  doctor: Doctor // Full doctor object
}
export interface Bill {
  id?: string
  price: number
  appointmentId: string
  userId: string
  createdAt?: Date
  updatedAt?: Date
  status: string
  paymentMethod?: string
  note?: string
}
export interface BillInfor {
  id: string
  price: number
  appointmentId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  status: string
  appointment: AppointmentSchedule
  user: UserInfor
  payment?: {
    paymentIntentId: string
  }
}
