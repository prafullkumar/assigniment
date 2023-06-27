const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new category
router.post('/', (req, res) => {
  const { CategoryName } = req.body;
  const sql = 'INSERT INTO categories (CategoryName) VALUES (?)';
  db.query(sql, [CategoryName], (err, result) => {
    if (err) {
      console.error('Error creating category:', err);
      res.status(500).send('Error creating category.');
      return;
    }
    res.redirect('/categories');
  });
});

// Get paginated category list
router.get('/', (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const sql =
    'SELECT c.CategoryName, c.CategoryId FROM categories c LIMIT ? OFFSET ?';
    db.query(sql, [pageSize, offset], (err, result) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).send('Error fetching categories.');
      return;
    }
    res.render('categories', { categories: result,currentPage: page, pageSize:pageSize,editMode:false});
  });
 
});

//View edit category
router.get('/:id', (req, res) => {
    let id = req.params.id;
   
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const offset = (page - 1) * pageSize;
    const sql =
      'SELECT c.CategoryName, c.CategoryId FROM categories c WHERE c.CategoryId=? LIMIT ? OFFSET ? ';
      db.query(sql, [id,pageSize, offset], (err, result) => {
      if (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('Error fetching categories.');
        return;
      }
      res.render('categories', { categories: result,currentPage: page, pageSize:pageSize,editMode:true,id:id});
    });
   
  });
  

// Update a categories
router.post('/:id', (req, res) => {
  const categoryId = req.params.id;
    const { CategoryName } = req.body;
  const sql = 'UPDATE categories SET CategoryName = ? WHERE CategoryId = ?';
  db.query(sql, [CategoryName, categoryId], (err, result) => {
    if (err) {
      console.error('Error updating category:', err);
      res.status(500).send('Error updating category.');
      return;
    }
    res.redirect('/categories');
  });
});

// Delete a category
router.get('/delete/:id', (req, res) => {
  const categoryId = req.params.id;
  const sql = 'DELETE FROM categories WHERE CategoryId = ?';
  db.query(sql, [categoryId], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      res.status(500).send('Error deleting category.');
      return;
    }
    res.redirect('/categories');
  });
});

module.exports = router;
