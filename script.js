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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let songIndex = 0;
let audioElement = new Audio();
let isRepeat = false;
let currentRoom = "";
let username = "";
let isRemoteChange = false; // Flag to prevent infinite loops

const songs = [
    {songName: "Dhinam oru kavithai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922617/Dhinam_oru_kavithai_ydli3z.mp3"},
    {songName: "Oorum Blood Unplugged", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/q_auto/f_auto/v1777922640/Oorum_Blood_Unplugged_hn4ec7.mp3"},
    {songName: "Theethiriyaai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922646/Theethiriyaai_ppak3k.mp3"},
    {songName: "Oorum Blood", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922647/Oorum_Blood_s4evg1.mp3"},
    {songName: "Nee Kavithaigala", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922656/Nee-Kavithaigala_tfrstv.mp3"},
    {songName: "Mudhal Nee Mudivum Nee", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922659/Mudhal-Nee-Mudivum-Nee_bvwsps.mp3"},
    {songName: "Mellinamae Mellinamae", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961437/Mellinamae_Mellinamae_ozxxyr.mp3"},
    {songName: "Mundhinam Parthene", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961437/Mundhinam-Parthene-MassTamilan.com_b8xtmc.mp3"},
    {songName: "Kannana Kanne", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961443/Kannana-Kanne_nmdmgf.mp3"},
    {songName: "Kannazhaga - Kiss of Love", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961448/Kannazhaga_The_Kiss_of_Love_lqcgmt.mp3"},
    {songName: "Neeyum Naanum Anbe", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961448/Neeyum-Naanum-Anbe-MassTamilan.com_cfecej.mp3"},
    {songName: "Nee Paartha Vizhigal", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961449/Nee_Paartha_Vizhigal_The_Touch_of_Love_ujk1di.mp3"},
    {songName: "Nenjukkul Peidhidum", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961453/Nenjukkul-Peidhidum-MassTamilan.com_nwrsta.mp3"},
    {songName: "Sarakku Vachirukken", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961461/Sarakku_Vachirukken_jdhaev.mp3"},
    {songName: "Po Nee Po - Pain of Love", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961461/Po_Nee_Po_The_Pain_of_Love_hpvghy.mp3"},
    {songName: "Minnalai Pidithu", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961462/Minnalai_Pidithu_aq4jzh.mp3"},
    {songName: "Why This Kolaveri Di", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961471/Why_This_Kolaveri_Di_The_Soup_of_Love_bnkj9u.mp3"},
    {songName: "Vennilavae", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961477/Vennilavae_bb39g0.mp3"},
    {songName: "Unnaal Unnaal", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961481/Unnaal-Unnaal_sxxnqq.mp3"},
    {songName: "Poo Pookum Oosai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961481/Poo-Pookum-Osai_mbrhmr.mp3"},
    {songName: "Ambikapathy", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961484/Ambikapathy_zyejjb.mp3"},
    {songName: "Anbil Avan", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961484/Anbil-Avan_qtmxvf.mp3"},
    {songName: "Dheema", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961493/Dheema_t8xt0.mp3"},
    {songName: "Idhazhin Oram", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961497/Idhazhin_Oram_The_Innocence_of_Love_wdc6kc.mp3"},
    {songName: "Ava Enna Enna", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961497/Ava-Enna-Enna-MassTamilan.com_iaum33.mp3"},
    {songName: "Come on Girls", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961500/Come_on_Girls_The_Celebration_of_Love_frisra.mp3"},
    {songName: "Annul Maelae", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961501/Annul-Maelae-MassTamilan.com_t7qu3g.mp3"},
    {songName: "Adiyae Kolluthey", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961514/Adiyae-Kolluthey-MassTamilan.com_t5mtzj.mp3"}
];

// --- SYNC ENGINE ---
function pushMusicUpdate() {
    if (!currentRoom || isRemoteChange) return;
    database.ref('rooms/' + currentRoom + '/music_sync').set({
        index: songIndex,
        playing: !audioElement.paused,
        time: audioElement.currentTime,
        sender: username
    });
}

function handleMusicSync(data) {
    if (data.sender === username) return;
    isRemoteChange = true;
    
    // Switch song if index changed
    if (songIndex !== data.index) {
        songIndex = data.index;
        audioElement.src = songs[songIndex].filePath;
        document.getElementById('masterSongName').innerText = songs[songIndex].songName;
    }

    // Play or Pause
    if (data.playing) {
        if(Math.abs(audioElement.currentTime - data.time) > 2) audioElement.currentTime = data.time;
        audioElement.play();
        document.getElementById('masterPlay').className = 'fas fa-pause-circle';
    } else {
        audioElement.pause();
        document.getElementById('masterPlay').className = 'far fa-play-circle';
    }
    
    setTimeout(() => { isRemoteChange = false; }, 1000);
}



// State Variables
let songIndex = 0;
let audioElement = new Audio();
let isRepeat = false;
let currentRoom = "";
let username = "";
let isRemoteChange = false;

const songs = [
    {songName: "Dhinam oru kavithai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922617/Dhinam_oru_kavithai_ydli3z.mp3"},
    {songName: "Oorum Blood Unplugged", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922640/Oorum_Blood_Unplugged_hn4e9f.mp3"},
    {songName: "Theethiriyaai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922646/Theethiriyaai_ppak3k.mp3"},
    {songName: "Oorum Blood", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922647/Oorum_Blood_s4evg1.mp3"},
    {songName: "Nee Kavithaigala", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922656/Nee-Kavithaigala_tfrstv.mp3"},
    {songName: "Mudhal Nee Mudivum Nee", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777922659/Mudhal-Nee-Mudivum-Nee_bvwsps.mp3"},
    {songName: "Mellinamae Mellinamae", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961437/Mellinamae_Mellinamae_ozxxyr.mp3"},
    {songName: "Mundhinam Parthene", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961437/Mundhinam-Parthene-MassTamilan.com_b8xtmc.mp3"},
    {songName: "Kannana Kanne", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961443/Kannana-Kanne_nmdmgf.mp3"},
    {songName: "Kannazhaga - Kiss of Love", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961448/Kannazhaga_The_Kiss_of_Love_lqcgmt.mp3"},
    {songName: "Neeyum Naanum Anbe", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961448/Neeyum-Naanum-Anbe-MassTamilan.com_cfecej.mp3"},
    {songName: "Nee Paartha Vizhigal", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961449/Nee_Paartha_Vizhigal_The_Touch_of_Love_ujk1di.mp3"},
    {songName: "Nenjukkul Peidhidum", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961453/Nenjukkul-Peidhidum-MassTamilan.com_nwrsta.mp3"},
    {songName: "Sarakku Vachirukken", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961461/Sarakku_Vachirukken_jdhaev.mp3"},
    {songName: "Po Nee Po - Pain of Love", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961461/Po_Nee_Po_The_Pain_of_Love_hpvghy.mp3"},
    {songName: "Minnalai Pidithu", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961462/Minnalai_Pidithu_aq4jzh.mp3"},
    {songName: "Why This Kolaveri Di", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961471/Why_This_Kolaveri_Di_The_Soup_of_Love_bnkj9u.mp3"},
    {songName: "Vennilavae", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961477/Vennilavae_bb39g0.mp3"},
    {songName: "Unnaal Unnaal", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961481/Unnaal-Unnaal_sxxnqq.mp3"},
    {songName: "Poo Pookum Oosai", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961481/Poo-Pookum-Osai_mbrhmr.mp3"},
    {songName: "Ambikapathy", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961484/Ambikapathy_zyejjb.mp3"},
    {songName: "Anbil Avan", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961484/Anbil-Avan_qtmxvf.mp3"},
    {songName: "Dheema", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961493/Dheema_t8xt0.mp3"},
    {songName: "Idhazhin Oram", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961497/Idhazhin_Oram_The_Innocence_of_Love_wdc6kc.mp3"},
    {songName: "Ava Enna Enna", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961497/Ava-Enna-Enna-MassTamilan.com_iaum33.mp3"},
    {songName: "Come on Girls", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961500/Come_on_Girls_The_Celebration_of_Love_frisra.mp3"},
    {songName: "Annul Maelae", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961501/Annul-Maelae-MassTamilan.com_t7qu3g.mp3"},
    {songName: "Adiyae Kolluthey", filePath: "https://res.cloudinary.com/dch4lm2no/video/upload/v1777961514/Adiyae-Kolluthey-MassTamilan.com_t5mtzj.mp3"}
];

// --- MUSIC SYNC LOGIC ---
function pushMusicUpdate() {
    if (!currentRoom || isRemoteChange) return;
    database.ref('rooms/' + currentRoom + '/music_sync').set({
        index: songIndex,
        playing: !audioElement.paused,
        time: audioElement.currentTime,
        sender: username
    });
}

function handleMusicSync(data) {
    if (data.sender === username) return;
    isRemoteChange = true;
    
    if (songIndex !== data.index) {
        songIndex = data.index;
        audioElement.src = songs[songIndex].filePath;
        document.getElementById('masterSongName').innerText = songs[songIndex].songName;
    }

    if (data.playing) {
        if(Math.abs(audioElement.currentTime - data.time) > 2) audioElement.currentTime = data.time;
        audioElement.play();
        document.getElementById('masterPlay').className = 'fas fa-pause-circle';
    } else {
        audioElement.pause();
        document.getElementById('masterPlay').className = 'far fa-play-circle';
    }
    
    setTimeout(() => { isRemoteChange = false; }, 1000);
}

// --- PLAYER CORE ---
function loadSong() {
    audioElement.src = songs[songIndex].filePath;
    document.getElementById('masterSongName').innerText = songs[songIndex].songName;
    audioElement.play();
    document.getElementById('masterPlay').className = 'fas fa-pause-circle';
    pushMusicUpdate();
}

document.getElementById('masterPlay').onclick = () => {
    if (audioElement.paused) audioElement.play(); else audioElement.pause();
    document.getElementById('masterPlay').className = audioElement.paused ? 'far fa-play-circle' : 'fas fa-pause-circle';
    pushMusicUpdate();
};

document.getElementById('next').onclick = () => { songIndex = (songIndex + 1) % songs.length; loadSong(); };
document.getElementById('previous').onclick = () => { songIndex = (songIndex - 1 + songs.length) % songs.length; loadSong(); };

audioElement.ontimeupdate = () => {
    if (audioElement.duration) {
        document.getElementById('myProgressBar').value = (audioElement.currentTime / audioElement.duration) * 100;
        let curM = Math.floor(audioElement.currentTime / 60);
        let curS = Math.floor(audioElement.currentTime % 60);
        let durM = Math.floor(audioElement.duration / 60);
        let durS = Math.floor(audioElement.duration % 60);
        document.getElementById('timeCounter').innerText = `${curM}:${curS < 10 ? '0'+curS : curS} / ${durM}:${durS < 10 ? '0'+durS : durS}`;
    }
};

// --- CHAT & ROOM LOGIC ---
function joinRoom(code) {
    if(!username) username = prompt("IDENTIFY:") || "USER_" + Math.floor(Math.random()*100);
    currentRoom = code.toLowerCase();
    document.getElementById('roomDisplay').innerText = `COMM_LINK::${currentRoom.toUpperCase()}`;
    document.getElementById('chatInput').disabled = false;
    document.getElementById('chatInput').placeholder = "TYPE_MESSAGE...";

    database.ref('rooms/' + currentRoom + '/chat').limitToLast(15).on('child_added', (snap) => {
        const d = snap.val();
        const div = document.createElement('div');
        div.style.marginBottom = "5px";
        div.innerHTML = `<span>${d.user}:</span> ${d.msg}`;
        document.getElementById('chatBox').appendChild(div);
        document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
    });

    database.ref('rooms/' + currentRoom + '/music_sync').on('value', (snap) => {
        const data = snap.val();
        if (data) handleMusicSync(data);
    });
}

// FIX: ENTER KEY FOR ROOM CODE
document.getElementById('roomInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let code = e.target.value.trim();
        if(code) {
            joinRoom(code);
            e.target.value = "";
        }
    }
});

document.getElementById('joinRoomBtn').onclick = () => {
    let code = document.getElementById('roomInput').value.trim();
    if(code) {
        joinRoom(code);
        document.getElementById('roomInput').value = "";
    }
};

document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.value.trim() && currentRoom) {
        database.ref('rooms/' + currentRoom + '/chat').push().set({ user: username, msg: e.target.value });
        e.target.value = "";
    }
});

function init() {
    const cont = document.getElementById('songItemContainer');
    songs.forEach((s, i) => {
        let div = document.createElement('div');
        div.className = "song-item";
        div.innerHTML = `<span>${s.songName}</span> <i class="far fa-play-circle"></i>`;
        div.onclick = () => { songIndex = i; loadSong(); };
        cont.appendChild(div);
    });
}

document.getElementById('libraryBtn').onclick = () => {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('playlistSection').style.display = 'block';
    document.getElementById('libraryBtn').classList.add('active_cyb');
    document.getElementById('homeBtn').classList.remove('active_cyb');
};

document.getElementById('homeBtn').onclick = () => {
    document.getElementById('homeSection').style.display = 'block';
    document.getElementById('playlistSection').style.display = 'none';
    document.getElementById('homeBtn').classList.add('active_cyb');
    document.getElementById('libraryBtn').classList.remove('active_cyb');
};

init();

