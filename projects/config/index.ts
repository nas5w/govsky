export const config = {
  au: {
    name: "Australia",
    domains: [".gov.au"],
  },
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
  fr: {
    name: "France",
    domains: [".gouv.fr", ".senat.fr", ".service-public.fr"],
  },
  je: {
    name: "Island of Jersey",
    domains: [".gov.je"],
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
