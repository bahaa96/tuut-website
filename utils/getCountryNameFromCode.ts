import * as m from "@/src/paraglide/messages";

const getCountryNameFromCode = (code: string) => {
  switch (code) {
    case "EG":
      return m.EGYPT();
    case "SA":
      return m.SAUDI_ARABIA();
    case "JO":
      return m.JORDAN();
    case "KW":
      return m.KUWAIT();
    case "MA":
      return m.MOROCCO();
    case "OM":
      return m.OMAN();
    case "QA":
      return m.QATAR();
    case "AE":
      return m.UNITED_ARAB_EMIRATES();
    default:
      return m.UNKNOWN_COUNTRY();
  }
};

export { getCountryNameFromCode };
