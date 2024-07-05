const number = 10230000;

function fibonacci(n: number): bigint {
  let n1: bigint = BigInt(0);
  let n2: bigint = BigInt(1);

  if (n === 0) {
    return n1;
  }

  for (let i = 2; i <= n; i++) {
    const nextTerm: bigint = n1 + n2;
    n1 = n2;
    n2 = nextTerm;
  }
  return n2;
}

console.time("fibonacci");
const result = fibonacci(number);
console.log("Số Fibonacci thứ", number, "là:", result.toString());
console.timeEnd("fibonacci");
