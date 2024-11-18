import { PayloadTypes } from "./types";

export async function fetchMonthWeatherData(month: number, year: number) {
  const url = `${process.env.NEXT_PUBLIC_VITE_API_URL}/api/weather/month`;
  const payload = { month, year };
  const data = postResponse(url, payload);

  return [...(await data)];
}

export async function fetchMonthsYearsId(month: number, year: number) {
  const url = `${process.env.NEXT_PUBLIC_VITE_API_URL}/api/weather/month/id/${month}/${year}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function fetchSideBarMonthsYears(
  userId: string,
  category: string
) {
  const url = `${process.env.NEXT_PUBLIC_VITE_API_URL}/api/sidebars/months/${userId}/${category}`;
  const data = getResponse(url);

  return [...(await data)];
}

export async function fetchSideBar(
  userId: string,
  category: string,
  monthYearId: number
) {
  const url = `${process.env.NEXT_PUBLIC_VITE_API_URL}/api/sidebars/create`;
  const payload = { userId, category, monthYearId };
  const data = postResponse(url, payload);

  return data;
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
