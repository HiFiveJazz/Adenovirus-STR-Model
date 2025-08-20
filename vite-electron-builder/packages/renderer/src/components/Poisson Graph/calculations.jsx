// factorial + Poisson PMF (Excel: POISSON(x, λ, FALSE))
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function poisson(x, lambda) {
  return (Math.pow(lambda, x) * Math.exp(-lambda)) / factorial(x);
}
