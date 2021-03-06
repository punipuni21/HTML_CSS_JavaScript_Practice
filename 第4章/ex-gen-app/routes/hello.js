var express = require('express');
var router = express.Router();

var http = require('https');
var parseString = require('xml2js').parseString;
var mysql = require('mysql');

var my_sql_setting = {
    host:'localhost',
    user:'root',
    password:'',
    database:'my-nodeapp-db'
};

router.get('/', function(req, res, next) {

    var connection = mysql.createConnection(my_sql_setting);

    connection.connect();

    connection.query('SELECT * from mydata',(error,results,fields)=>{

        if(error == null){
            var data = {title:'mysql',content:results};
            res.render('hello/index',data);
        }
    });
    connection.end();
});

router.get('/add',(req,res,next)=>{

    var data = {
        title:'Hello/Add',
        content:'新しいレコードを入力:'
    }

    res.render('hello/add',data);
});


router.get('/edit',(req,res,next)=>{

    var id = req.query.id;
    var connection = mysql.createConnection(my_sql_setting);

    connection.connect();

    connection.query('SELECT * from mydata where id=?',id,(error,results,fields)=>{

        if(error == null){
            var data = {
                title:'Hello/edit',
                content:'id='+id+' のレコード',
                mydata:results[0]
            }
            res.render('hello/edit',data);
        }
    });
    connection.end();
});

router.post('/edit',(req,res,next)=>{

    var id = req.body.id;
    var nm = req.body.name;
    var ml = req.body.mail;
    var ag = req.body.age;
    var data = {'name':nm,'mail':ml,'age':ag};

    var connection = mysql.createConnection(my_sql_setting);

    connection.connect();

    connection.query('update mydata set ? where id= ?',[data,id],(error,results,fields)=>{

        res.redirect('/hello');

    });

    connection.end();
});


router.get('/delete',(req,res,next)=>{

    var id = req.query.id;
    var connection = mysql.createConnection(my_sql_setting);

    connection.connect();

    connection.query('SELECT * from mydata where id = ?',id,(error,results,fields)=>{

        if(error == null){
            var data = {
                title:'Hello/delete',
                content:'id= ' + id + ' のレコード',
                mydata:results[0]
            }
            res.render('hello/delete',data);
        }
    });
    connection.end();
});



//これはフォームからPOST送信した後の処理
router.post('/post',(req,res,next)=>{

    var msg = req.body['message'];
    req.session.message = msg;
    var data = {
        title:'Hello',
        content:"Last Message!: " + req.session.message,
    }
    res.render('hello',data);
});

router.post('/add',(req,res,next)=>{

    var nm = req.body.name;
    var ml = req.body.mail;
    var ag = req.body.age;
    var data = {'name':nm,'mail':ml,'age':ag};

    var connection = mysql.createConnection(my_sql_setting);

    connection.connect();

    connection.query('insert into mydata set ?',data,(error,results,fields)=>{
        res.redirect('/hello');
    });

    connection.end();
});


router.get('/show',(req,res,next)=>{

    var id = req.query.id;

    var connection = mysql.createConnection(my_sql_setting);

    connection.query('SELECT * from mydata where id = ?',id,(error,results,fields)=>{

        if(error == null){
            var data = {
                title:'Hello/show',
                content:'id= '+id+' のレコード',
                mydata:results[0]
            }
            res.render('hello/show',data);
        }
    });
    connection.end();
});


router.post('/delete',(req,res,next)=>{

    var id = req.body.id;
    
    var connection = mysql.createConnection(my_sql_setting);

    connection.connect();

    connection.query('delete from mydata where id=?',id,(error,results,fields)=>{
        res.redirect('/hello');
    });
    connection.end();
});


module.exports = router;
