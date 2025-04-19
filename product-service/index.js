const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const productRoutes = require('./routes/product.routes');

const app = express();
app.use(express.json());
app.use('/products', productRoutes);

// Định nghĩa route gốc trước khi server bắt đầu lắng nghe
app.get('/', (req, res) => {
  res.send('Product Service is running');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));
