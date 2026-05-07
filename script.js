const firebaseConfig = {
    apiKey: "AIzaSyD25GDHxuFVzG0Nz4InMUGsJLIWQZgqZ6U",
    authDomain: "bliss-ea384.firebaseapp.com",
    databaseURL: "https://bliss-ea384-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bliss-ea384",
    storageBucket: "bliss-ea384.firebasestorage.app",
    messagingSenderId: "118928717616",
    appId: "1:118928717616:web:16f81aeeec6b7530657af5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let audio = new Audio();
let currentRoom = "";
let username = "";

const songs = [
    {songName: "Dhinam oru kavithai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922617/Dhinam_oru_kavithai_ydli3z.mp3"},
    {songName: "Mudhal Nee Mudivum Nee", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922659/Mudhal-Nee-Mudivum-Nee_bvwsps.mp3"}
];

// UI Toggle logic
document.getElementById('libraryBtn').onclick = () => {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('playlistSection').style.display = 'block';
    document.getElementById('libraryBtn').classList.add('active_cyb');
    document.getElementById('homeBtn').classList.remove('active_cyb');
};

document.getElementById('homeBtn').onclick = () => {
    document.getElementById('playlistSection').style.display = 'none';
    document.getElementById('homeSection').style.display = 'block';
    document.getElementById('homeBtn').classList.add('active_cyb');
    document.getElementById('libraryBtn').classList.remove('active_cyb');
};

// Play Logic
document.getElementById('masterPlay').onclick = () => {
    if (audio.paused) {
        audio.play();
        document.getElementById('masterPlay').classList.replace('fa-play-circle', 'fa-pause-circle');
    } else {
        audio.pause();
        document.getElementById('masterPlay').classList.replace('fa-pause-circle', 'fa-play-circle');
    }
};

// Volume
document.getElementById('volumeBar').oninput = (e) => {
    audio.volume = e.target.value;
};

// Progress
audio.ontimeupdate = () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    document.getElementById('myProgressBar').value = progress || 0;
    
    let curM = Math.floor(audio.currentTime / 60);
    let curS = Math.floor(audio.currentTime % 60);
    let durM = Math.floor(audio.duration / 60) || 0;
    let durS = Math.floor(audio.duration % 60) || 0;
    document.getElementById('timeCounter').innerText = `${curM}:${curS < 10 ? '0'+curS : curS} / ${durM}:${durS < 10 ? '0'+durS : durS}`;
};

// Room Join
document.getElementById('joinRoomBtn').onclick = () => {
    currentRoom = document.getElementById('roomInput').value;
    if(currentRoom) {
        document.getElementById('idModal').style.display = 'flex';
    }
};

document.getElementById('confirmIdBtn').onclick = () => {
    username = document.getElementById('usernameInput').value || "ANON";
    document.getElementById('idModal').style.display = 'none';
    document.getElementById('roomDisplay').innerText = `ROOM: ${currentRoom}`;
    document.getElementById('chatInput').disabled = false;
};

