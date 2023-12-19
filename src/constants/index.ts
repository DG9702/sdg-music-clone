import { FaceBookIcon, InstagramIcon, XIcon } from "~/assets/icons";

export const socialNetworkLinks = [
  {
    title: "Instagram",
    icon: InstagramIcon,
  },
  {
    title: "Github",
    icon: XIcon,
  },
  {
    title: "Facebook",
    icon: FaceBookIcon,
  },
];

export const bottomLinks = [
  {
    title: "Legal",
  },
  {
    title: "Privacy Center",
  },
  {
    title: "Privacy Policy",
  },
  {
    title: "Cookies",
  },
  {
    title: "About Ads",
  },
  {
    title: "Accessibility",
  },
];

export const topLinkGroups = [
  {
    title: "Company",
    links: [
      {
        title: "About",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "about",
        },
      },
      {
        title: "Jobs",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "jobs",
        },
      },
      {
        title: "For the Record",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "press",
        },
      },
    ],
  },
  {
    title: "Communities",
    links: [
      {
        title: "For Artists",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "artists",
        },
      },
      {
        title: "Developers",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "developers",
        },
      },
      {
        title: "Advertising",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "advertising",
        },
      },
      {
        title: "Investors",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "investors",
        },
      },
      {
        title: "Vendors",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "vendors",
        },
      },
      {
        title: "Spotify for Work",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "spotify_for_work",
        },
      },
    ],
  },
  {
    title: "Useful links",
    links: [
      {
        title: "Support",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "help",
        },
      },
      {
        title: "Free Mobile App",

        dataAttributes: {
          "data-ga-category": "menu",
          "data-ga-action": "free",
        },
      },
    ],
  },
];
