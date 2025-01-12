export const config = {
  us: {
    domains: [".gov", ".mil"],
  },
  uk: {
    domains: [".gov.uk"],
  },
  br: {
    domains: [".gov.br"],
  },
} as const;

export const allowedExtensions = Object.values(config)
  .map((country) => country.domains)
  .flat();
