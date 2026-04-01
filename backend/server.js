import express from 'express';

const PORT = 3000;
const app = express();

app.get('/',(req,res) =>{
    res.send('🚀 Server is running! Hello from ResortIQ backend.')
})

app.listen(PORT, () =>{
    console.log(`server is running on http://localhost:${PORT}`);
})