import React, {useState, useEffect} from 'react'
import "./home.css";
function Home() {
  const[amount, setAmount]= useState(1000);
  const[message, setMessage]= useState("");
  const[diceRoll, setDiceRoll]= useState(null);
  const[betamount, setbetamount]= useState("");
  const [hash, setHash] = useState("");
  useEffect(() => {
    const storedamount = localStorage.getItem("amount");
    if (storedamount) setAmount(Number(storedamount));
}, []);

// Update amount in localStorage
useEffect(() => {
    localStorage.setItem("amount", amount);
}, [amount]);

const generateClientSeed = () => {
    return Math.random().toString(36).substring(2, 15);
};
const handleRollDice = async () => {
  if (!betamount || betamount <= 0 || betamount > amount) {
      setMessage("Enter a valid bet amount");
      return;
  }

  const clientSeed = generateClientSeed(); // Generate a new client seed

  try {
      const response = await fetch("http://localhost:8000/roll-dice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ betamount: Number(betamount), amount, clientSeed }),
      });

      const data = await response.json();

      if (data.error) {
          setMessage(data.error);
      } else {
          setDiceRoll(data.n);
          setAmount(data.newamount);
          setHash(data.hash);
          setMessage(`Rolled: ${data.n} - ${data.n >= 4 ? "You Win!" : "You Lose!"}`);
      }
  } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong");
  }
};

  return (
    <div className='div'>
        <h1>Welcome Lets check you luck!!</h1>
        <input type="text" placeholder='Enter the bet amount' value={betamount} onChange={(e)=>setbetamount(e.target.value)}></input>
        <button type="submit" onClick={handleRollDice}>Roll Dice</button>
        <button type="submit">Available amount:${amount}</button>
        {diceRoll!=null && <p>{message}</p>}
        
    </div>
  )
}

export default Home