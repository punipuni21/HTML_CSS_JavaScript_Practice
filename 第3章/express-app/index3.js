var express = require('express');
var ejs = require('ejs');

var app = express();
app.engine('ejs',ejs.renderFile);
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    var msg = 'This is Index Page!<br>'
        + '※メッセージを書いて送信してください';

    res.render('index.ejs',
    {
        title:'Index',
        content:msg,
        //link:{href:url,text:'※別のページに移動'},
    });

});


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

var server = app.listen(3000,()=>{
    console.log('Server is running!');
});