import { useRouter, usePathname } from 'next/navigation';
import PopUpModal from '@/shared/pop-up-modal';
import { ICONS } from '@/assets/icons';
import { useTranslations } from 'next-intl';

const FailedPaymentPopup = ({ open }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const handleClose = () => {
    router.replace(pathname);
  };

  return (
    <PopUpModal
      {...{ open }}
      type='error'
      onClose={handleClose}
      icon={ICONS.CloseCircle}
      message={t('payment_failed')}
      successButton={{
        text: t('validation_okay_button'),
        onClick: handleClose,
      }}
    />
  );
};

export default FailedPaymentPopup;
