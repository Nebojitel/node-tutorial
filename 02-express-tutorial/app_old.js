const express = require('express');
const app = express();
const { products } = require('./data.js');
const logger = require('./logger');
const authorize = require('./authorize');
const morgan = require('morgan');

// app.use('/api/products', [logger, authorize]);
app.use(morgan('tiny'));
app.use([logger, authorize]);

// app.get('/', logger, (req, res) => {
app.get('/', (req, res) => {
  res.send('<h1>Home page</h1><a href="/api/products">products</a>');
});

app.get('/api/products', (req, res) => {
  const newProducts = products.map((product) => {
    const { id, name, image } = product;
    return { id, name, image };
  });

  res.json(newProducts);
});

app.get('/api/products/:productID', (req, res) => {
  const { productID } = req.params;
  const singleProduct = products.find(
    (product) => product.id === Number(productID)
  );

  if (!singleProduct) {
    return res.status(404).send('Product does not exist');
  }
  return res.json(singleProduct);
});

app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
  console.log(req.params);
  res.send('Hello world');
});

app.get('/api/v1/query', (req, res) => {
  // console.log(req.query);
  let { search, limit } = req.query;
  let sortedProducts = [...products];
  if (search) {
    sortedProducts = sortedProducts.filter((product) => {
      return product.name.startsWith(search);
    });
  }

  if (limit) {
    sortedProducts = sortedProducts.slice(0, Number(limit));
  }

  if (sortedProducts.length < 1) {
    // res.status(200).send('No products matched your search');
    return res.status(200).json({ success: true, data: [] });
  }
  res.status(200).json(sortedProducts);
  // res.send('Hello world');
});

app.listen(5000, () => {
  console.log('Server is listening on port 5000...');
});
