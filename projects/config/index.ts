export const config = {
  br: {
    name: "Brazil",
    domains: [".gov.br"],
  },
  ca: {
    name: "Canada",
    domains: [".gc.ca", ".canada.ca"],
  },
  co: {
    name: "Colombia",
    domains: [".gov.co"],
  },
  de: {
    name: "Germany",
    domains: [".bund.de", ".bundesregierung.de", ".bundestag.de"],
  },
  uk: {
    name: "United Kingdom",
    domains: [".gov.uk", ".parliament.uk"],
  },
  us: {
    name: "United States",
    domains: [".gov", ".mil"],
  },
} as const;

export const allowedExtensions = Object.values(config)
  .map((country) => country.domains)
  .flat();

export type GovskyConfig = typeof config;
