require('dotenv').config();
// dotenv, .env dosyasındaki değişkenleri kullanmak için kullanılır

const express = require('express');
// Express, Node.js web uygulamaları oluşturmak için kullanılan bir web uygulama çerçevesidir.
const expressLayouts = require('express-ejs-layouts');
// Express Layouts, Express uygulamalarında layout'ları kullanmak için kullanılır.
const cookieParser = require('cookie-parser'); 
// cookie-parser, cookie'leri parse etmek için kullanılır.
const session = require('express-session');
// express-session, session'ları kullanmak için kullanılır.
const MongoStore = require('connect-mongo'); 
// Mongo Store, session'ları MongoDB'de saklamak için kullanılır.


const connectDB = require('./server/config/db'); // Veritabanı bağlantısını yaptık

const app = express(); // Express uygulamasını başlattık
const PORT = 5000 || process.env.PORT; // Port numarasını belirledik (5000 veya .env dosyasındaki PORT)

// Connect to MongoDB
connectDB();

app.use(express.urlencoded({ extended: true })); 
// Form verilerini almak için gerekli middleware (req.body)
app.use(express.json());
 // JSON verilerini almak için gerekli middleware (req.body)
app.use(cookieParser());
// Cookie'leri parse etmek için gerekli middleware (req.cookies)

app.use(session({
  secret: 'keyboard cat',
  // secret, session'ları hashlemek için kullanılır
  resave: false,
  // resave, session'ları her istekte tekrar kaydetmek için kullanılır
  saveUninitialized: false,
  // saveUnititialized, başlatılmamış session'ları kaydetmek için kullanılır
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  // store, session'ları MongoDB'de saklamak için kullanılır
  // cookie: { maxAge: new Date(Date.now() + 3600000) }
  // cookie, session'ların süresini belirlemek için kullanılır
}));

app.use(express.static('public')); // Public dosyasını statik olarak belirledik

// Templating Engine
app.use(expressLayouts); // Express Layouts modülünü kullanacağımızı belirttik
app.set('layout', './layouts/main'); // Layout dosyasını belirledik
// Layout dosyası, genel olarak tüm sayfalarda kullanılacak olan HTML yapısını belirler
app.set('view engine', 'ejs'); // View Engine olarak EJS'i belirledik

app.use('/', require('./server/routers/main')); // Main router'ı kullanacağımızı belirttik
app.use('/', require('./server/routers/admin')); // Main router'ı kullanacağımızı belirttik

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});