const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const ProductModel = require("./models/product.model");
const flash = require("connect-flash");

Order = require('./models/order.model');
const authRoutes = require('./routes/auth.router');
const { isAuthenticated } = require('./middleware/auth');
const app = express();
app.use(cookieParser());
app.use(session({ secret: "My session secret" }));
// require mongoose which is ORM Object Relational Model
app.use(flash());
// require package layout options in html rendering

// publically accessible assets placed in public folder are exposed

app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// add a middleware to parse body data for form submission


// setup view engine. ejs must be installed
// View engine setup
app.set("view engine", "ejs");
app.use(expressLayouts);
//session
//add as many routers as you want
// idea is to have seperate files for similar routes
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }

}));
app.use('/', authRoutes);
app.get('/admin/dashboard', isAuthenticated, (req, res) => {
  res.render('admin/dashboard', {
    layout: 'admin/admin-layout',
    user: req.session.user
  });
});
app.use((req, res, next) => {
  // Apply `isAuthenticated` middleware only for protected routes
  if (req.path.startsWith('/admin')) {
    return isAuthenticated(req, res, next);
  }
  next();
});

// Middleware to fetch flash messages for the current request
app.use((req, res, next) => {
  res.locals.success_msg = req.session.success_msg || null;
  res.locals.error_msg = req.session.error_msg || null;

  // Clear the messages after displaying them
  delete req.session.success_msg;
  delete req.session.error_msg;

  next();
});




// add as many routes as you want like below

//each route is distinguished according to two paramaters 1. url 2. method (http)

const wishlistRouter = require("./routes/wishlist.router");
app.use(wishlistRouter);
let customerRouter = require("./routes/customer");
app.use(customerRouter);
let productsRouter = require("./routes/admin/products.router");
app.use(productsRouter);
let ordersRouter = require("./routes/admin/orders.router");
app.use(ordersRouter);
let categoryRouter = require("./routes/admin/category.router");
const Category = require("./models/category.model");
app.use(categoryRouter);
// app.get("/logincustomer", (req, res) => {
//   res.render("logincustomer");
// });

// Render Login Page
// app.get("/Registercustomer", (req, res) => {
//   res.render("Registercustomer");
// });
const gender = require('./routes/gender.router');
app.use(gender);
const chatRoute = require('./routes/chat.router');
app.use(chatRoute);
// Middleware to add cart items count to all views
app.use((req, res, next) => {
  const cartItemsCount = req.cookies.cart
    ? Object.keys(JSON.parse(req.cookies.cart)).length
    : 0;

  // Pass cart items count to all views
  res.locals.cartItemsCount = cartItemsCount;
  next();
});

// Routes


app.get("/", async (req, res) => {
  let products = await ProductModel.find().populate("category");
  res.render("home", { products });
});

const cartRouter = require('./routes/admin/cart.router');
app.use(cartRouter);



app.get("/", async (req, res) => {
  let ProductModel = require("./models/product.model");
  let products = await ProductModel.find().populate("category");
  res.render("home", { products });
});
app.get("/admin/signup", (req, res) => {

  res.render("admin/signup");
});

let connectionString = "mongodb://localhost:27017/database";
mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`Connected To: ${connectionString}`);
  })
  .catch((err) => {
    console.log(err.FMessage);
  });
const User = require("./models/user.models");

// Superadmin initialization


// Call during startup
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to the database.");
   
  })
  .catch((err) => console.error("Database connection error:", err));

app.listen(5000, () => {
  console.log("Server started at localhost:5000");
});
