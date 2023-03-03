export function calculate(scores: [number], utilization: number) {
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const increment = utilization * (max - min)
  const rates = scores.map((score) => utilization / ((score - min + increment) / (max - min)));
  return rates;
}
