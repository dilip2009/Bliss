// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyD25GDHxuFVzG0Nz4InMUGsJLIWQZgqZ6U",
    authDomain: "bliss-ea384.firebaseapp.com",
    databaseURL: "https://bliss-ea384-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bliss-ea384",
    storageBucket: "bliss-ea384.firebasestorage.app",
    messagingSenderId: "118928717616",
    appId: "1:118928717616:web:16f81aeeec6b7530657af5",
    measurementId: "G-55EQLERM3T"
};
if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const database = firebase.database();

let songIndex = 0, isRepeat = false, currentRoom = "", username = "", isRemoteChange = false, pendingRoom = "";
let audioElement = new Audio();

const songs = [
    {songName: "Dhinam oru kavithai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922617/Dhinam_oru_kavithai_ydli3z.mp3"},
    {songName: "Mudhal Nee Mudivum Nee", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922659/Mudhal-Nee-Mudivum-Nee_bvwsps.mp3"}
    // Add rest of songs here...
];

// UI ELEMENTS
const masterPlay = document.getElementById('masterPlay');
const myProgressBar = document.getElementById('myProgressBar');
const timeCounter = document.getElementById('timeCounter');
const idModal = document.getElementById('idModal');

// MODAL LOGIC
document.getElementById('confirmIdBtn').onclick = () => {
    const val = document.getElementById('usernameInput').value.trim();
    username = val || "USER_" + Math.floor(Math.random()*100);
    idModal.style.display = 'none';
    finalizeConnection();
};

function joinRoom(code) {
    if (!code) return;
    pendingRoom = code.toLowerCase();
    if (!username) { idModal.style.display = 'flex'; } 
    else { finalizeConnection(); }
}

function finalizeConnection() {
    currentRoom = pendingRoom;
    document.getElementById('roomDisplay').innerText = `ROOM:${currentRoom.toUpperCase()}`;
    document.getElementById('chatInput').disabled = false;
    document.getElementById('chatInput').placeholder = "TYPE_MSG...";
    document.getElementById('statusText').innerText = "SESSION_ACTIVE";
    
    database.ref('rooms/' + currentRoom + '/chat').limitToLast(20).on('child_added', snap => {
        const d = snap.val(), div = document.createElement('div');
        div.innerHTML = `<span>${d.user}:</span> ${d.msg}`;
        document.getElementById('chatBox').appendChild(div);
        document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
    });
}

// MUSIC LOGIC
audioElement.ontimeupdate = () => {
    if (audioElement.duration) {
        myProgressBar.value = (audioElement.currentTime / audioElement.duration) * 100;
        let curM = Math.floor(audioElement.currentTime / 60), curS = Math.floor(audioElement.currentTime % 60);
        let durM = Math.floor(audioElement.duration / 60), durS = Math.floor(audioElement.duration % 60);
        timeCounter.innerText = `${curM}:${curS < 10 ? '0'+curS : curS} / ${durM}:${durS < 10 ? '0'+durS : durS}`;
    }
};

// ... Rest of your existing play/pause/sync logic goes here ...

document.getElementById('joinRoomBtn').onclick = () => joinRoom(document.getElementById('roomInput').value.trim());

