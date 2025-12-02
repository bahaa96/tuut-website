import * as m from "@/src/paraglide/messages";

const getCurrencyFromCountryCode = (countryCode: string) => {
  switch (countryCode) {
    case "EG":
      return m.EGP();
    case "SA":
      return m.SAR();
    case "JO":
      return m.JOD();
    case "KW":
      return m.KWD();
    case "MA":
      return m.MAD();
    case "OM":
      return m.OMR();
    case "QA":
      return m.QAR();
    case "AE":
      return m.AED();
    default:
      return m.UNKNOWN_CURRENCY();
  }
};

export default getCurrencyFromCountryCode;
