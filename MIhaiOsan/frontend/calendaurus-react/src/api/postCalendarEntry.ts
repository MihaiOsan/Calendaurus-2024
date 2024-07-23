import React from "react";
import { prepareToken } from "./authUtils";
import { IPublicClientApplication } from "@azure/msal-browser";
import { ICalendarEntry } from "../types";
export const postCalendarEntryMutation = async (
  instance: IPublicClientApplication,
  entry: ICalendarEntry
) => {
  const url = "https://localhost:7075/api/Calendar";
  const token = await prepareToken(instance);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  console.log(entry);

  const responseData = await response.json();
  return responseData;
};

export const postRecurringCalendarEntryMutation = async (
  instance: IPublicClientApplication,
  entry: ICalendarEntry,
  recurentType: string,
  recurentNr: number
) => {
  const url = `https://localhost:7075/api/Calendar/create-recurring?recurentType=${encodeURIComponent(
    recurentType
  )}&recurentNr=${recurentNr}`;
  const token = await prepareToken(instance);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  console.log(entry);

  return response;
};
