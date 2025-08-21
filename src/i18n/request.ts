import { getRequestConfig } from 'next-intl/server';
import { LanguageService } from '../services/language-service';

export default getRequestConfig(async () => {

  const languages = await LanguageService.getLanguages();

  const localeCode = await LanguageService.getEffectiveLanguageId();
  const locale = languages.find(lang => lang.id === localeCode)?.code || 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
