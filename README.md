# LPDF

LPDF is a simple, lightweight PDF reader UI suitable for tablet use.

## Install

```bash
npm install lpdf
```

## Usage

### Local dependencies

To work, LPDF uses [PDF.js](https://github.com/mozilla/pdf.js). You can initialize it on your head.

```html
<script src="pdfjs/build/pdf.js"></script>
```

```js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/build/pdf.js';
```

If pdf.js is not initialized, LPDF will do so via JsDelivr

### Import

import the module

```js
import LPDF from './node_modules/lpdf/index.js'
```
