const express=require('express');
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');


const user=require('./routers/user');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(user);

mongoose
    .connect('mongodb://localhost:27017')
    .then(res=>app.listen(3000))
    .catch(err=>console.log('err'));





