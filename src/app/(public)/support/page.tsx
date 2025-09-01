import { api } from "@/api";
import { DOMAIN } from "@/utils/constants";
import SupportContainer from "./SupportContainer";

const Support = async() => {

    const response = await api.home.fetchDomainDetails({
      params: { name: DOMAIN },
    });

  return (
    <SupportContainer {...{
      domainDetails: response.data?.data || {},
    }} />
  )
}

export default Support
