import { isBrowser } from '~/core/generic/is-browser';
import { useEffect } from 'react';

const THEME_LOCAL_STORAGE_KEY = `theme`;
const DARK_THEME_META_COLOR = `#0a0a0a`;
const LIGHT_THEME_META_COLOR = `#fff`;

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

function loadSelectedTheme() {
  setTheme(loadThemeFromLocalStorage());
}

export function useLoadSelectedTheme() {
  useEffect(loadSelectedTheme);
}

function getHtml() {
  return document.firstElementChild as HTMLHtmlElement;
}

function getThemeMetaTag() {
  return document.querySelector(`meta[name='theme-color']`);
}

function setMetaTag(value: string) {
  const tag = getThemeMetaTag();

  if (tag) {
    tag.setAttribute('content', value);
  }
}
