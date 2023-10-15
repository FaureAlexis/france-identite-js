import verify from "./lib/index.js";

const verificationsTodo = [
  {
    'user': 'Elliot Janvier',
    'file': 'attestation.pdf',
  },
  {
    'user': 'Alexis Faure',
    'file': 'attestation.pdf',
  },
  {
    'user': 'John Doe',
    'file': 'test.pdf',
  }
]

const run = async () => {
  const results = await verify(verificationsTodo);
  console.log(results);
}

run();