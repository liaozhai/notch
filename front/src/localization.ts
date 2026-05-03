import {
    allLocales,
    sourceLocale,
    targetLocales,
} from "./generated/locale-codes";
import {
    msg,
    str,
    localized,
    configureLocalization,
    updateWhenLocaleChanges,
} from "@lit/localize";

const { setLocale, getLocale } = configureLocalization({
    sourceLocale,
    targetLocales,
    loadLocale: (locale) => import(`./generated/locales/${locale}.ts`),
});

export {
    msg,
    str,
    updateWhenLocaleChanges,
    localized,
    allLocales,
    sourceLocale,
    targetLocales,
    setLocale,
    getLocale,
};
