// app.js
const express = require('express');
const app = express();
const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/category');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/products', productsRouter);
app.use('/categories', categoryRouter);

const port = 3002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
