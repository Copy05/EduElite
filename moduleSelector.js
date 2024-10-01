import { LoadTotalQuestions } from "./engine/questionLoader.js";

const moduleLinks = document.querySelectorAll('.qm-href');

let TotalQuestions;

// Load total questions and then execute the logic dependent on it
LoadTotalQuestions().then(total => {
    TotalQuestions = total;
    
    // Now we can calculate the percentage safely
    if (localStorage.getItem("totalScore") === null) {
        localStorage.setItem("totalScore", 0);
    }

    let ts = Number(localStorage.getItem("totalScore"));

    // The Percentage is merly a status that identicates if you're going to pass the exam with your knowledges
    const percentage = TotalQuestions > 0 
        ? Math.min(((ts / 6) / TotalQuestions) * 100, 100) 
        : 0;

    document.getElementById("eps-text").innerText = `${percentage.toFixed(0)}% (Score: ${ts})`;

    // Dynamically update the text color based on percentage thresholds
    if (percentage <= 25) {
        document.getElementById("examPassingStatus").style.background = "var(--EPS-Bad)";    // 0 - 25%
    } else if (percentage <= 50) {
        document.getElementById("examPassingStatus").style.background = "var(--EPS-Meh)";    // 25% - 50%
    } else if (percentage <= 75) {
        document.getElementById("examPassingStatus").style.background = "var(--EPS-Average)"; // 50% - 75%
    } else {
        document.getElementById("examPassingStatus").style.background = "var(--EPS-Good)";   // 75% - 100%
    }

    // Show only the relevant modules based on the saved assignedModules
    const allModules = document.querySelectorAll('[data-module]');
    const savedModules = localStorage.getItem("assignedModules");
    if (savedModules) {
        document.getElementById("firstVisitor").style.display = "none"
        const moduleArray = savedModules.split(',').map(module => module.trim());

        // Hide all module elements first
        allModules.forEach(module => {
            if (!moduleArray.includes(module.getAttribute('data-module'))) {
                module.style.display = 'none';
            } else {
                module.style.display = 'block';
            }
        });
    } else {
        document.getElementById("firstVisitor").style.display = "block"

        allModules.forEach(module => {
            module.style.display = 'none';
        });
    }
});

moduleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const moduleData = link.getAttribute('data-module').replace("-", '_');
        localStorage.setItem("selectedModule", moduleData);
        localStorage.setItem("site_lang", "de");
    });
});