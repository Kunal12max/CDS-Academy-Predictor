# CDS Academy Selection Predictor 🎯

A full-stack web application that predicts a candidate's probability of clearing the cutoffs for Indian Armed Forces academies (IMA, INA, AFA, OTA) based on mock test scores and historical trends.

## 💡 Why I Built This
As an aspirant preparing for the CDS exam, I realized that predicting selection isn't just about calculating total marks. Real-world cutoffs depend heavily on the exam's difficulty level and past trends. Instead of writing a basic `if-else` calculator, I integrated a Machine Learning model trained on historical CDS data to provide a realistic selection probability and actionable feedback on where a candidate needs to improve.

## ✨ Features
* **Machine Learning Engine:** Uses a Random Forest Classifier to analyze marks against difficulty-adjusted historical data.
* **Scenario Planning:** Predicts outcomes based on whether the user expects the upcoming exam to be Easy, Moderate, or Hard.
* **Smart UI/UX:** The application interface and background dynamically adapt based on the academy with the highest selection probability.
* **Actionable Insights:** Automatically calculates the weakest subject and provides a targeted revision strategy.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Machine Learning:** Python, Scikit-Learn, Joblib
* **Integration:** Used Node.js `child_process` to bridge the Express backend with the Python ML execution script.

## 🚀 Local Setup & Installation

**Prerequisites:** Ensure you have Node.js and Python (added to PATH) installed on your system.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kunal12max/CDS-Academy-Predictor.git
   cd CDS-Academy-Predictor
