import express from 'express';
import logger from './config/logger';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/',(req,res) => {
    res.send("collab server is running");
});
app.listen(PORT,()=>{
    logger.info(`server is running on port ${PORT}`);
})