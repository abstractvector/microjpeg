export default class Inflator {
  constructor(header, footer) {
    this.atob = typeof atob === 'function' ? atob : encodedString => Buffer.from(encodedString, 'base64');
    this.btoa = typeof btoa === 'function' ? btoa : rawString => rawString.toString('base64');

    this.header = this.atob(header);
    this.footer = this.atob(footer);
  }

  inflate(data, width = 0, height = 0, includeBase64DataUri = true) {
    let header = this.header;
    const marker = Buffer.from('ffc000110800000000', 'hex');

    const heightWidth = Buffer.from('ffc0001108' + height.toString(16).padStart(4, 0) + width.toString(16).padStart(4, 0), 'hex');
    let bytes = heightWidth.copy(header, header.lastIndexOf(marker));
    
    const base64Data = Buffer.concat([header, this.atob(data), this.footer]).toString('base64');
    return includeBase64DataUri ? `data:image/jpeg;base64,${base64Data}` : base64Data;;
  }
}
