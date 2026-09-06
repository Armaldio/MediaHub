import kinopoiskIcon from "../../assets/apps/images/kinopoisk/assets/play_store.png";
import { Service } from "../../types/index";

export const kinopoisk: Service = {
  id: "kinopoisk",
  name: "Kinopoisk",
  description: "Russian movie database",
  icon: kinopoiskIcon,
  websiteUrl: "https://www.kinopoisk.ru",
  appUrl: "https://play.google.com/store/apps/details?id=ru.kinopoisk",
  androidAppId: "ru.kinopoisk",
  color: "#FF6600",
  deepLinks: [
    {
      name: "App",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.kinopoiskId,
      url: (data) => `https://www.kinopoisk.ru/film/${data.kinopoiskId}/`,
      requiresApp: true,
    },
    {
      name: "App",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.kinopoiskId,
      url: (data) => `https://www.kinopoisk.ru/series/${data.kinopoiskId}/`,
      requiresApp: true,
    },
    {
      name: "Web",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.kinopoiskId,
      url: (data) => `https://www.kinopoisk.ru/film/${data.kinopoiskId}/`,
    },
    {
      name: "Web",
      mediaType: "tv",
      enabled: (data) => data.type === "tv" && !!data.kinopoiskId,
      url: (data) => `https://www.kinopoisk.ru/series/${data.kinopoiskId}/`,
    },
  ],
};
