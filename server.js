const express = require('express')
const {PORT} = require('./config')
const app = express();
app.use(express.json());

if(!PORT){
    throw new Error("PORT is required in config file");
}
const authRoutes = require('./routes/auth')
app.use('/auth',authRoutes)

//start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})