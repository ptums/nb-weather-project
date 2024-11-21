import { WEAHTER_DATA_ENDPOINT, WEAHTER_QUERY_ENDPOINT } from "./constants";
import { PayloadTypes } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

/* Weather Queries requests */
export async function createWeatherQueries(query: string, userId: string) {
  const url = `${API_URL}${WEAHTER_QUERY_ENDPOINT}`;
  const payload = { query, userId };
  const data = await postResponse(url, payload);

  return data;
}

export async function findWeatherQueriesById(queryId: number) {
  const url = `${API_URL}${WEAHTER_QUERY_ENDPOINT}/i/${queryId}`;

  const data = getResponse(url);

  return [...(await data)];
}

export async function searchWeatherQueries(query: string) {
  const url = `${API_URL}${WEAHTER_QUERY_ENDPOINT}/s?query=${query}`;

  const data = await getResponse(url);

  return [...data];
}

export async function findWeatherQueriesByUserId(userId: string) {
  const url = `${API_URL}${WEAHTER_QUERY_ENDPOINT}/u/${userId}`;

  const data = getResponse(url);

  return [...(await data)];
}

export async function deleteWeatherQueries(queryId: number) {
  const url = `${API_URL}${WEAHTER_QUERY_ENDPOINT}/i/${queryId}`;

  const data = deleteResponse(url);

  return [...(await data)];
}

/* Weather Data requests */
export async function createWeatherData(query: string, queryId: number) {
  const url = `${API_URL}${WEAHTER_DATA_ENDPOINT}`;
  const payload = { query, queryId };
  const data = postResponse(url, payload);

  return [...(await data)];
}

export async function findWeatherDataById(queryId: number) {
  const url = `${API_URL}${WEAHTER_DATA_ENDPOINT}/i/${queryId}`;

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
