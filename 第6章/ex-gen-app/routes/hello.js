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

var knex = require('knex')({

    client:'mysql',
    connection:{
        host:'localhost',
        user:'root',
        password:'',
        database:'my-nodeapp-db',
        charset:'utf8',
    }
});

var Bookshelf = require('bookshelf')(knex);

var MyData = Bookshelf.Model.extend({
    tableName:'mydata',
});

router.get('/', function(req, res, next) {

    new MyData().fetchAll().then((collection)=>{

        var data = {
            title:'Hello!',
            content:collection.toArray(),
        }
        res.render('hello/index',data);
    })
    .catch((err)=>{
        res.status(500).json({error:true,data:{message:err.message}});
    });
});

router.get('/add',(req,res,next)=>{

    var data = {
        title:'Hello/Add',
        content:'新しいレコードを入力:',
        form:{name:'',mail:'',age:0}
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


router.get('/find',(req,res,next)=>{

    var data = {
        title:'/Hello/Find',
        content:'検索IDを入力',
        form:{fstr:''},
        mydata:null
    };
    res.render('hello/find',data);
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

    var response = res;
    new MyData(req.body).save().then((model)=>{
        response.redirect('/hello');
    });
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

router.post('/find',(req,res,next)=>{

    new MyData().where('id','=',req.body.fstr).fetch().then((collection)=>{

        var data = {
            title:'Hello!',
            content:'※id = ' + req.body.fstr + ' の検索結果:',
            form:req.body,
            mydata:collection,
        };
        res.render('hello/find',data);
    });
});

Bookshelf.plugin('pagination');

router.get('/:page',(req,res,next)=>{

    var pg = req.params.page;
    pg *= 1;
    if(pg < 1){pg = 1};
    new MyData().fetchPage({page:pg,pageSize:3}).then((collection)=>{

        var data = {
            title:'Hello!',
            content:collection.toArray(),
            pagination:collection.pagination,
        };
        console.log(collection.pagination);
        res.render('hello/index',data);
    })
    .catch((err)=>{
        res.status(500).json({error:true,data:{message:err.message}});
    });
});

module.exports = router;
