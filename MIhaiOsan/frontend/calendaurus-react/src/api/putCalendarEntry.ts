import { IPublicClientApplication } from "@azure/msal-browser";
import React from "react";
import { prepareToken } from "./authUtils";
import { ICalendarEntry } from "../types";

export const putCalendarEntryMutation = async (
  instance: IPublicClientApplication,
  id: string,
  entry: ICalendarEntry
) => {
  const url = `https://localhost:7075/api/Calendar/${id}`;
  const token = await prepareToken(instance);
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });

  return response;
};
