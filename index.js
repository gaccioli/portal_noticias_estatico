const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const Posts = require('./posts.js')

const app = express()




mongoose.connect('mongodb+srv://root:root@cluster0.u5exk.mongodb.net/dankicode?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then(function(){
    console.log('Conectado com Sucesso')
}).catch(function(err){
    console.log(err.message)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ 
    extended: true
}))

app.engine('html', require('ejs'). renderFile)
app.set('view engine', 'html')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/pages'))


app.get('/',(req,res)=>{
    
    if(req.query.busca == null){
        //puxa do banco todos os dados na ordem q foi adicionada
        Posts.find({}).sort({'_id': -1}).exec(function(err,posts){   
            //console.log(posts[0])
            posts = posts.map(function(val){
                return { 
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0,99),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria
                }
            })
            res.render('home',{posts: posts});
        })
        
    }else{
        res.render('busca',{});
    }

});

app.get('/:slug',(req,res)=>{
    //res.send(req.params.slug);
    res.render('single',{});
})

app.listen(5000,()=>{
    console.log('server rodando!');
})