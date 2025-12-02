const changeURLLocale = (url: string, newLocale: string) => {
  // replace locale in the locale country in the url with the new locale
  const trimmedURL = url.replace(/^https?:\/\//, "");
  const localeCountry = trimmedURL.split("/")[1];
  const locale = localeCountry.split("-")[0];
  console.log("url:", trimmedURL);
  console.log("locale:", locale);
  console.log("localeCountry:", localeCountry);
  const newLocaleCountry = localeCountry.replace(locale, newLocale);
  console.log("newLocaleCountry:", newLocaleCountry);
  const newUrl = url.replace(localeCountry, newLocaleCountry);
  console.log("newUrl:", newUrl);
  return newUrl;
};

export default changeURLLocale;
