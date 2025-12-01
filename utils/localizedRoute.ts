const localizedRoute = (path: string) => {
  const localeCountry = "en-EG";
  return `/${localeCountry}${path}`;
};

export { localizedRoute };
