const express = require ('express');
const mongoose = require ('mongoose');
const path = require('path');
const config = require('config');

const app = express();

//BodyParser Middleware
app.use(express.json());

//DB config
const db = config.get('mongoURI');

//connect to mongo
mongoose.connect(db,{ useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true })
.then(()=> console.log('mmongo db connected'))
.catch(err => console.log(err));

//Use Routes
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// Serve service asset if in production
if(process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`server started on ${port}`))