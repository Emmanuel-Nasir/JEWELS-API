const express = require('express');
const router = express.Router();
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// GET all customers
router.get('/', async (req, res) => {
  try {
    const result = await mongodb.getDb().collection('customers').find();
    result.toArray().then((customers) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(customers);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customerId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('customers').find({ _id: customerId });

    result.toArray().then((customers) => {
      if (!customers[0]) {
        res.status(404).json({ message: 'Customer not found' });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(customers[0]);
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Invalid ID format' });
  }
});

// POST create customer
router.post('/', async (req, res) => {
  try {
    const customer = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    };

    const response = await mongodb.getDb().collection('customers').insertOne(customer);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Error inserting customer' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  try {
    const customerId = new ObjectId(req.params.id);

    const customer = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    };

    const response = await mongodb.getDb().collection('customers').replaceOne(
      { _id: customerId },
      customer
    );

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Customer not found or no update made' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    const customerId = new ObjectId(req.params.id);

    const response = await mongodb.getDb().collection('customers').deleteOne({ _id: customerId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;