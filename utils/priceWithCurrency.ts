import { useParams } from "next/navigation";
import * as m from "@/src/paraglide/messages";

const priceWithCountry = (price: number) => {
  const params = useParams();
  const localeCountry = params?.localeCountry as string;
  const country = localeCountry.split("-")[1];

  switch (country) {
    case "SA":
      return m.$amount_SAR(price);
    case "EG":
      return m.$amount_EGP(price);
    case "JO":
      return m.$amount_JOD(price);
    case "KW":
      return m.$amount_KWD(price);
    case "MA":
      return m.$amount_MAD(price);
    case "OM":
      return m.$amount_OMR(price);
    case "QA":
      return m.$amount_QAR(price);
    case "AE":
      return m.$amount_AED(price);
    default:
      return m.$amount_UNKNOWN_CURRENCY(price);
  }
};

export default priceWithCountry;
