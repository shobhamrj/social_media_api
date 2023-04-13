const express = require('express');
const app = express();
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const followRouter = require('./routes/follow')


app.use(express.json());

app.use(userRouter)
app.use(postRouter)
app.use(followRouter)


app.listen('3000', () => {
    console.log('Listening on port 3000');
});

module.exports = app;
