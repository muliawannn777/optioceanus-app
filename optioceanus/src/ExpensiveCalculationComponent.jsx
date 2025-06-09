import React, { useState, useMemo } from "react";

function calculateFactorial(n) {
  console.log(`Menghitung faktorial untuk ${n}...`);
  if (n < 0) return -1;
  if (n === 0) return 1;
  let result = 1;
  for (let i = n; i > 0; i--) {
    result *= i;
  }
  return result;
}

function ExpensiveCalculationComponent() {
  const [number, setNumber] = useState(10);
  const [text, setText] = useState("");

  const factorial = useMemo(() => {
    return calculateFactorial(number);
  }, [number]);

  return (
    <div
      style={{ border: "1px solid darkcyan", margin: "10px", padding: "10px" }}
    >
      <h3>Kalkulasi Mahal dengan useMemo</h3>
      <label>
        Masukkan angka untuk faktorial:
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(parseInt(e.target.value, 10) || 0)}
          style={{ marginRight: "5px" }}
        />
      </label>
      <p>
        Faktorial dari {number} adalah {factorial}
      </p>
      <hr />
      <label>
        Input teks (tidak memengaruhi faktorial):
        <input
         type="text"
         value={text}
         onChange={(e) => setText(e.target.value)}
         style={{ marginRight: '5px'}} />
      </label>
      <p>Teks: {text}</p>
    </div>
  );
}

export default ExpensiveCalculationComponent;