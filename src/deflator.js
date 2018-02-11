import fs from 'fs';

import sharp from 'sharp';
import jpeg from 'jpeg-js';

export default class Deflator {
  constructor(quality) {
    this.quality = quality || 40;

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

  async microsize(file, width, height) {
    if ('string' === typeof file) {
      file = fs.readFileSync(file);
    } else if (!Buffer.isBuffer(file)) {
      throw new Error(`Provided file should be a filepath string, but received ${typeof file}`);
    }

    const image = await this.deflateFromJpeg(file, width, height);
    return image.preview.toString('base64');
  }

  async deflateFromJpeg(buffer, width, height) {
    let rawImageData = jpeg.decode(buffer);
    if (rawImageData.width !== width || rawImageData.height !== height) {
      rawImageData = jpeg.decode(
        await sharp(buffer).resize(width, height).jpeg({ quality: this.quality }).toBuffer()
      )
    }
    return this.deflate(rawImageData);
  }

  deflate({ width, height, data }) {
    const wholeImage = jpeg.encode({ width, height, data }, this.quality).data;

    return {
      width,
      height,
      wholeImage,
      header: wholeImage.slice(0, wholeImage.lastIndexOf(this.marker) + this.marker.byteLength),
      preview: wholeImage.slice(wholeImage.lastIndexOf(this.marker) + this.marker.byteLength, -1 * this.footer.byteLength),
      footer: this.footer,
    }
  }
}
