import { fetchTrialActivation } from '../../../services/course-service';
import EmailVerificationComponent from './EmailVerificationComponent';

const EmailVerification = async () => {
  const activationTrialData = await fetchTrialActivation({});

  return <EmailVerificationComponent data={activationTrialData} />;
};

export default EmailVerification;
