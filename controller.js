const express = require('express')
const bodyParser = require('body-parser')
 
const cors = require('cors')
 
const md5 = require('md5') // library for encrytion



var cloudinary = require('cloudinary').v2


 
const router = express.Router();
 
router.use(cors())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// Example Databse
const sampleDatabase = [
    {
        email : 'john@gmail.com',
        password : md5('James@11')
    },
    {
        email : 'james@gmail.com',
        password : md5('JohnC@11')
    }
]
 
router.get('/', (req, res) => {
  res.send('Hello world!')
})

router.get('/image',(req,res)=>{

    // let img = cloudinary.url("sample.jpg", {width: 100, height: 150, crop: "fill"})

    // res.send(img)
    cloudinary.api.resources().then((result)=>
    {
        res.send(result)
    }, 
    { 
        resource_type: 'image',
        type : "upload",
        prefix: 'James/'
    }
    );
})
 
   
// ========================== your routes here ==============================//

// User Registration
router.post(`/registerUser`,(req,res)=>{

    let user = req.body

    // For password Checking (must 8 characters long, contains upper and lower case, contain at least one digit and contain at least one specail character)
    let checkPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    let checkUniqEmail = sampleDatabase.filter(r=>{
        return r.email == req.body.email
    })

    // checking if email is already exist
    if(checkUniqEmail.length !== 0){ 

        res.send('Email is already use')
    
    // checking if email is valid
    }else if(!user.email.includes('@')){ 

        res.send('Email is not valid')

    // checking if password must contains 8 characters long, contains upper and lower case, contain at least one digit and contain at least one specail character
    }else if(!user.password.match(checkPassword)){ 

        res.send('password must contains 8 characters long, contains upper and lower case, contain at least one digit and contain at least one specail character')

    }else{

        let submit = {
            email : req.body.email,
            password : md5(req.body.password)
        }
        sampleDatabase.push(submit) // store in database
        res.send(submit)
        
    }

})

// For login
router.post('/loginUser',(req,res)=>{

    let success = sampleDatabase.filter(rec=>{
        return rec.email == req.body.email && rec.password == md5(req.body.password)
    })
    if(success.length !== 0){
        res.send('Successfuly Login')
    }else{
        res.send('Wrong email and password')
    }
})
 
// ========================== your routes here ==============================//
 
module.exports = router;