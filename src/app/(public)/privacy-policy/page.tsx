import { api } from "@/api";
import PrivacyPolicyContainer from "./PrivacyPolicyContainer";
import { getDomain } from "@/utils/domain";

const PrivacyPolicy = async() => {
    const domain_value = await getDomain()
    const response = await api.home.fetchDomainDetails({
      params: { name: domain_value },
    });

  return (
    <PrivacyPolicyContainer {...{
      domainDetails: response.data?.data || {},
    }} />
  )
}

export default PrivacyPolicy
