const truncateText = (text, maxLength) => {
  if (text == null || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

const capitalizeFirstLetter = (string) => {
  return string === null ? null : string.charAt(0).toUpperCase() + string.slice(1);
};

const camelCaseToWords = (string) => {
  if (string === null) return null;

  const result = string.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const spreadTrim = (str, char) => {
  const first = [...str].findIndex((c) => c !== char);
  const last = [...str].reverse().findIndex((c) => c !== char);
  return str.substring(first, str.length - last);
};

export { truncateText, capitalizeFirstLetter, camelCaseToWords, spreadTrim };
