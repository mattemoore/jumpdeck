import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';

import ListBox, { ListBoxOptionModel } from '~/core/ui/ListBox/ListBox';
import ListBoxOption from '~/core/ui/ListBox/ListBoxOption';

const LanguageSwitcher: React.FC<{
  onChange?: (locale: string) => unknown;
}> = ({ onChange }) => {
  const { i18n } = useTranslation();
  const { language: currentLanguage } = i18n;
  const router = useRouter();
  const locales = router.locales ?? [currentLanguage];

  const languageNames = useMemo(() => {
    return new Intl.DisplayNames([currentLanguage], {
      type: 'language',
    });
  }, [currentLanguage]);

  const [value, setValue] = useState({
    value: i18n.language,
    label: capitalize(languageNames.of(currentLanguage) ?? currentLanguage),
  });

  const switchToLocale = useCallback(
    (locale: string) => {
      const path = router.asPath;

      return router.push(path, path, { locale });
    },
    [router]
  );

  const languageChanged = useCallback(
    async (option: ListBoxOptionModel<string>) => {
      setValue(option);

      const locale = option.value;

      if (onChange) {
        onChange(locale);
      }

      await switchToLocale(locale);
    },
    [switchToLocale, onChange]
  );

  return (
    <ListBox value={value} setValue={languageChanged}>
      {locales.map((locale) => {
        const label = capitalize(languageNames.of(locale) ?? locale);
        const option = {
          value: locale,
          label,
        };

        return <ListBoxOption key={locale} option={option} />;
      })}
    </ListBox>
  );
};

function capitalize(lang: string) {
  return lang.slice(0, 1).toUpperCase() + lang.slice(1);
}

export default LanguageSwitcher;
