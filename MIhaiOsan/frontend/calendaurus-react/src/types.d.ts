export interface ICalendarEntry {
  id?: string;
  title: string;
  timestamp: string;
  endTime: string;
  createdTimeUtc: string;
  updatedTimeUtc: string;
  type: string;
  location: string;
  userId?: string;
}


export interface ICalendarSearch{
  title?: string;
  timestamp?: string;
  type?: string;
  location?: string;
}