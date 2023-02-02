import configuration from '~/configuration';
import { parseCookies, setCookie } from 'nookies';

const THEME_KEY = `theme`;
const LIGHT_THEME_META_COLOR = configuration.site.themeColor;
const DARK_THEME_META_COLOR = configuration.site.themeColorDark;

export const DARK_THEME_CLASSNAME = `dark`;
export const LIGHT_THEME_CLASSNAME = `light`;
const SYSTEM_THEME_CLASSNAME = '';

/**
 * @name getStoredTheme
 * @description Get the stored theme from the cookies
 */
export function getStoredTheme() {
  return parseCookies(null)['theme'];
}

export function setTheme(theme: string | null) {
  const root = getHtml();

  if (theme === SYSTEM_THEME_CLASSNAME || theme === '') {
    setCookie(null, THEME_KEY, '');
    root.classList.remove(DARK_THEME_CLASSNAME);
    root.classList.remove(LIGHT_THEME_CLASSNAME);
  }

  switch (theme) {
    case SYSTEM_THEME_CLASSNAME:
      if (isDarkSystemTheme()) {
        root.classList.add(DARK_THEME_CLASSNAME);
      } else {
        root.classList.remove(DARK_THEME_CLASSNAME);
      }

      return;

    case DARK_THEME_CLASSNAME:
      root.classList.add(DARK_THEME_CLASSNAME);
      setMetaTag(DARK_THEME_META_COLOR);
      setCookie(null, THEME_KEY, DARK_THEME_CLASSNAME);

      return;

    case LIGHT_THEME_CLASSNAME:
      root.classList.remove(DARK_THEME_CLASSNAME);
      setMetaTag(LIGHT_THEME_META_COLOR);
      setCookie(null, THEME_KEY, LIGHT_THEME_CLASSNAME);

      return;
  }
}

export function loadSelectedTheme() {
  setTheme(getStoredTheme());
}

function getHtml() {
  return document.firstElementChild as HTMLHtmlElement;
}

function getThemeMetaTag() {
  return document.querySelector(`meta[name='theme-color']`);
}

/**
 * @name setMetaTag
 * @description Set the theme color meta tag when the theme changes. This is
 * useful for Safari and PWAs since it will change the color of the status bar
 * @param value
 */
function setMetaTag(value: string) {
  const callback = () => {
    let tag = getThemeMetaTag();

    if (tag) {
      tag.setAttribute('content', value);
    } else {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'theme-color');
      tag.setAttribute('content', value);
      document.head.appendChild(tag);
    }
  };

  if (document.readyState === 'complete') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

export function isDarkSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)');
}
