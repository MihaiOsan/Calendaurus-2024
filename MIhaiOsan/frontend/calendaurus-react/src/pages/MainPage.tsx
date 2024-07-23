import React, { useEffect, useState } from "react";

import { Header } from "../components/Header";
import { Calendar } from "../components/Calendar";
import dayjs from "dayjs";
//import { mocks } from "../assets/mocks";
import { useCalendarQuery } from "../api/getCalendarEntries";
import { IPublicClientApplication } from "@azure/msal-browser";
import { Container } from "@mui/material";
type MainPageProps = {
  instance: IPublicClientApplication;
};
export const MainPage = (props: MainPageProps) => {
  const { instance } = props;
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  //const calendarEntries = mocks;

  const { data: calendarEntries, refetch: refetchAllEntries } =
    useCalendarQuery(instance, searchTerms);

  const handleSearch = (terms: string[]) => {
    setSearchTerms(terms);
    refetchAllEntries();
  };

  const changeWeek = (direction: string) => {
    let newWeekDates: string[] = [];

    if (direction === "previous") {
      newWeekDates = weekDates.map((date) =>
        dayjs(date, "Do MMMM").subtract(7, "day").format("Do MMMM")
      );
    } else if (direction === "next") {
      newWeekDates = weekDates.map((date) =>
        dayjs(date, "Do MMMM").add(7, "day").format("Do MMMM")
      );
    } else if (direction === "today") {
      const startOfWeek = dayjs().startOf("week").add(1, "day");
      newWeekDates = Array.from({ length: 5 }, (_, i) =>
        startOfWeek.add(i, "day").format("Do MMMM")
      );
    }
    setWeekDates(newWeekDates);
  };

  useEffect(() => {
    const startOfWeek = dayjs().startOf("week").add(1, "day");
    const dateOfWeek = Array.from({ length: 5 }, (_, i) =>
      startOfWeek.add(i, "day").format("Do MMMM")
    );
    setWeekDates(dateOfWeek);
  }, []);
  return (
    <Container
      sx={{
        padding: "25px 0",
      }}
    >
      <Header
        changeWeek={changeWeek}
        refetchAllEntries={refetchAllEntries}
        handleSearch={handleSearch}
      />
      <Calendar
        data={calendarEntries}
        weekDates={weekDates}
        refetchAllEntries={refetchAllEntries}
      />
    </Container>
  );
};
