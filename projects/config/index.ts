export const config = {
  at: {
    name: "Austria",
    domains: [".gv.at"],
  },
  au: {
    name: "Australia",
    domains: [".gov.au"],
  },
  ba: {
    name: "Bosnia & Herzegovina",
    domains: [".gov.ba"],
  },
  be: {
    name: "Belgium",
    domains: [".belgium.be", ".vlaanderen.be", ".wallonie.be"],
  },
  br: {
    name: "Brazil",
    domains: [".gov.br"],
  },
  ca: {
    name: "Canada",
    domains: [".gc.ca", ".canada.ca"],
  },
  ch: {
    name: "Switzerland",
    domains: [".admin.ch"],
  },
  co: {
    name: "Colombia",
    domains: [".gov.co"],
  },
  cz: {
    name: "Czechia",
    domains: [".gov.cz"],
  },
  de: {
    name: "Germany",
    domains: [".bund.de", ".bundesregierung.de", ".bundestag.de", ".diplo.de", ".bundeswehr.de"],
  },
  es: {
    name: "Spain",
    domains: [".gob.es"],
  },
  eu: {
    name: "European Union",
    domains: [".europa.eu"],
  },
  fr: {
    name: "France",
    domains: [".gouv.fr", ".senat.fr", ".service-public.fr"],
  },
  hr: {
    name: "Croatia",
    domains: [".gov.hr"],
  },
  ie: {
    name: "Ireland",
    domains: [".gov.ie"],
  },
  int: {
    name: "Intergovernmental",
    domains: [".int"],
  },
  je: {
    name: "Island of Jersey",
    domains: [".gov.je"],
  },
  jp: {
    name: "Japan",
    domains: [".go.jp", ".lg.jp", ".metro.tokyo.jp"],
  },
  lu: {
    name: "Luxembourg",
    domains: [".etat.lu", ".public.lu", ".gouvernement.lu", ".monarchie.lu", ".chd.lu"],
  },
  me: {
    name: "Montenegro",
    domains: [".gov.me"],
  },
  mk: {
    name: "North Macedonia",
    domains: [".gov.mk"],
  },
  my:  {
    name: "Malaysia",
    domains: [".gov.my"]
  },
  ph: {
    name: "Philippines",
    domains: [".gov.ph"],
  },
  pl: {
    name: "Poland",
    domains: [".gov.pl"],
  },
  pt: {
    name: "Portugal",
    domains: [".gov.pt"],
  },
  rs: {
    name: "Serbia",
    domains: [".gov.rs"],
  },
  sg: {
    name: "Singapore",
    domains: [".gov.sg"],
  },
  si: {
    name: "Slovenia",
    domains: [".gov.si"],
  },
  ua: {
    name: "Ukraine",
    domains: [".gov.ua"],
  },
  uk: {
    name: "United Kingdom",
    domains: [".gov.uk", ".parliament.uk", ".gov.scot", ".gov.wales", ".parliament.scot", ".senedd.wales", ".senedd.cymru"],
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
