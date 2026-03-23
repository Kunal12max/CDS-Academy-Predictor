document.getElementById('predictionForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const maths = parseInt(document.getElementById('Maths').value);
    const english = parseInt(document.getElementById('English').value);
    const gk = parseInt(document.getElementById('gk').value);
    const difficulty = parseInt(document.getElementById('difficulty').value);

    const resultContainer = document.getElementById('resultContainer');
    const loading = document.getElementById('loading');
    const barsContainer = document.getElementById('barsContainer');
    const infoCardsContainer = document.getElementById('infoCardsContainer');
    
    // UI Reset
    barsContainer.innerHTML = '';
    resultContainer.classList.remove('hidden');
    loading.classList.remove('hidden');
    barsContainer.classList.add('hidden');
    if(infoCardsContainer) infoCardsContainer.classList.add('hidden');

    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty, english, gk, maths })
        });

        const data = await response.json();

        if (data.error) {
            alert("Analysis Error: " + data.error);
            resetBackground(); 
            return;
        }

        let highestAcademy = "None";
        let highestProb = 0;

        // 1. Generate Progress Bars
        const academyKeys = ['IMA', 'INA', 'AFA', 'OTA'];
        for (const [academy, prob] of Object.entries(data)) {
            if (!academyKeys.includes(academy)) continue;
            if (prob > highestProb) {
                highestProb = prob;
                highestAcademy = academy;
            }
            createProgressBar(academy, prob, barsContainer);
        }

        // Background Magic
        changeBackground(highestAcademy, highestProb);

        // 2. Info Card 1: Cutoff Context
        let cutoffMsg = "";
        if (difficulty === 1) {
            cutoffMsg = "Since you expect an <strong>Easy</strong> paper, historical cutoffs will be higher. You need around 140+ for IMA and 105+ for OTA.";
        } else if (difficulty === 2) {
            cutoffMsg = "For a <strong>Moderate</strong> paper, historical cutoffs hover around 130+ for IMA and 95+ for OTA.";
        } else {
            cutoffMsg = "If the paper comes <strong>Hard</strong>, cutoffs will drop. Safe score would be around 120+ for IMA and 85+ for OTA.";
        }

        // 3. Info Card 2: Current Status
        let statusMsg = "";
        if (highestProb >= 70) {
            statusMsg = `Great job! You are in the safe zone for <strong>${highestAcademy}</strong>. Your current score clears the expected margin safely.`;
        } else if (highestProb >= 40) {
            statusMsg = `You are on the borderline for <strong>${highestAcademy}</strong>. A few extra marks can push you into the safe zone.`;
        } else {
            statusMsg = `Currently falling short for <strong>${highestAcademy}</strong>. You need a solid jump in your overall score to clear the merit.`;
        }

        // 4. Info Card 3: Area of Improvement
        let weakestSub = "Maths";
        let lowestMark = maths;
        if (english < lowestMark) { weakestSub = "English"; lowestMark = english; }
        if (gk < lowestMark) { weakestSub = "General Knowledge"; lowestMark = gk; }
        
        // Handle OTA condition where Maths is 0
        if (maths === 0 && (english > 0 || gk > 0)) {
            weakestSub = english < gk ? "English" : "General Knowledge";
            lowestMark = english < gk ? english : gk;
        }

        let impMsg = `Your weakest section right now is <strong>${weakestSub}</strong> (${lowestMark} marks). Focus your revision heavily here to boost your total score.`;

        // Inject Text
        document.getElementById('cutoffText').innerHTML = cutoffMsg;
        document.getElementById('statusText').innerHTML = statusMsg;
        document.getElementById('improvementText').innerHTML = impMsg;

        // Show Elements
        loading.classList.add('hidden');
        barsContainer.classList.remove('hidden');
        infoCardsContainer.classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the server. Make sure Node.js is running.');
        loading.classList.add('hidden');
        resetBackground(); 
    }
});

// --- Helpers ---
function changeBackground(academy, probability) {
    const body = document.body;
    body.classList.remove('ima-bg', 'ina-bg', 'afa-bg', 'ota-bg');
    if (probability > 10) body.classList.add(`${academy.toLowerCase()}-bg`);
    else resetBackground();
}

function resetBackground() {
    document.body.classList.remove('ima-bg', 'ina-bg', 'afa-bg', 'ota-bg');
    document.body.classList.add('default-bg');
}

function createProgressBar(name, percentage, container) {
    const academyRow = document.createElement('div');
    academyRow.classList.add('academy-row');

    const academyInfo = document.createElement('div');
    academyInfo.classList.add('academy-info');
    academyInfo.innerHTML = `<span>${name}</span><span>${percentage}%</span>`;

    const progressBg = document.createElement('div');
    progressBg.classList.add('progress-bg');

    const progressFill = document.createElement('div');
    progressFill.classList.add('progress-fill');
    
    // Tiny delay so the animation triggers smoothly
    setTimeout(() => { progressFill.style.width = `${percentage}%`; }, 50);

    if (percentage >= 70) progressFill.classList.add('bg-safe');
    else if (percentage >= 40) progressFill.classList.add('bg-borderline');
    else progressFill.classList.add('bg-low');

    progressBg.appendChild(progressFill);
    academyRow.appendChild(academyInfo);
    academyRow.appendChild(progressBg);
    container.appendChild(academyRow);
}