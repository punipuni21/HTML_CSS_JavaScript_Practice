var express = require('express');
var ejs = require('ejs');

var app = express();

app.engine('ejs',ejs.renderFile);
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

var data = {
    'Taro':'taro',
    'Hanako':'hanako',
    'Sachiko':'sachiko',
    'Ichiro':'ichiro',
};


app.get('/',(req,res)=>{
    var msg = 'This is Index Page!<br>'
        + '※データを表示します';

    res.render('index.ejs',
    {
        title:'Index',
        content:msg,
        data:data,
    });

});

/*
app.post("/",(req,res)=>{

    var msg = 'This is Post Page!<br>'
    + 'あなたは「<b>'+ req.body.message + 
    '</b>」と送信しました';
    res.render('index.ejs',
    {
        title:'Posted',
        content:msg,
        //link:{href:'/',text:'※トップに戻る'},
    });
});
*/

var server = app.listen(3000,()=>{
    console.log('Server is running!');
});