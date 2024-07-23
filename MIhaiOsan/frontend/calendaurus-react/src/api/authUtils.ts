import { IPublicClientApplication, SilentRequest } from "@azure/msal-browser";

// Function to prepare and retrieve an access token
export async function prepareToken(instance: IPublicClientApplication) {
  // Retrieve the first account from the instance
  const account = instance.getAllAccounts()[0];

  // Define the access token request
  const accessTokenRequest: SilentRequest = {
    scopes: ["user.read"], // Scopes required for the token
    account: account, // Account to use for the request
  };

  // Acquire the token silently
  const tokenResponse = await instance.acquireTokenSilent(accessTokenRequest);

  // Return the ID token from the token response
  return tokenResponse.idToken;
}
