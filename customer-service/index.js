const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const customerRoutes = require('./routes/customer.routes');

const app = express();
app.use(express.json());
app.use('/customers', customerRoutes);
app.get('/', (req, res) => {
  res.send('Customer Service is running');
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Customer Service running on port ${PORT}`));
