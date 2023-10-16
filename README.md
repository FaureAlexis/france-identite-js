# france-identite-js

This is a JavaScript library to validate French identity using the governement new service [France Identité](https://france-identite.gouv.fr/).

The lib is currently using Selenium, but I am currently working on using the API.

## Installation

```bash
npm install france-identite-js
```

## Usage

```javascript
/* eslint-disable no-console */
import verify from './lib/index.js';

const verificationsTodo = [
  {
    user: 'Stéphane Gully',
    file: 'attestation.pdf',
  },
  {
    user: 'Yves Volvic',
    file: 'attestation.pdf',
  },
  {
    user: 'John Doe',
    file: 'test.pdf',
  },
];

const run = async () => {
  const results = await verify(verificationsTodo);
  console.log(results);
};

run();
```
