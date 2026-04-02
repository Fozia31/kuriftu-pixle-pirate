import express from 'express';
import pricingRouter from './routers/pricing.route.js';
import demandRouter from './routers/demand.route.js';
import analysisRouter from './routers/analysis.route.js';
import simulationRouter from './routers/simulation.route.js';


const PORT = 3000;
const app = express();

app.use(express.json());

app.use('/api/pricing', pricingRouter);
app.use('/api/demand', demandRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/simulation', simulationRouter);


app.get('/',(req,res) =>{
    res.send('🚀 Server is running! Hello from ResortIQ backend.')
})

app.listen(PORT, () =>{
    console.log(`server is running on http://localhost:${PORT}`);
})