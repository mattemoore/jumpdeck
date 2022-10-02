import { isBrowser } from '~/core/generic/is-browser';
import configuration from '~/configuration';

const THEME_LOCAL_STORAGE_KEY = `theme`;
const LIGHT_THEME_META_COLOR = configuration.site.themeColor;
const DARK_THEME_META_COLOR = configuration.site.themeColorDark;

export const DARK_THEME_CLASSNAME = `dark`;

export function loadThemeFromLocalStorage() {
  if (isBrowser()) {
    return localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
  }

  return '';
}

export function setTheme(theme: string | null) {
  const root = getHtml();

  if (theme) {
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);
    root.classList.add(theme);
    setMetaTag(DARK_THEME_META_COLOR);
  } else {
    localStorage.removeItem(THEME_LOCAL_STORAGE_KEY);
    root.classList.remove(DARK_THEME_CLASSNAME);
    setMetaTag(LIGHT_THEME_META_COLOR);
  }
}

export function loadSelectedTheme() {
  setTheme(loadThemeFromLocalStorage());
}

function getHtml() {
  return document.firstElementChild as HTMLHtmlElement;
}

function getThemeMetaTag() {
  return document.querySelector(`meta[name='theme-color']`);
}

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
