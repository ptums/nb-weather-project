import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToggleViewProvider } from "./context/toggle-view-context.tsx";
import { WeatherDataProvider } from "./context/weather-data-context.tsx";
import { WeatherQueriesProvider } from "./context/weather-queries-context.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WeatherDataProvider>
        <WeatherQueriesProvider>
          <ToggleViewProvider>
            <App />
          </ToggleViewProvider>
        </WeatherQueriesProvider>
      </WeatherDataProvider>
    </QueryClientProvider>
  </StrictMode>
);
