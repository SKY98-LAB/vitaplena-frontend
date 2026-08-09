import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import env from '../config/env';

const REDIRECION_AUTH_NATIVO = 'vitaplena://auth/callback';

function esNativo() {
  return Boolean(window.Capacitor?.isNativePlatform?.());
}

function getOAuthRedirectUrl() {
  return esNativo() ? REDIRECION_AUTH_NATIVO : env.redirectUrl;
}

async function openUrl(url) {
  if (esNativo()) {
    await Browser.open({ url });
  } else {
    window.location.href = url;
  }
}

async function cerrarBrowser() {
  if (esNativo()) {
    await Browser.close();
  }
}

function onUrlAbierto(callback) {
  if (!esNativo()) {
    return () => {};
  }
  let manejador = null;
  App.addListener('appUrlOpen', (event) => {
    callback(event.url);
  }).then((h) => {
    manejador = h;
  });
  return () => {
    if (manejador) {
      manejador.remove();
    }
  };
}

function getHash() {
  return window.location.hash;
}

function replaceHash() {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

function showAlert(message) {
  window.alert(message);
}

function showPrompt(message) {
  return window.prompt(message);
}

export {
  esNativo,
  getOAuthRedirectUrl,
  openUrl,
  cerrarBrowser,
  onUrlAbierto,
  getHash,
  replaceHash,
  showAlert,
  showPrompt,
};
