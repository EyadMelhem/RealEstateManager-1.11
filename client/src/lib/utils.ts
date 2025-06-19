import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('ar', {
    style: 'currency',
    currency: 'JOD',
    currencyDisplay: 'symbol'
  }).format(num);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

export function calculateDaysOverdue(dueDate: string | Date): number {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function getPropertyTypeLabel(type: string): string {
  const types: Record<string, string> = {
    apartment: 'شقة',
    villa: 'فيلا',
    commercial: 'محل تجاري',
    office: 'مكتب'
  };
  return types[type] || type;
}

export function getPaymentMethodLabel(method: string): string {
  const methods: Record<string, string> = {
    cash: 'نقد',
    check: 'شيك',
    transfer: 'حوالة بنكية'
  };
  return methods[method] || method;
}
