import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { ICalendarEntry } from "../types";
import { Slot } from "./Slot";
import { getDayHour } from "../utils";

type CalendarProps = {
  weekDates: string[];
  data: ICalendarEntry[] | undefined;
  refetchAllEntries: () => void;
};

export const Calendar = (props: CalendarProps) => {
  const { weekDates, data, refetchAllEntries } = props;
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hoursDay = [8, 10, 12, 14, 16, 18, 20];

  const formatHour = (hour: number) => `${hour.toString().padStart(2, "0")}:00`;

  const renderSlots = (day: string, hour: number) => {
    let slotAdded = false;
    const slots =
      data?.map((item) => {
        const itemDate = getDayHour(item.timestamp);
        if (itemDate.day === day && itemDate.hour === hour) {
          slotAdded = true;
          return (
            <Slot
              key={item.id}
              details={item}
              refetchAllEntries={refetchAllEntries}
            />
          );
        }
        return null;
      }) || [];

    if (!slotAdded) {
      slots.push(
        <Slot
          key={`${day}-${hour}-empty`}
          refetchAllEntries={refetchAllEntries}
        />
      );
    }

    return slots;
  };

  const getCurrentHourRowIndex = () => {
    const currentHour = new Date().getHours();
    return hoursDay.findIndex(
      (hour) => hour <= currentHour && hour + 2 > currentHour
    );
  };

  const currentHourRowIndex = getCurrentHourRowIndex();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {weekDays.map((day, index) => (
              <TableCell key={`${weekDays[index]}`}>
                {day}
                <Typography>{weekDates[index]}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {hoursDay.map((hour, index) => (
            <TableRow
              key={hour}
              style={
                index === currentHourRowIndex
                  ? {
                      backgroundColor: "#f5f5f5",
                      borderLeft: "4px solid #1976d2",
                    }
                  : {}
              }
            >
              <TableCell>
                <Typography variant="h6">{formatHour(hour)}</Typography>
              </TableCell>
              {weekDays.map((day, index) => (
                <TableCell key={`${day}-${hour}`}>
                  {renderSlots(weekDates[index], hour)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
