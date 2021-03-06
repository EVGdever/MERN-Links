const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({extended: true}));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));
app.use('/t', require('./routes/redirect.routes'));

const APP_PORT = config.get('port') || 6000;


/**
 * @param {number} number
 * @return {number}
 */
function exemple(number) {
    return number*2;
}

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(APP_PORT, () => console.log(`Server listen port: ${APP_PORT}...`));
    } catch (e) {
        console.log(`Server error: ${e.message}`);
        process.exit(1);
    }
}

start();
