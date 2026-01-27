export const SITE = {
  website: "https://irving-frias.github.io/", // replace this with your deployed domain
  author: "Irving Frias",
  profile: "https://github.com/irving-frias/irving-frias",
  desc: "Senior Drupal Full-Stack Developer specializing in modern Drupal development. Expertise includes SDC theming, multisite architecture, custom modules, and DevOps automation. Available for complex Drupal projects.",
  title: "Irving Frias",
  ogImage: "og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Mazatlan", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
