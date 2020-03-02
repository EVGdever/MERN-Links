const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();
app.use('/api/auth', require('./routes/auth.routes'));

const APP_PORT = config.get('port') || 5000;

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log(`Server start on port: ${APP_PORT}`);
    } catch (e) {
        console.log(`Server error: ${e.message}`);
        process.exit(1);
    }
}

start();
