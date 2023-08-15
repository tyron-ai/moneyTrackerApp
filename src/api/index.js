const express=require('express');
const cors=require('cors');
require('dotenv').config();
const Transaction=require('./models/Transaction.js');
const { default: mongoose } = require('mongoose');
const app=express();


app.use(cors());
app.use(express.json());
/*This is our test endpoint */
app.get('/api/test',(req,res)=>{
    res.json('test ok Tyron Nyambe');
});

/*Now we need an endpoint for posting our new transaction*/
/*This will be a post request*/
app.post('/api/transaction',async(req,res)=>{
    //console.log(process.env.MONGO_URL);
    //Put it inside the database
    //To connect and use our Database we will use a library caled mongoose-yarn add mongoose
    //This is an async function so need to add an await
    await mongoose.connect(process.env.MONGO_URL);
    //We want to grab all the data from the request body
    const{name,description,datetime,price}=req.body;
    
    //Now we want to put it inside our transaction model
    //LHS is the object or result we put into the database=RHS is the model
    const transaction=await Transaction.create({name,description,datetime,price}); //to create new document inside our transaction collection
    res.json(transaction);
});

app.get('/api/transactions',async(req,res)=>{
    //First need to connect to database
    await mongoose.connect(process.env.MONGO_URL);
    //Want to use our transaction model and grab everything
    const transactions=await Transaction.find();
    res.json(transactions);

});

/*Port 4040 will be for our backend*/
app.listen(4040);

