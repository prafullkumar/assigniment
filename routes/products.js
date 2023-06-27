const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new product
router.post('/', (req, res) => {
  const { productName, categoryId } = req.body;
  const sql = 'INSERT INTO products (ProductName, CategoryId) VALUES (?, ?)';
  db.query(sql, [productName, categoryId], (err, result) => {
    if (err) {
      console.error('Error creating product:', err);
      res.status(500).send('Error creating product.');
      return;
    }
    res.redirect('/products');
  });
});

// Get paginated product list
router.get('/', async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const sql =
    'SELECT p.ProductId, p.ProductName, c.CategoryName, c.CategoryId FROM products p JOIN categories c ON p.CategoryId = c.CategoryId';
    const products = await executeQuery(sql, pageSize, offset);
    
    const categorysql =
    'SELECT  c.CategoryName, c.CategoryId FROM categories c';
    const category = await executeQuery(categorysql); 
   
    // db.query(sql, [pageSize, offset], (err, result) => {
    // if (err) {
    //   console.error('Error fetching products:', err);
    //   res.status(500).send('Error fetching products.');
    //   return;
    // }
    res.render('index', { products: products,categories:category,currentPage: page, pageSize:pageSize,editMode:false});

 
});


//View edit product
router.get('/:id', async(req, res) => {
    let id = req.params.id;
   
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const offset = (page - 1) * pageSize;
    const sql =
      'SELECT p.ProductId, p.ProductName, c.CategoryName, c.CategoryId FROM products p  JOIN categories c ON p.CategoryId = c.CategoryId AND p.ProductId='+id;
      const product= await executeQuery(sql, pageSize, offset);

      const categorysql =
      'SELECT  c.CategoryName, c.CategoryId FROM categories c';
      const category = await executeQuery(categorysql); 
    
      res.render('index', { products: product,categories:category,currentPage: page, pageSize:pageSize,editMode:true,id:id});
   
  });

function executeQuery(query, limit = null, offset = null) {
    return new Promise((resolve, reject) => {
      let modifiedQuery = query;
      if (limit && offset) {
        modifiedQuery += ` LIMIT ${limit} OFFSET ${offset}`;
      } else if (limit) {
        modifiedQuery += ` LIMIT ${limit}`;
      }
  
   
  
      db.query(modifiedQuery, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  

// Update a product
router.post('/:id', (req, res) => {
  const productId = req.params.id;
    const { productName, categoryId } = req.body;
  const sql = 'UPDATE products SET ProductName = ?, CategoryId = ? WHERE ProductId = ?';
  db.query(sql, [productName, categoryId, productId], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).send('Error updating product.');
      return;
    }
    res.redirect('/products');
  });
});

// Delete a product
router.get('/delete/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'DELETE FROM products WHERE ProductId = ?';
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).send('Error deleting product.');
      return;
    }
    res.redirect('/products');
  });
});

module.exports = router;
