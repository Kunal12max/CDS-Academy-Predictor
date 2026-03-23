const express = require('express');
const cors = require('cors');
const {spawn} = require('child_process');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 
app.post('/api/predict', (req, res) => {
    const { difficulty, english, gk, maths } = req.body;
    const pythonProcess = spawn('py', ['predict.py', difficulty, english, gk, maths]);
    let resultData = '';
pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });
pythonProcess.stdout.on('end',()=>{
    try{const parsedResult = JSON.parse(resultData.trim());            
            if(parsedResult.error){
                return res.status(500).json({ error: parsedResult.error });}
            res.json(parsedResult);
        }catch(e){
            console.error("Parse Error:", e);
            res.status(500).json({ error: "Failed to parse prediction."});
        }
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});