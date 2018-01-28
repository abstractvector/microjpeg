import fs from 'fs';

import jpeg from 'jpeg-js';

export default class Deflator {
  constructor(quality) {
    this.quality = quality || 50;

    const empty = jpeg.encode({ width: 0, height: 0, data: '' }, this.quality).data;
    
    this.marker = Buffer.from('ffda000c03010002110311003f00', 'hex');

    this.header = empty.slice(0, empty.lastIndexOf(this.marker) + this.marker.byteLength);
    this.footer = Buffer.from('ffd9', 'hex');
  }

  getHeader(encoding = null) {
    return encoding === null ? this.header : this.header.toString(encoding);
  }

  getFooter(encoding = null) {
    return encoding === null ? this.footer : this.footer.toString(encoding)
  }

  async microsize(file, encoding = null) {
    return await this.microsizeSync(file, encoding);
  }

  microsizeSync(file, encoding = null) {
    if ('string' === typeof file) {
      file = fs.readFileSync(file);
    } else if (!Buffer.isBuffer(file)) {
      throw new Error(`Provided file should be a filepath string or data Buffer, but received ${typeof file}`);
    }

    const image = this.deflateFromJpeg(file);
    return encoding === null ? image.image : image.image.toString(encoding);
  }

  deflateFromJpeg(buffer) {
    return this.deflate(jpeg.decode(buffer));
  }

  deflate({ width, height, data }) {
    const wholeImage = jpeg.encode({ width, height, data }, this.quality).data;

    return {
      width,
      height,
      wholeImage,
      header: wholeImage.slice(0, wholeImage.lastIndexOf(this.marker) + this.marker.byteLength),
      image: wholeImage.slice(wholeImage.lastIndexOf(this.marker) + this.marker.byteLength, -1 * this.footer.byteLength),
      footer: this.footer,
    }
  }
}
