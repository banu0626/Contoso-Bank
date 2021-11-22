var express= require('express')
var app = express();
var path = require("path");
const multer  = require('multer')
app.use(express.static("uploads"));
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost:27017";
var cors=require('cors')
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/uploads')
    },
    filename: function (req, file, cb) {
 console.log("file in filename function::",file)
 var fileext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+fileext)
    }
})

const upload = multer({storage : storage})

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.set('view engine', 'pug');
app.set('views','./views');


setlast()
// var val;
const today = new Date();
let seq;
const ye=today.getFullYear().toString();
const mon=(today.getMonth()+1).toString();
var ss = ("LN"+ye+mon+seq)



function setlast(){
    MongoClient.connect(url,function(err,conn){
    var db = conn.db("delta");
    db.collection('applications').findOne(
     {},
     { sort: { _id: -1 } },
     (err, data) => {
        console.log(data.serialno)
        seq=data.serialno
        return data.serialno;
     }
   )
}   )}

console.log(seq)

app.get("/getlast",function(req,res){
MongoClient.connect(url,function(err,conn){
    var db = conn.db("delta");
    db.collection("applications").findOne(
 {},
 { sort: { _id: -1 } },
 (err, data) => {
 //    console.log(data.loannumber.slice(-3));
    res.send(data)
    
 },)
})})
  
 app.post("/addloan",upload.single("profilepic"),function(req,res){
    console.clear();
    console.log("req.file",req.file,req.body);    
    req.body.profilePic = req.file.filename;
    // console.log("req.body",req.body); 
    MongoClient.connect(url,function(err,conn){
     var db = conn.db("delta");
     db.collection('bank').insertOne({
 serialno:req.body.serialno,
 details:req.body
    },(err,data)=>{
 res.send(data)
 console.log(data)
    })
   })
})

 app.get("/",function(req,res){
     res.send("i am working")
 })
 app.get("/loandelete/:id",function(req,res){
    MongoClient.connect(url,function(err,conn){
     var db = conn.db("delta");
     db.collection('applications').deleteOne({_id:ObjectId(req.params.id)})
        res.send("Done")
           })
     })

// app.post('/check',(req,res) => {
//     MongoClient.connect(url,function(err,conn){
//  var db = conn.db("delta");
//  db.collection('bankcheck').insertOne({
//      // serialno:req.body.serialno,
//      serialno:(()=>{
//         db.collection('application').findOne(
//             {},
//             { sort: { _id: -1 } },
//             (err, data) => {
//                console.log(data.serialno)
//                return data.serialno;
//             },
//           )

//      }),
//      details:req.body
//  },(err,data)=>{
//      res.send(data)
//      console.log(data)
//  })
// })
// })

// var s=103;
 app.post('/newloan',(req,res) => {
    MongoClient.connect(url,function(err,conn){
    // var value=setloannumber();
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

 app.get("/alllist",function(req,res){
 MongoClient.connect(url,function(err,con){  
     var db =con.db("delta"); 
     db.collection("applications").find()
    .toArray(function(err,data){   
  res.send(data);   
  })   
     })   
 })    

 app.post('/addbranch',(req,res) => {
     MongoClient.connect(url,function(err,conn){
  var db = conn.db("delta");
  db.collection('bankbranch').insertOne(req.body,function(data){
      res.send(data)
  })
 })
 })
 

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