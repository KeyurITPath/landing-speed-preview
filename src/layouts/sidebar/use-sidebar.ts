import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ICONS } from '@/assets/icons';
import { routes } from '@/utils/constants/routes';
import { USER_ROLE } from '@/utils/constants';
import { useTranslations } from 'next-intl';

const useSidebar = ({ onClose, user }: any) => {
  const pathname = usePathname();
  const t = useTranslations();
  const router = useRouter();

  const handleClick = useCallback(
    (e: any, path = '', id: string) => {
      if (path) {
        onClose();
        if (id === 'support') {
          window.open(path, '_blank', 'noopener,noreferrer');
        } else {
          router.push(path);
        }
        return;
      }
    },
    [router, onClose]
  );

  const handleActive = useCallback(
    (key: string) => {
      return pathname
        ?.split('/')
        ?.filter(val => !!val)
        ?.includes(key);
    },
    [pathname]
  );

  const sidebar = useMemo(
    () => [
      {
        id: 'dashboard',
        path: routes.private.dashboard,
        name: t('sidebar.dashboard'),
        icon: ICONS.HOME,
        handleClick,
        isActive: handleActive,
        isActiveKey: 'dashboard',
        mainIconSx: { width: '20px', height: '20px' },
        roles: [USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR],
      },
      {
        id: 'support',
        path: routes.public.support,
        name: t('sidebar.support'),
        icon: ICONS.GROUPS,
        handleClick,
        isActive: handleActive,
        isActiveKey: 'support',
        mainIconSx: { width: '20px', height: '20px' },
        roles: [USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR],
      },
      {
        id: 'settings-and-subscription',
        path: routes.private.settings_and_subscription,
        name: t('sidebar.settings_and_subscription'),
        icon: ICONS.SETTINGS,
        handleClick,
        isActive: handleActive,
        isActiveKey: 'settings-and-subscription',
        mainIconSx: { width: '20px', height: '20px' },
        roles: [USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR],
      },
    ],
    [handleActive, handleClick, t]
  );

  const isAccessible = useCallback(
    (data = [], role: string) => {
      return data.some(val => val === role && user?.is_verified);
    },
    [user?.is_verified]
  );

  const items = useMemo(() => {
    return sidebar.filter((val: any) => isAccessible(val.roles, user?.role));
  }, [isAccessible, sidebar, user?.role]);

  return {
    sidebar: items,
  };
};

export default useSidebar;
