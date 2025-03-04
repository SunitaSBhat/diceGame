const express= require("express");
const cors= require("cors");
const crypto = require("crypto");
const app=express();
const port= 8000;
app.use(express.json()); 
app.use(cors(
    {
    origin:["https://dice-game-7elp.vercel.app"],
    methods:["POST", "GET"],
    credentials:true
    }

));
const SERVER_SEED = "secret-server-seed";
app.get("/", (req, res)=>{
    return res.json("server running");
});
app.post("/roll-dice", (req, res)=>{
    const {betamount, amount,  clientSeed }= req.body;
    const hash = crypto.createHash("sha256").update(SERVER_SEED + clientSeed).digest("hex");

    // Convert hash to a number (0-5), then shift to 1-6 range
    const n = (parseInt(hash.substring(0, 8), 16) % 6) + 1;
    let newamount=amount;
   
if(!betamount || betamount>amount){
    return res.status(400).json({error: "invalid bet amount"});
}
    else if(n<4){
        newamount=newamount-betamount;
    }
    else{
        newamount=newamount+betamount;
    }
    res.json({n, newamount, hash });
})
app.listen(port, ()=>{
    console.log(`server running on ${port}`);
})