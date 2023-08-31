export const convertToFormattedDate = (inputDateString: string): string => {
  const year = inputDateString.substr(0, 4);
  const month = inputDateString.substr(4, 2);
  const day = inputDateString.substr(6, 2);
  return `${year}-${month}-${day}`;
};
