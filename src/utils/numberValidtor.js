export  function isFloat (str) {
  // Check if the parsed float value, when converted back to a string, matches the original string
  const parsedFloat = parseFloat(str);
  const floatRegex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

  // If the string matches the float regex, it means the string is a float
  const isFloat = floatRegex.test(str);

  return isFloat && !isNaN(parsedFloat);
}

export function isInt (str) {
  // Check if the parsed integer value, when converted back to a string, matches the original string
  const parsedInt = parseInt(str, 10);
  const intRegex = /^[-+]?\d+$/;

  // If the string matches the int regex, it means the string is an integer
  const isInt = intRegex.test(str);

  return isInt && !isNaN(parsedInt);
}