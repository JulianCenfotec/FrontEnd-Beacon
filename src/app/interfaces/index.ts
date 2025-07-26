export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  displayname?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  role?: IRole;
  initialNotify?: boolean;
  finalNotify?: boolean;
  notificationOption?: NotificationOptionEnum;
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRoleType {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  superAdmin = 'ROLE_SUPER_ADMIN_ROLE'
}

export interface IRole {
  createdAt: string,
  description: string,
  id: number
  name : string,
  updatedAt: string
}

export interface IBanks {
  id?: number,
  nombre?: string,
  tasaAhorro?: number,
  tasaUnificacion?: number,
  tasaCredito?: number
}

export interface NotificationPreferences {
  receiveAll: boolean;
  notifications:[
     { id: string, name: string, description: string, enabled: boolean },
     { id: string, name: string, description: string, enabled: boolean },
  ];
  reportFrequency: NotificationOptionEnum;
}


export interface ISubscriptionPlan {
  id?: number;
  titulo: string;
  descripcion: string;
  precio: number;
  plazo: number;
}

export interface IUserSubscription {
  subscription: ISubscriptionPlan;
  endOfSuscriptionAt: number;
  updatedAt: number;
  createdAt: number;
  estado: string;
  user: IUser;
  id: number;
}

export enum UserSubscriptionStateEnum {
  CONFIRMATION = 'CONFIRMATION',
  CANCELED = 'CANCELED',
  APPROVED = 'APPROVED',
  INERROR = 'INERROR',
}

export interface IChapter {
  id: number;
  name: string;
  description: string;
  videoUrl: string;
  options: IChapterOption[];
  pastOptions:  IChapterOption[];
}
export interface IChapterOption {
  id?: number;
  name?: string;
  ChapterId: number;
}

export enum EtiquetaTipoEnum {
  IMPREVISTO = 'IMPREVISTO',
  INVERSION = 'INVERSION',
  SUELDO = 'SUELDO',
  AHORRO = 'AHORRO',
  DEUDA = 'DEUDA',
}

export enum Periodo {
  SEMANAL = 'SEMANAL',
  QUINCENAL = 'QUINCENAL',
  MENSUAL = 'MENSUAL',
}

export interface IPlan {
  id?: number;
  usuario: IUser;
  anterior: null;
  titulo: string;
  descripcion: string;
  periodo: Periodo;
  saldo: number;
  monto: number;
  recurrente: boolean;
  sistema: boolean;
  compartida: boolean;
  createdAt?: number;
  updatedAt?: number;
  gastos: IGasto[];
  ingresos: IIngreso[];
}

export interface IIngreso {
  id?: number;
  etiqueta: IEtiqueta;
  nombre: string;
  monto: number;
}

export interface IGasto {
  id?: number;
  etiqueta: IEtiqueta;
  deuda: null;
  nombre: string;
  monto: number;
}

export interface IEtiqueta {
  id: number;
  color: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  sistema: boolean;
}

export interface ICalendario {
  id: number;
  nombre: string;
  usuario: IUser;
  calendarioPlans: Array<ICalendarioPlan>;
  calendarioGastosImprevistos: Array<ICalendarioGasto>;
  calendarioIngresosImprevistos: Array<ICalendarioIngreso>;
}

export interface ICalendarioPlan {
  id: number;
  plan: IPlan;
  fechaInicio: number;
}
export enum NotificationOptionEnum {
  ZERO = 'ZERO',
  ONE = 'ONE',
  THREE = 'THREE',
  SEVEN = 'SEVEN'
}

export interface ICalendarioGasto {
  id: number;
  gasto: IGasto;
  fechaInicio: number;
}

export interface ICalendarioIngreso {
  id: number;
  ingreso: IIngreso;
  fechaInicio: number;
}

export interface ICalendarioGeneral {
  id: number;
  nombre: string;
  usuario: IUser;
  calendarioPlans: Array<ICalendarioPlan>;
  calendarioGastosImprevistos: Array<ICalendarioGasto>;
  calendarioIngresosImprevistos: Array<ICalendarioIngreso>;
}
export interface INotificationPreferences {
  id: number;
  finalNotify: boolean;
  initialNotify: boolean;
  notificationOption: NotificationOptionEnum;
}