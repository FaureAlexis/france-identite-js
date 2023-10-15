import { parseData, parseDateInString } from '../lib/utils.js';

describe('parseData', () => {
  it('should remove empty lines, trim lines, remove first line and remove duplicates', () => {
    const data = ['Fichier', ' ', 'test', 'test', 'Fichier'];
    const result = parseData(data);
    expect(result).toEqual(['test']);
  });
});

describe('parseDateInString', () => {
  it('should return a date if there is a date in the string', () => {
    const str = "Document valide jusqu'au 22/10/2023";
    const result = parseDateInString(str);
    expect(result).toEqual(new Date(2023, 9, 22));
  });

  it('should return null if there is no date in the string', () => {
    const str = "Document valide jusqu'au";
    const result = parseDateInString(str);
    expect(result).toBeNull();
  });
});
