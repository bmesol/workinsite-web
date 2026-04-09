const displayWithSegments = (string: string, segmentLength: number, separator: string = " "): string => {
  const regex = new RegExp(`.{1,${segmentLength}}`, "g");
  return string.match(regex)?.join(separator) || string;
};

export { displayWithSegments };
