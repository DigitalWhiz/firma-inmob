export const ASSETS = {
  brand: {
    logo: {
      primary: "/assets/brand/logo/logo.svg",
      light: "/assets/brand/logo/logo-light.svg",
      dark: "/assets/brand/logo/logo-dark.svg",
    },
    favicon: {
      icon: "/assets/brand/favicon/favicon.ico",
      apple: "/assets/brand/favicon/apple-touch-icon.png",
    },
    social: {
      og: "/assets/brand/social/og-image.png",
    },
  },
  advisors: {
    "sabina-acosta": {
      photo: "/assets/advisors/sabina-acosta/photo.webp",
    },
    "ezequiel-fernandez": {
      photo: "/assets/advisors/ezequiel-fernandez/photo.webp",
    },
    "aldo-fabricatore": {
      photo: "/assets/advisors/aldo-fabricatore/photo.webp",
    },
  },
} as const;

export function getAdvisorPhoto(slug: string): string {
  const advisor = ASSETS.advisors[
    slug as keyof typeof ASSETS.advisors
  ];
  return advisor?.photo ?? "/assets/advisors/placeholder.svg";
}
