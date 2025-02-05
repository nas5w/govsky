export const config = {
  be: {
    name: "Belgium",
    domains: [".belgium.be"],
  },
  at: {
    name: "Austria",
    domains: [".gv.at"],
  },
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
  eu: {
    name: "European Union",
    domains: [".europa.eu"],
  },
  fr: {
    name: "France",
    domains: [".gouv.fr", ".senat.fr", ".service-public.fr"],
  },
  je: {
    name: "Island of Jersey",
    domains: [".gov.je"],
  },
  jp: {
    name: "Japan",
    domains: [".go.jp", ".lg.jp", ".metro.tokyo.jp"],
  },
  my:  {
    name: "Malaysia",
    domains: [".gov.my"]
  },
  ph: {
    name: "Philippines",
    domains: [".gov.ph"],
  },
  sg: {
    name: "Singapore",
    domains: [".gov.sg"],
  },
  ua: {
    name: "Ukraine",
    domains: [".gov.ua"],
  },
  uk: {
    name: "United Kingdom",
    domains: [".gov.uk", ".parliament.uk", ".gov.wales"],
  },
  us: {
    name: "United States",
    domains: [".gov", ".mil"],
  },
  vn: {
    name: "Vietnam",
    domains: [".gov.vn"],
  },
} as const;

export const allowedExtensions = Object.values(config)
  .map((country) => country.domains)
  .flat();

export type GovskyConfig = typeof config;
