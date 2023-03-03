function calculate(scores, utilization) {
  let min = Math.min(...scores);
  let max = Math.max(...scores);
  rates = []
  increment = utilization*(max-min)
  scores.forEach((score)=> {
    rates.push(utilization/((score-min+increment)/(max-min)))
  })
  return rates;

}
console.log(calculate([200,400,800,900],0.2));
