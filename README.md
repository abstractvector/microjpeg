# MicroJPEG

Deliver micro-sized images to clients by decoupling a static JPEG header.

Inspired by Facebook's approach to delivering previews of cover photos, this library creates JPEG images with a static header and footer that can be stored statically in the client. It is designed for use on very small images (e.g. 32x32 pixels) where the header can be several times larger than the image data itself.

The image data can easily be delivered to the client in an API response as base64 encoded ASCII data, reassembled with the header and footer and displayed to the user whilst the full image downloads. This can work especially well with a Gaussian blur filter to mask the low resolution and low JPEG quality.

## Installation

This module can be installed with npm:

    $ npm install microjpeg

## Usage

The module exposes two classes - the `Deflator` and`Inflator`. These can both be imported from the module or directly from `lib/deflator` and `lib/inflator`.

```
import { Deflator, Inflator } from 'microjpeg';

// or

import Deflator from 'microjpeg/lib/deflator';
import Inflator from 'microjpeg/lib/inflator';
```

The structure is intended such that the `Deflator` is run on the server to produce the `header`, `footer` and image data, whereas the `Inflator` is run on the client to reassemble the image.

### Deflator

The `Deflator` class takes a JPEG image and breaks it apart into its header, dynamic data and footer. The header is consistent for a given JPEG quality, the sole argument passed into the constructor. The header will be created assuming image size 0x0 but the true height and width are patched in by the `Inflator` later.

```
import { Deflator } from 'microjpeg';

const deflator = new Deflator(50); // 50 represents the JPEG quality from 0-100

const header = deflator.getHeader('base64');
console.log(header);
// static header for 0x0 image as a base64 encoded ASCII string
// /9j/4AAQSkZJRgABAQAAAQABtfY2dri4+Tl5...AAhEDEQA/AA==

const footer = deflator.getFooter('base64');
console.log(footer);
// static footer for image as a base64 encoded ASCII string
// /9k=

const filePath = './path/to/my-small-image.jpg';
const image = deflator.microsizeSync(filePath, 'base64');

console.log(image);
// the dynamic image data as a base64 encoded ASCII string
// rfZjjkV6h5lhfs3tRdBYUWue1FxcofZD6UXD...V7HrWkUQ2fw==
```

In the example above, the `header` and `footer` should be stored in the client to be used when we want to _inflate_ the image later - these will always be identical for the same quality value passed into the `Deflator` constructor. The dynamic `image` is what can be returned in the API.

#### new Deflator(quality)

The constructor expects a single argument which defines the JPEG quality to use on a scale of 0-100. As a guide, a quality of 50 is a good starting point.

```
import { Deflator } from 'microjpeg';

const deflator = new Deflator(
  50 // JPEG quality from 0-100
);
```

#### deflator.getHeader()

#### deflator.getFooter()

#### deflator.microsize(file, encoding = null)

#### deflator.microsizeSync(file, encoding = null)

#### deflator.deflateFromJpeg(buffer)

#### deflator.deflate({ width, height, data })

### Inflator

## Contributing

MicroJPEG is written and maintained by Matt Knight. Contributions in the form of issues, feature requests and pull requests are always appreciated.

## License

This library is licensed under the MIT License, and full details can be found in the `LICENSE` file.
