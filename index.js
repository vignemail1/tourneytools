// Fonction pour basculer entre les modes sombre et clair
const toggleThemeButton = document.getElementById('toggleTheme');
const body = document.body;

// Vérifie si l'utilisateur a déjà choisi un mode
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggleThemeButton.textContent = 'Mode Clair'; // Change le texte du bouton
} else {
    body.classList.add('light-mode');
    toggleThemeButton.textContent = 'Mode Sombre'; // Change le texte du bouton
}

// Écouteur d'événements pour le bouton de bascule de thème
toggleThemeButton.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        toggleThemeButton.textContent = 'Mode Sombre'; // Change le texte du bouton
        localStorage.setItem('theme', 'light'); // Sauvegarde le choix dans localStorage
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Mode Clair'; // Change le texte du bouton
        localStorage.setItem('theme', 'dark'); // Sauvegarde le choix dans localStorage
    }
});

// Variables pour gérer le timer
let timerInterval;
let isRunning = false;

// Fonction pour démarrer le timer
function startTimer() {
    if (isRunning) return;
    isRunning = true;

    const timerDisplay = document.getElementById('timer');
    timerInterval = setInterval(() => {
        let currentTime = timerDisplay.innerText.split(':').map(Number);
        let totalSeconds = currentTime[0] * 3600 + currentTime[1] * 60 + currentTime[2];

        // Stocke initialement le temps dans localStorage
        localStorage.setItem('remainingTime', totalSeconds);

        totalSeconds--;
        if (totalSeconds < 0) {
            clearInterval(timerInterval);
            isRunning = false;
            alert("Le temps est écoulé !");
            return;
        }

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        timerDisplay.innerText = `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;

        // Met à jour le temps restant dans localStorage
        localStorage.setItem('remainingTime', totalSeconds);
    }, 1000);
}

// Fonction pour mettre en pause le timer
function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

// Fonction pour réinitialiser le timer
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.innerText = '00:00:00';

    // Réinitialise aussi le temps restant dans localStorage
    localStorage.removeItem('remainingTime');
}

// Écouteurs d'événements pour les boutons de contrôle du timer
document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);

// Fonction pour ajouter du temps au timer
function addTime(seconds) {
    const timerDisplay = document.getElementById('timer');
    let currentTime = timerDisplay.innerText.split(':').map(Number);
    let totalSeconds = currentTime[0] * 3600 + currentTime[1] * 60 + currentTime[2] + seconds;

    // Empêche les valeurs négatives
    if (totalSeconds < 0) totalSeconds = 0;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    timerDisplay.innerText = `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;

    // Met à jour également le temps restant dans localStorage
    localStorage.setItem('remainingTime', totalSeconds);
}

// Fonction pour définir le timer
function setTimer(seconds) {
    const timerDisplay = document.getElementById('timer');
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    timerDisplay.innerText = `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;

    // Stocke également ce nouveau temps dans localStorage
    localStorage.setItem('remainingTime', seconds);
}

// Fonction pour formater les nombres à deux chiffres
function pad(num) {
    return num.toString().padStart(2, '0');
}

// Fonction pour copier les équipes dans le presse-papiers sous forme de liste simple
function copyTeams() {
    // Récupérer la liste des équipes depuis localStorage
    const teamsTextArray = JSON.parse(localStorage.getItem('teams')) || [];

    // Formater la liste pour ne prendre que les noms des membres, séparés par " x "
    const formattedTeamsText = teamsTextArray.map(team => {
        const members = team.split(': ')[1]; // Récupérer uniquement les membres après "Équipe x: "
        return members; // Retourne seulement les membres, sans préfixe.
    }).join('\n'); // Chaque équipe sur une nouvelle ligne

    navigator.clipboard.writeText(formattedTeamsText).then(() => {
        alert("Équipes copiées dans le presse-papiers !");
    }).catch(err => {
        console.error("Erreur lors de la copie : ", err);
    });
}

// Écouteur d'événements pour le bouton "Copier les Équipes"
document.getElementById('copyBtn').addEventListener('click', copyTeams);

// Fonction pour afficher les équipes
function displayTeams(teamsArray) {
    let teamsResultHTML = '<div class="flex flex-wrap gap-x-4 place-items-center">';

    teamsArray.forEach(team => {
        const teamParts = team.split(': ');
        const teamNumberParts = teamParts[0].split(' ');
        const teamWord = 'T';
        const teamNumber = teamNumberParts[1];
        const members = teamParts[1].split(' x ');

        const formattedTeam = `<div class="border px-2 rounded-lg text-center" style="
            min-width: 200px; 
            white-space: nowrap; 
            overflow: hidden;
            text-overflow: ellipsis;
        ">
            ${teamWord} <span class="font-bold text-xl">${teamNumber}</span>: <br>
            ${members.map(member => `<span class="font-bold text-xl">${member}</span>`).join(' x ')}
        </div>`;

        teamsResultHTML += formattedTeam;
    });

    teamsResultHTML += '</div>';

    document.getElementById('teamResult').innerHTML = teamsResultHTML;
}


// Fonction pour générer des équipes aléatoires
function generateTeams() {
    const nameListTextarea = document.getElementById('nameList');
    const teamSizeInput = document.getElementById('teamSize');

    // Récupérer les noms entrés par l'utilisateur
    const namesArray = nameListTextarea.value.split('\n').filter(name => name.trim() !== '');

    // Mélanger les noms aléatoirement
    for (let i = namesArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [namesArray[i], namesArray[j]] = [namesArray[j], namesArray[i]]; // Échange des éléments
    }

    // Créer les équipes en fonction de la taille spécifiée
    const teamSize = parseInt(teamSizeInput.value, 10);

    let teamsArray = []; // Tableau pour stocker les équipes

    for (let i = 0; i < namesArray.length; i += teamSize) {
        teamsArray.push(`Équipe ${Math.ceil((i + 1) / teamSize)}: ${namesArray.slice(i, i + teamSize).join(' x ')}`); // Stocke l'équipe formatée dans un tableau
    }

    // Afficher les équipes générées
    displayTeams(teamsArray);

    // Stocke les équipes dans localStorage sous forme de JSON
    localStorage.setItem('teams', JSON.stringify(teamsArray));
}

// Écouteur d'événements pour le bouton "Générer les Équipes"
document.getElementById('generateBtn').addEventListener('click', generateTeams);

// Récupérer et afficher les contenus des textarea depuis localStorage au chargement de la page
window.onload = function () {
    const freeText1Content = localStorage.getItem('freeText1') || '';
    const freeText2Content = localStorage.getItem('freeText2') || '';

    document.getElementById('freeText1').value = freeText1Content;
    document.getElementById('freeText2').value = freeText2Content;

    // Récupérer et afficher le temps restant depuis localStorage, s'il existe.
    const remainingTimeInSec = parseInt(localStorage.getItem('remainingTime'), 10);

    if (!isNaN(remainingTimeInSec)) {
        setTimer(remainingTimeInSec); // Affichez ce temps sur l'interface utilisateur.
        document.getElementById("timer").innerText = `${pad(Math.floor(remainingTimeInSec / 3600))}:${pad(Math.floor((remainingTimeInSec % 3600) / 60))}:${pad(remainingTimeInSec % 60)}`;

        if (!isRunning) {
            startTimer();
        }
    }

    // Récupérer et afficher la liste des noms depuis localStorage, s'il existe.
    const namesFromLocalStorage = localStorage.getItem("names") || '';

    document.getElementById("nameList").value = namesFromLocalStorage;

    // Récupérer et afficher la liste des équipes depuis localStorage, s'il existe.
    const teamsFromLocalStorage = JSON.parse(localStorage.getItem("teams")) || [];

    if (teamsFromLocalStorage.length > 0) {
        displayTeams(teamsFromLocalStorage);
    }
    updateNameCount();
};

// Sauvegarder les contenus des textarea et de la liste des noms dans localStorage à chaque modification.
document.getElementById('freeText1').addEventListener('input', function () {
    localStorage.setItem('freeText1', this.value);
});

document.getElementById('freeText2').addEventListener('input', function () {
    localStorage.setItem('freeText2', this.value);
});

// Sauvegarder la liste des noms dans localStorage à chaque modification.
document.getElementById("nameList").addEventListener("input", function () {
    localStorage.setItem("names", this.value);
});

// Fonction pour effacer uniquement les équipes générées.
function clearTeams() {
    // Demande de confirmation avant d'effacer
    if (confirm("Êtes-vous sûr de vouloir effacer les équipes ?")) {
        // Supprime les équipes du localStorage
        localStorage.removeItem('teams');

        // Réinitialise l'affichage des équipes
        document.getElementById('teamResult').innerHTML = ''; // Vide le conteneur d'affichage des équipes

        alert("Les équipes ont été effacées !");
    }
}

// Écouteur d'événements pour le bouton "Effacer les Équipes"
document.getElementById("clearTeamsBtn").addEventListener("click", clearTeams);

// Fonction pour calculer le free buy
function calculateFreeBuy(numberOfTeams, teamSize) {
    // Trouver la puissance de teamSize immédiatement inférieure à numberOfTeams
    const powerDown = Math.pow(teamSize, Math.floor(Math.log(numberOfTeams) / Math.log(teamSize)));
    
    // Trouver la puissance de teamSize immédiatement supérieure à numberOfTeams
    const powerUp = Math.pow(teamSize, Math.ceil(Math.log(numberOfTeams) / Math.log(teamSize)));
    
    // Calculer le free buy comme le minimum entre les deux différences
    return Math.min(powerUp - numberOfTeams, numberOfTeams - powerDown);
}

// Fonction pour mettre à jour le nombre de noms et le free buy
function updateNameCount() {
    const nameListTextarea = document.getElementById('nameList');
    const teamSizeInput = document.getElementById('teamSize');
    
    // Compte les lignes non vides dans la zone de texte
    const namesArray = nameListTextarea.value.split('\n').filter(name => name.trim() !== '');
    const numberOfNames = namesArray.length;
    
    // Calcul du nombre d'équipes et du free buy
    const teamSize = parseInt(teamSizeInput.value, 10);
    const numberOfTeams = Math.ceil(numberOfNames / teamSize);
    const freeBuy = calculateFreeBuy(numberOfTeams, teamSize);
    
    // Mise à jour de l'affichage
    document.getElementById('nameCount').innerText = `Nombre de noms : ${numberOfNames}`;
    document.getElementById('freeBuyCount').innerText = `Free Buy : ${freeBuy}`;
}

// Écouteurs d'événements pour mettre à jour le nombre de noms et le free buy
document.getElementById('nameList').addEventListener('input', updateNameCount);
document.getElementById('teamSize').addEventListener('input', updateNameCount);

// Appel initial pour mettre à jour les valeurs au chargement de la page
window.addEventListener('load', updateNameCount);

function clearAllData() {
    if (confirm("Êtes-vous sûr de vouloir tout effacer ?")) {
        localStorage.clear();
        document.getElementById('freeText1').value = '';
        document.getElementById('freeText2').value = '';
        document.getElementById('nameList').value = '';
        document.getElementById('teamResult').innerHTML = '';
        document.getElementById('nameCount').innerText = 'Nombre de noms : 0';
        document.getElementById('freeBuyCount').innerText = 'Free Buy : 0';
        alert("Toutes les données ont été effacées !");
    }
}
document.getElementById('clearBtn').addEventListener('click', clearAllData);