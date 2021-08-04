const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

//const instacncia = new productos();
// creo una app de tipo express
const app = express();
const handlebars = require("express-handlebars")
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    store: MongoStore.create({
        //En Atlas connect App :  Make sure to change the node version to 2.2.12:
        mongoUrl: 'mongodb+srv://root:root@cluster0.vzcoz.mongodb.net/sesiones?retryWrites=true&w=majority',
        ttl:10*60,
        mongoOptions: advancedOptions
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
app.engine('hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.render('main');

  });

  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) res.render('main');
        else res.send({ status: 'Logout ERROR', body: err })
    })
}) 

app.get('/login', (req, res) => {
  let {usuario} =  req.query
  req.session.usuario = usuario
  res.render('list', { usuario: usuario});
})

const puerto = 8080;

const server = app.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
});
