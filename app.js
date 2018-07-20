var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs('customerApp', ['users'])
var app= express();
/* 
var logger = function(rep,resp,next){
    console.log('logging...');
}

app.use(logger); */

//view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

//body-parser middlewere
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname,'public')));

//globals vars 
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
})

app.use(expressValidator());

app.get('/',(req , resp) => {
    db.users.find(function (err, docs) {
        resp.render('index',{
            title:'Customers',
            users: docs
        });
    })
    
})

app.post('/users/add',function(req , resp){

    req.checkBody('first_name','First Name is Required').notEmpty();
    req.checkBody('last_name','Last Name is Required').notEmpty();
    req.checkBody('email','Email is Required').notEmpty();

    var errors= req.validationErrors();

    if(errors){
        resp.render('index',{
            title:'Customers',
            users: users,
            errors:errors
        });
    }else{
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
        
        db.users.insert(newUser,function(err, result){
            if(err){
                console.log(err);
            }else{
                resp.redirect('/');
            }
        })
    }

    
})

app.delete('/users/delete/:id', function(req, resp){
    db.users.remove({_id: ObjectId(req.params.id)}, function(err,reslt){
        if(err){
            console.log(err); 
        }
        return resp.send('success');
    })
});

app.listen(3000,()=>{
    console.log('Server is starter in port 3000');
})