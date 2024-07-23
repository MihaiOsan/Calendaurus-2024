import { IPublicClientApplication } from "@azure/msal-browser";
import React from "react";
import { prepareToken } from "./authUtils";

export const deleteCalendarEntryMutation = async (instance: IPublicClientApplication, id: string) => {
    const url = `https://localhost:7075/api/Calendar/${id}`;
    const token = await prepareToken(instance);
    const response = await fetch(url,{
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token,
            'Content-Type': 'application/json'
        },
    });

    return response;
}