import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Indonesia date format
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

//Late return
export function delayCount(dateReturn: string): number {
  const limit = new Date(dateReturn);
  const current = new Date();
  const diff = current.getTime() - limit.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}