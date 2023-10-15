const parseData = (data) => {
  // remove empty lines
  const filteredData = data.filter((line) => line !== '' && line !== 'Fichier');
  // clean lines
  const cleanedData = filteredData.map((line) => line.trim());
  // remove first line
  cleanedData.shift();
  // remove duplicate lines
  const uniqueData = [...new Set(cleanedData)];
  return uniqueData;
};

const parseDateInString = (str) => {
  const dateRegex = /(\d{2})\/(\d{2})\/(\d{4})/;
  const matches = str.match(dateRegex);
  if (matches) {
    // if there is a date in the string, return it
    const [day, month, year] = matches.slice(1);
    return new Date(year, month - 1, day);
  }
  return null;
};

export {
  parseData,
  parseDateInString,
};
