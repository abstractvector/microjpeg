function inflator(header, footer, image) {
  return 'data:image/jpeg;base64,' + btoa(atob(header) + atob(image) + atob(footer));
};
