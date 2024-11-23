import { WEAHTER_DATA_ENDPOINT, WEAHTER_QUERY_ENDPOINT } from "./constants";
import { PayloadTypes } from "./types";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log({ API_BASE_URL });
export const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;

/* Weather Queries requests */
export async function createWeatherQueries(query: string, userId: string) {
  const url = buildApiUrl(WEAHTER_QUERY_ENDPOINT);
  const payload = { query, userId };
  const data = await postResponse(url, payload);

  return data;
}

export async function findWeatherQueriesById(queryId: number) {
  const path = `${WEAHTER_QUERY_ENDPOINT}/i/${queryId}`;
  const url = buildApiUrl(path);

  const data = getResponse(url);

  return [...(await data)];
}

export async function searchWeatherQueries(query: string) {
  const path = `${WEAHTER_QUERY_ENDPOINT}/s?query=${query}`;
  const url = buildApiUrl(path);

  const data = await getResponse(url);

  return [...data];
}

export async function findWeatherQueriesByUserId(userId: string) {
  const path = `${WEAHTER_QUERY_ENDPOINT}/u/${userId}`;
  const url = buildApiUrl(path);

  const data = getResponse(url);

  return [...(await data)];
}

export async function deleteWeatherQueries(queryId: number) {
  const path = `${WEAHTER_QUERY_ENDPOINT}/i/${queryId}`;
  const url = buildApiUrl(path);

  const data = deleteResponse(url);

  return [...(await data)];
}

/* Weather Data requests */
export async function createWeatherData(query: string, queryId: number) {
  const url = buildApiUrl(WEAHTER_DATA_ENDPOINT);

  const payload = { query, queryId };
  const data = postResponse(url, payload);

  return [...(await data)];
}

export async function findWeatherDataById(queryId: number) {
  const path = `${WEAHTER_DATA_ENDPOINT}/i/${queryId}`;
  const url = buildApiUrl(path);

  const data = await getResponse(url);

  return [...data];
}

/** HELPERS  */
async function getResponse(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

async function postResponse(url: string, payload: PayloadTypes) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

async function deleteResponse(url: string) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}
