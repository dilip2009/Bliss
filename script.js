// --- FIREBASE SETUP ---
const firebaseConfig = {
    apiKey: "AIzaSyD25GDHxuFVzG0Nz4InMUGsJLIWQZgqZ6U",
    authDomain: "bliss-ea384.firebaseapp.com",
    databaseURL: "https://bliss-ea384-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bliss-ea384",
    storageBucket: "bliss-ea384.firebasestorage.app",
    messagingSenderId: "118928717616",
    appId: "1:118928717616:web:16f81aeeec6b7530657af5"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const database = firebase.database();

// --- GLOBALS ---
let audioElement = new Audio();
let songIndex = 0;
let currentRoom = "";
let username = "";

// --- SONG DATABASE ---
const songs = [
    { songName: "Dhinam oru kavithai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922617/Dhinam_oru_kavithai_ydli3z.mp3" },
    { songName: "Oorum Blood Unplugged", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/q_auto/f_auto/v1777922640/Oorum_Blood_Unplugged_hn4ec7.mp3" },
    { songName: "Theethiriyaai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922646/Theethiriyaai_ppak3k.mp3" }
];

// --- RENDER SONGS TO ARCHIVE ---
const songContainer = document.getElementById('songItemContainer');
songs.forEach((song, i) => {
    let div = document.createElement('div');
    div.className = 'song-item';
    div.innerHTML = `
        <span>${song.songName}</span>
        <i class="far fa-play-circle songItemPlay" id="${i}"></i>
    `;
    songContainer.appendChild(div);
});

// --- NAVIGATION TABS ---
document.getElementById('libraryBtn').addEventListener('click', () => {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('playlistSection').style.display = 'block';
    document.getElementById('libraryBtn').classList.add('active_cyb');
    document.getElementById('homeBtn').classList.remove('active_cyb');
});

document.getElementById('homeBtn').addEventListener('click', () => {
    document.getElementById('playlistSection').style.display = 'none';
    document.getElementById('homeSection').style.display = 'block';
    document.getElementById('homeBtn').classList.add('active_cyb');
    document.getElementById('libraryBtn').classList.remove('active_cyb');
});

// --- MODAL & ROOM LOGIC ---
const idModal = document.getElementById('idModal');

document.getElementById('joinRoomBtn').addEventListener('click', () => {
    let inputRoom = document.getElementById('roomInput').value.trim();
    if (inputRoom) {
        currentRoom = inputRoom;
        idModal.style.display = 'flex';
    }
});

document.getElementById('confirmIdBtn').addEventListener('click', () => {
    let inputName = document.getElementById('usernameInput').value.trim();
    username = inputName || "USER_" + Math.floor(Math.random() * 1000);

    idModal.style.display = 'none';
    document.getElementById('roomDisplay').innerText = `ROOM: ${currentRoom}`;
    document.getElementById('chatInput').disabled = false;
    document.getElementById('chatInput').placeholder = "TYPE MESSAGE...";
});

// --- AUDIO CONTROLS ---
const masterPlay = document.getElementById('masterPlay');
const masterSongName = document.getElementById('masterSongName');
const myProgressBar = document.getElementById('myProgressBar');
const timeCounter = document.getElementById('timeCounter');
const volumeBar = document.getElementById('volumeBar');

// Play/Pause
masterPlay.addEventListener('click', () => {
    if (!audioElement.src) {
        audioElement.src = songs.filePath;
        masterSongName.innerText = songs.songName;
    }

    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
    }
});

// Update Progress Bar
audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration) {
        let progress = parseFloat((audioElement.currentTime / audioElement.duration) * 100);
        myProgressBar.value = progress;

        // Timer Text
        let curM = Math.floor(audioElement.currentTime / 60);
        let curS = Math.floor(audioElement.currentTime % 60);
        let durM = Math.floor(audioElement.duration / 60);
        let durS = Math.floor(audioElement.duration % 60);

        if (curS < 10) curS = `0${curS}`;
        if (durS < 10) durS = `0${durS}`;

        timeCounter.innerText = `${curM}:${curS} / ${durM}:${durS}`;
    }
});

// Seek Audio
myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
});

// Volume Control
volumeBar.addEventListener('input', (e) => {
    audioElement.volume = e.target.value;
});

// Play Specific Song from List
Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
    element.addEventListener('click', (e) => {
        songIndex = parseInt(e.target.id);
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.src = songs[songIndex].filePath;
        audioElement.currentTime = 0;
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    })
});

// Next / Prev Buttons
document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex >= songs.length - 1) ? 0 : songIndex + 1;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
});

document.getElementById('previous').addEventListener('click', () => {
    songIndex = (songIndex <= 0) ? songs.length - 1 : songIndex - 1;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
});

