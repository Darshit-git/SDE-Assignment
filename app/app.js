const express = require('express');
const mongoose = require('mongoose');
const imageRoutes = require('./routes/imageRoutes');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

mongoose.set('autoCreate', false)

app.use(express.json());
app.use('/api/images', imageRoutes);
app.use('/', (req,res) => res.status(404).json({message: 'Not Found'}))

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
