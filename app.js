const nodemailer = require('nodemailer');
const fs = require('fs');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var to;
var subject;
var body;
var path;

var Storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null, './uploads');
    },
    filename:function(req,file,callback){
        callback(null,file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage:Storage
}).single('attachment');

app.use(express.static('public'));
app.get('/',(req,res) => {
    res.sendFile('/index.html');
});
app.post('/sendEmail', (req,res) => {
    upload(req,res,function(err){
        if(err){
            console.log(err);
            return res.end("Somethis is amiss. Try again!");
        }
        else {
            to = 'ade@oslrs.com';
            subject = req.body.subject;
            body = req.body.body;
            path = req.file.path;
            console.log(to);
            console.log(subject);
            console.log(body);
            console.log(path);

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'communicationrequests@gmail.com',
                    pass: 'Communication2021'
                }
            });

            var mailOptions = {
                from: 'communicationrequests@gmail.com',
                to: to,
                subject: subject,
                text: body,
                attachments: [
                    {
                        path:path
                    }
                ]

            }

            transporter.sendMail(mailOptions,function(err,info){
                if(err){
                    console.log(err);
                }
                else {
                    console.log("success" + info.response);
                    
                    fs.unlink(path, function(err){
                        if(err){
                            return res.end(err);
                        }
                        else {
                            console.log("deleted");
                            return res.redirect('/result.html');
                        }

                    })
                }
            })


        }
    });
})
app.listen(port,()=>{
    console.log("Server started");
});