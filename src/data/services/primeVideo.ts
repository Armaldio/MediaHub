import primeVideoIcon from "../../assets/apps/images/prime_video/assets/play_store.png";
import { Service } from "../../types/index";

export const primeVideo: Service = {
  id: "prime_video",
  name: "Prime Video",
  description: "Amazon's streaming service",
  icon: primeVideoIcon,
  websiteUrl: "https://primevideo.com",
  appUrl:
    "https://play.google.com/store/apps/details?id=com.amazon.avod.thirdpartyclient",
  androidAppId: "com.amazon.avod.thirdpartyclient",
  color: "#00A8E1",
  deepLinks: [
    {
      name: "App",
      mediaType: "all",
      enabled: (data) => !!data.amazonPrimeId,
      url: (data) => `aiv://aiv/resume?asin=${data.amazonPrimeId}`,
    },
    {
      name: "Website",
      mediaType: "all",
      enabled: (data) => !!data.amazonPrimeId,
      url: (data) =>
        `https://www.amazon.com/gp/video/detail/${data.amazonPrimeId}/`,
    },
  ],
};