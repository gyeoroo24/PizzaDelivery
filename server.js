const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const app = express();

//set Template Engine------Make sure that it is always above routes as we
//inject the body in the layout.ejs file
app.use(expressLayout);

app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');

//Assets ----using static middleware to apply css
app.use(express.static('public'));

//Calling function initRoutes from web.js

require('./routes/web')(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT , () => {
    console.log(`Listening on port  ${PORT}`);
})