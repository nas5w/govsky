export const config = {
  us: {
    name: "United States",
    domains: [".gov", ".mil"],
  },
  uk: {
    name: "United Kingdom",
    domains: [".gov.uk"],
  },
  br: {
    name: "Brazil",
    domains: [".gov.br"],
  },
} as const;

export const allowedExtensions = Object.values(config)
  .map((country) => country.domains)
  .flat();

export type GovskyConfig = typeof config;
