import React from "react";
import { prepareToken } from "./authUtils";
import { IPublicClientApplication } from "@azure/msal-browser";
import { ICalendarEntry } from "../types";
import { useQuery } from "react-query";

export async function getEntries(
  instance: IPublicClientApplication,
  searchTerms: string[] = []
) {
  const token = await prepareToken(instance);
  const query =
    searchTerms.length > 0
      ? `?${searchTerms
          .map(
            (term, index) =>
              `searchTerm${index + 1}=${encodeURIComponent(term)}`
          )
          .join("&")}`
      : "";
  const url = `https://localhost:7075/api/Calendar${query}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  return responseData as ICalendarEntry[];
}

export function useCalendarQuery(
  instance: IPublicClientApplication,
  searchTerm?: string[]
) {
  return useQuery({
    queryFn: async () => {
      const responseData = await getEntries(instance, searchTerm);
      return responseData;
    },
  });
}
