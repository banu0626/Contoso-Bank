var express= require('express')
var app = express();
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost:27017";
var cors=require('cors')
app.use(cors());



app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.set('view engine', 'pug');
app.set('views','./views');

 app.get("/",function(req,res){
     res.send("i am working")
 })

// delete document
 app.get("/loandelete/:id",function(req,res){
    MongoClient.connect(url,function(err,conn){
     var db = conn.db("delta");
     db.collection('applications').deleteOne({_id:ObjectId(req.params.id)})
        res.send("Done")
           })
     })

///New Loan//
 app.post('/newloan',(req,res) => {
    MongoClient.connect(url,function(err,conn){
    var db = conn.db("delta");
    db.collection('applications').insertOne({
     serialno:req.body.serialno,

     details:req.body
 },(err,data)=>{
     res.send(data)
     console.log(data)
})
})
})
///get all list
 app.get("/alllist",function(req,res){
 MongoClient.connect(url,function(err,con){  
     var db =con.db("delta"); 
     db.collection("applications").find()
    .toArray(function(err,data){   
  res.send(data);   
  })   
     })   
 })    
//to add bank branch
 app.post('/addbranch',(req,res) => {
     MongoClient.connect(url,function(err,conn){
  var db = conn.db("delta");
  db.collection('bankbranch').insertOne(req.body,function(data){
      res.send(data)
  })
 })
 })
 
//view branch list
app.get("/getbranch",function(req,res){
    MongoClient.connect(url,function(err,con){
    var db =con.db("delta");
    db.collection("bankbranch").find()
     .toArray(function(err,data){
      res.send(data);
     })
 })
    })


 app.listen(9099,function(){
     console.log("listening in 9099")
 })