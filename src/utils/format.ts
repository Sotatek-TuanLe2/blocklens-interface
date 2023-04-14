export function formatNumberToCurrency(number: number): string {
  const lookup: { [key: number]: string } = {
    1e3: 'K',
    1e6: 'M',
    1e9: 'B',
    1e12: 'T',
    1e15: 'P',
    1e18: 'E',
  };

  const absNumber = Math.abs(number);

  for (const value in lookup) {
    if (absNumber >= parseInt(value)) {
      return (number / parseInt(value)).toFixed(0) + lookup[value];
    }
  }

  return number.toString();
}
