
export interface CalendarEvent {
  title: string; // titulo del evento
  time: string; //  hora del evento
}

export interface EventDay {
  day: number; // dia del mes
  month: number; // mes (1 al 12)
  year: number;  // año
  events: CalendarEvent[]; // lista de eventos en el dia
}