export default class Inflator {
  constructor(header, footer) {
    this.atob = typeof atob === 'function' ? atob : encodedString => Buffer.from(encodedString);
    this.btoa = typeof btoa === 'function' ? btoa : rawString => rawString.toString('base64');

    this.header = this.atob(header);
    this.footer = this.atob(footer);
  }

  inflate(data, width, height) {
    let header = this.header;
    // @todo replace height and width in the header with real values
    return `data:image/jpeg;base64,${Buffer.concat([header, this.atob(data), this.footer]).toString('base64')}`;
  }
}
