import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

function isObject(item: any): boolean {
  return !!(item && typeof item === 'object' && !Array.isArray(item));
}

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        if (!(key in target)) {
          output[key] = source[key];
        }
      }
    });
  }
  return output;
}

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const localeMessages = (await import(`../../messages/${locale}.json`)).default;

  // Perform deep merge fallback to English if not in English locale
  let messages = localeMessages;
  if (locale !== 'en') {
    const fallbackMessages = (await import(`../../messages/en.json`)).default;
    messages = deepMerge(localeMessages, fallbackMessages);
  }

  return {
    locale,
    messages
  };
});
