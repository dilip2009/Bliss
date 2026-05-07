const firebaseConfig = {
    apiKey: "AIzaSyD25GDHxuFVzG0Nz4InMUGsJLIWQZgqZ6U",
    authDomain: "bliss-ea384.firebaseapp.com",
    databaseURL: "https://bliss-ea384-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bliss-ea384",
    storageBucket: "bliss-ea384.firebasestorage.app",
    messagingSenderId: "118928717616",
    appId: "1:118928717616:web:16f81aeeec6b7530657af5"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let audioElement = new Audio();
let songIndex = 0;
let currentRoom = "";
let username = "";
let isRepeat = false;

const songs = [
    {songName: "Dhinam oru kavithai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922617/Dhinam_oru_kavithai_ydli3z.mp3"},
    {songName: "Oorum Blood Unplugged", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/q_auto/f_auto/v1777922640/Oorum_Blood_Unplugged_hn4ec7.mp3"},
    {songName: "Theethiriyaai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922646/Theethiriyaai_ppak3k.mp3"},
    {songName: "Oorum Blood", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922647/Oorum_Blood_s4evg1.mp3"},
    {songName: "Nee Kavithaigala", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922656/Nee-Kavithaigala_tfrstv.mp3"},
    {songName: "Mudhal Nee Mudivum Nee", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/q_auto/f_auto/v1777922659/Mudhal-Nee-Mudivum-Nee_bvyanx.mp3"}
];

// RENDER ARCHIVE
const songContainer = document.getElementById('songItemContainer');
songs.forEach((song, i) => {
    let div = document.createElement('div');
    div.className = 'song-item';
    div.innerHTML = `<span>${song.songName}</span><i class="far fa-play-circle songItemPlay" id="${i}"></i>`;
    songContainer.appendChild(div);
});

// NAVIGATION
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

// ROOM & MODAL
document.getElementById('joinRoomBtn').onclick = () => {
    currentRoom = document.getElementById('roomInput').value.trim();
    if(currentRoom) document.getElementById('idModal').style.display = 'flex';
};

document.getElementById('confirmIdBtn').onclick = () => {
    username = document.getElementById('usernameInput').value.trim() || "USER_" + Math.floor(Math.random()*100);
    document.getElementById('idModal').style.display = 'none';
    document.getElementById('roomDisplay').innerText = `ROOM: ${currentRoom}`;
    document.getElementById('chatInput').disabled = false;
    setupChat();
};

function setupChat() {
    database.ref('rooms/' + currentRoom + '/chat').limitToLast(20).on('child_added', snap => {
        const d = snap.val(), div = document.createElement('div');
        div.innerHTML = `<span>${d.user}:</span> ${d.msg}`;
        document.getElementById('chatBox').appendChild(div);
        document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
    });
}

// AUDIO LOGIC
const masterPlay = document.getElementById('masterPlay');
masterPlay.onclick = () => {
    if (!audioElement.src) { 
        audioElement.src = songs.filePath; 
        document.getElementById('masterSongName').innerText = songs.songName; 
    }
    if (audioElement.paused) { 
        audioElement.play(); 
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
    } else { 
        audioElement.pause(); 
        masterPlay.classList.replace('fa-pause-circle', 'fa-play-circle');
    }
};

audioElement.ontimeupdate = () => {
    if (audioElement.duration) {
        document.getElementById('myProgressBar').value = (audioElement.currentTime / audioElement.duration) * 100;
        let curM = Math.floor(audioElement.currentTime / 60), curS = Math.floor(audioElement.currentTime % 60);
        let durM = Math.floor(audioElement.duration / 60), durS = Math.floor(audioElement.duration % 60);
        document.getElementById('timeCounter').innerText = `${curM}:${curS < 10 ? '0'+curS : curS} / ${durM}:${durS < 10 ? '0'+durS : durS}`;
    }
};

document.getElementById('volumeBar').oninput = (e) => audioElement.volume = e.target.value;

Array.from(document.getElementsByClassName('songItemPlay')).forEach(el => {
    el.onclick = (e) => {
        songIndex = parseInt(e.target.id);
        document.getElementById('masterSongName').innerText = songs[songIndex].songName;
        audioElement.src = songs[songIndex].filePath;
        audioElement.play();
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
    }
});

