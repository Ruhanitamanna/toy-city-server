const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT ||5000;


// Middleware

app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('TOY CITY IS RUNNING')
});


app.listen(port,()=>{
    console.log(`Toy city is running on port, ${port}`)
})
