function esNativo() {
  return Boolean(window.Capacitor?.isNativePlatform?.());
}

function openUrl(url) {
  window.open(url, '_blank');
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

export { openUrl, getHash, replaceHash, showAlert, showPrompt };
