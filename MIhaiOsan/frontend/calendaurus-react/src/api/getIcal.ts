import { IPublicClientApplication } from "@azure/msal-browser";
import { prepareToken } from "./authUtils";

export async function downloadIcal(instance: IPublicClientApplication) {
  const token = await prepareToken(instance);
  const url = `https://localhost:7075/api/Calendar/export-ical`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", "calendar.ics");
  document.body.appendChild(link);
  link.click();
  link.remove();
}
