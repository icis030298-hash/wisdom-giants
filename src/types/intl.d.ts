import en from '../../messages/en.json';

type Messages = typeof en;

declare global {
  // Enforce compile-time type-safety for translation keys based on en.json
  interface IntlMessages extends Messages {}
}
