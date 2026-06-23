// ===================================================
// EFEK SUARA
// ===================================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let isSoundOn = true;

function getAudioContext() {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
}

function playSound(type) {
    if (!isSoundOn) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.15;
        const now = ctx.currentTime;
        switch (type) {
            case 'click':
                osc.frequency.setValueAtTime(800, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now); osc.stop(now + 0.08); break;
            case 'correct':
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.1);
                osc.frequency.setValueAtTime(784, now + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now); osc.stop(now + 0.35); break;
            case 'wrong':
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.setValueAtTime(300, now + 0.1);
                osc.frequency.setValueAtTime(200, now + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now); osc.stop(now + 0.3); break;
            case 'gameover':
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.setValueAtTime(400, now + 0.15);
                osc.frequency.setValueAtTime(200, now + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now); osc.stop(now + 0.5); break;
            case 'timer':
                osc.frequency.setValueAtTime(1000, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now); osc.stop(now + 0.05); break;
            default: break;
        }
    } catch (e) {}
}

function hapticFeedback(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}

// ===================================================
// KONFETTI
// ===================================================
function showConfetti() {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#1dd1a1'];
    for (let i = 0; i < 60; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position: fixed; top: -10px; left: ${Math.random() * 100}%;
            width: ${Math.random() * 10 + 5}px; height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            z-index: 999999; pointer-events: none;
            animation: confettiFall ${Math.random() * 2 + 1.5}s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
            transform: rotate(${Math.random() * 360}deg);
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    }
}

// ===================================================
// FLASH EFEK
// ===================================================
function flashEffect(type) {
    const card = document.querySelector('.glass-card');
    card.classList.remove('flash-correct', 'flash-wrong', 'flash-neutral');
    if (type === 'correct') {
        card.classList.add('flash-correct');
    } else if (type === 'wrong') {
        card.classList.add('flash-wrong');
    } else {
        card.classList.add('flash-neutral');
    }
    setTimeout(() => {
        card.classList.remove('flash-correct', 'flash-wrong');
        card.classList.add('flash-neutral');
    }, 400);
}

// ===================================================
// OVERLAY SALAH (logo silang + getar)
// ===================================================
function showWrongOverlay() {
    const overlay = document.getElementById('wrongOverlay');
    overlay.classList.remove('hidden', 'shake-overlay');
    // Paksa reflow agar animasi shake bisa diulang
    void overlay.offsetWidth;
    overlay.classList.add('shake-overlay');
    hapticFeedback([80, 60, 80, 60, 80]);
    playSound('wrong');
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('shake-overlay');
    }, 900);
}

document.addEventListener(
    "click",
    () => {

        const music =
        document.getElementById("bgMusic");

        music.volume = 0.4;

        music.play();

    },
    { once:true }
);

// ===================================================
// SPLASH
// ===================================================
setTimeout(() => {
    document.getElementById('splash-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}, 3000);

function showMenu(){

    const music =
    document.getElementById("bgMusic");

    music.volume = 0.4;

    music.play();

    document
        .getElementById("start-screen")
        .classList.add("hidden");

    document
        .getElementById("menu-screen")
        .classList.remove("hidden");

    loadBestScore();
}

// ===================================================
// DATABASE SOAL
// ===================================================
const questions = {
    mudah: [
        "Jika listrik padam di rumah, benda apa yang biasanya pertama kali dicari orang untuk penerangan?",
        "Sebutkan makanan yang sering disajikan saat acara ulang tahun di Indonesia.",
        "Sebutkan barang yang hampir selalu dibawa seseorang saat bepergian keluar rumah.",
        "Sebutkan aktivitas yang sering dilakukan orang sebelum tidur pada malam hari.",
        "Sebutkan tempat yang biasanya dikunjungi keluarga saat akhir pekan.",
        "Sebutkan benda yang biasanya ada di dalam tas pelajar.",
        "Sebutkan kegiatan yang sering dilakukan saat liburan sekolah.",
        "Sebutkan makanan yang sering dijual di kantin sekolah.",
        "Sebutkan aplikasi yang sering digunakan untuk menonton video.",
        "Sebutkan alasan seseorang pergi ke pasar."
    ],
    sedang: [
        "Sebutkan alasan yang sering digunakan siswa ketika terlambat datang ke sekolah.",
        "Sebutkan aplikasi yang paling sering digunakan masyarakat untuk berkomunikasi secara online.",
        "Sebutkan pekerjaan yang dianggap memiliki tanggung jawab besar terhadap keselamatan orang lain.",
        "Sebutkan barang elektronik yang hampir selalu ada di setiap rumah modern.",
        "Sebutkan hal yang biasanya dilakukan seseorang ketika menerima gaji atau uang bulanan.",
        "Sebutkan alasan seseorang memilih berbelanja secara online dibandingkan datang langsung ke toko.",
        "Sebutkan tempat yang sering dikunjungi seseorang ketika membutuhkan suasana tenang untuk belajar atau bekerja.",
        "Sebutkan barang yang biasanya dibeli ketika seseorang baru pindah ke rumah baru.",
        "Sebutkan aktivitas yang sering dilakukan masyarakat saat menunggu kendaraan umum.",
        "Sebutkan alasan seseorang memutuskan untuk mengganti ponsel yang masih berfungsi."
    ],
    sulit: [
        "Sebutkan faktor yang sering menjadi pertimbangan seseorang sebelum membeli sebuah smartphone baru.",
        "Sebutkan alasan yang membuat seseorang memilih melanjutkan pendidikan ke perguruan tinggi.",
        "Sebutkan keterampilan yang dianggap penting untuk sukses di dunia kerja pada era digital saat ini.",
        "Sebutkan tantangan yang sering dihadapi seseorang ketika memulai sebuah usaha dari nol.",
        "Sebutkan teknologi yang diperkirakan akan memberikan dampak besar terhadap kehidupan manusia dalam 10 tahun mendatang.",
        "Sebutkan alasan yang membuat sebuah perusahaan gagal berkembang meskipun memiliki modal yang cukup besar.",
        "Sebutkan faktor yang biasanya memengaruhi seseorang dalam memilih tempat bekerja.",
        "Sebutkan hal yang perlu dipersiapkan seseorang sebelum melakukan wawancara kerja.",
        "Sebutkan dampak positif perkembangan teknologi terhadap kehidupan sehari-hari masyarakat.",
        "Sebutkan inovasi teknologi yang saat ini banyak digunakan untuk meningkatkan produktivitas manusia."
    ]
};

// ===================================================
// DATABASE JAWABAN BENAR (1 jawaban per soal)
// ===================================================
const answers = {
    mudah: [
        "lilin",
        "kue",
        "hp",
        "gosok gigi",
        "mall",
        "buku",
        "jalan-jalan",
        "nasi goreng",
        "youtube",
        "belanja"
    ],
    sedang: [
        "macet",
        "whatsapp",
        "dokter",
        "televisi",
        "bayar tagihan",
        "murah",
        "perpustakaan",
        "kasur",
        "main hp",
        "rusak"
    ],
    sulit: [
        "harga",
        "pekerjaan",
        "komunikasi",
        "modal",
        "ai",
        "manajemen",
        "gaji",
        "cv",
        "komunikasi",
        "ai"
    ]
};

// ===================================================
// VARIABEL GAME
// ===================================================
let currentQuestions = [];
let currentAnswers = [];
let currentIndex = 0;
let score = 0;
let lives = 3;
let timer = null;
let timeLeft = 30;
let totalCorrect = 0;
let totalWrong = 0;
let levelName = '';
let answerLocked = false;

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startGame(level) {
    playSound('click');
    levelName = level;
    document.querySelector('.back-btn').style.display = 'flex';
    document.querySelector('.hamburger').style.display = 'flex';

    // Acak soal beserta jawaban bersamaan agar tetap sinkron
    const indices = shuffleArray([...Array(questions[level].length).keys()]);
    currentQuestions = indices.map(i => questions[level][i]);
    currentAnswers = indices.map(i => answers[level][i]);

    currentIndex = 0;
    score = 0;
    lives = 3;
    totalCorrect = 0;
    totalWrong = 0;
    answerLocked = false;
    document.getElementById('score').innerText = score;
    updateLives();
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    flashEffect('neutral');
    loadQuestion();
}

function loadQuestion() {
    if (currentIndex >= currentQuestions.length) {
        finishGame();
        return;
    }
    answerLocked = false;
    document.getElementById('question').innerText = currentQuestions[currentIndex];
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
    document.getElementById('message').innerText = '';
    let progress = ((currentIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById('timer').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 5 && timeLeft > 0) {
            playSound('timer');
            if (timeLeft <= 3) hapticFeedback(50);
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            wrongAnswer();
        }
    }, 1000);
}

function checkAnswer(){
    if (answerLocked) return;

    const input = document.getElementById("answerInput").value.trim().toLowerCase();

    if(input.length < 3){
        playSound('wrong');
        document.getElementById("message").innerText = "⚠️ Jawaban terlalu pendek";
        return;
    }

    const correctAnswer = currentAnswers[currentIndex].toLowerCase();

    // Cek apakah jawaban mengandung kata kunci yang benar
    if (input === correctAnswer || input.includes(correctAnswer) || correctAnswer.includes(input)) {
        // BENAR
        clearInterval(timer);
        answerLocked = true;
        playSound('correct');
        score += 20;
        totalCorrect++;
        document.getElementById("score").innerText = score;
        document.getElementById("message").innerText = "✅ Jawaban diterima!";
        flashEffect('correct');
        setTimeout(() => {
            currentIndex++;
            loadQuestion();
        }, 1000);
    } else {
        // SALAH — tampilkan overlay silang + getar
        answerLocked = true;
        flashEffect('wrong');
        showWrongOverlay();
        document.getElementById("message").innerText = "❌ Jawaban salah, coba lagi!";
        setTimeout(() => {
            answerLocked = false;
            document.getElementById("answerInput").value = '';
            document.getElementById("answerInput").focus();
            document.getElementById("message").innerText = '';
        }, 950);
    }
}
    

function wrongAnswer() {
    lives--;
    totalWrong++;
    updateLives();
    playSound('wrong');
    flashEffect('wrong');
    showWrongOverlay();
    hapticFeedback([50, 70, 50]);
    if (lives <= 0) {
        finishGame();
        return;
    }
    setTimeout(() => {
        currentIndex++;
        loadQuestion();
    }, 950);
}

function updateLives() {
    document.getElementById('life1').style.opacity = lives >= 1 ? 1 : .2;
    document.getElementById('life2').style.opacity = lives >= 2 ? 1 : .2;
    document.getElementById('life3').style.opacity = lives >= 3 ? 1 : .2;
}

function finishGame() {
    clearInterval(timer);
    saveBestScore();
    saveStats();
    playSound('gameover');
    if (score >= 150) {
        setTimeout(showConfetti, 300);
        setTimeout(showConfetti, 800);
    }
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('finalScore').innerText = score;
    const statsDiv = document.querySelector('.result-stats');
    const correct = totalCorrect;
    const wrong = totalWrong;
    const total = correct + wrong;
    const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
    statsDiv.innerHTML = `
        <div>✅ Benar: ${correct} &nbsp;|&nbsp; ❌ Salah: ${wrong}</div>
        <div>📊 Akurasi: ${acc}% &nbsp;|&nbsp; 🏷️ ${levelName.charAt(0).toUpperCase() + levelName.slice(1)}</div>
    `;
    document.querySelector('.back-btn').style.display = 'none';
}

function mainLagi() {
    playSound('click');
    clearInterval(timer);
    document.querySelector('.back-btn').style.display = 'flex';
    document.querySelector('.hamburger').style.display = 'flex';
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
    loadBestScore();
}

// ===================================================
// STATISTIK
// ===================================================
function saveStats() {
    let games = parseInt(localStorage.getItem('gameCount') || '0') + 1;
    let corr = parseInt(localStorage.getItem('totalCorrect') || '0') + totalCorrect;
    let wrg = parseInt(localStorage.getItem('totalWrong') || '0') + totalWrong;
    localStorage.setItem('gameCount', games);
    localStorage.setItem('totalCorrect', corr);
    localStorage.setItem('totalWrong', wrg);
}

function saveBestScore() {
    let best = localStorage.getItem('bestScore');
    if (best === null || score > Number(best)) {
        localStorage.setItem('bestScore', score);
    }
}
function loadBestScore() {
    let best = localStorage.getItem('bestScore');
    document.getElementById('bestScore').innerText = best || 0;
}

// ===================================================
// SHARE KE WHATSAPP
// ===================================================
function shareResult() {
    const finalScore = document.getElementById('finalScore').innerText;
    const best = localStorage.getItem('bestScore') || '0';
    const games = localStorage.getItem('gameCount') || '0';
    const corr = localStorage.getItem('totalCorrect') || '0';
    const wrg = localStorage.getItem('totalWrong') || '0';
    const total = parseInt(corr) + parseInt(wrg);
    const acc = total > 0 ? Math.round((parseInt(corr) / total) * 100) : 0;
    const text = `🎮 RERE KUIS Premium\n\nSkor Akhir: ${finalScore}\n🏆 Skor Tertinggi: ${best}\n✅ Benar: ${corr}\n❌ Salah: ${wrg}\n🎯 Akurasi: ${acc}%\n📊 Total Main: ${games}x\n\nAyo coba juga! 🚀`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// ===================================================
// SOUND TOGGLE
// ===================================================
function toggleSound() {
    isSoundOn = !isSoundOn;
    const btn = document.querySelector('.sound-toggle');
    if (btn) btn.innerText = isSoundOn ? '🔊' : '🔇';
    playSound('click');
}

// ===================================================
// MENU SAMPING
// ===================================================
function toggleMenu() {
    playSound('click');
    document.getElementById('sideMenu').classList.toggle('active');
}

function goHome() {
    playSound('click');
    clearInterval(timer);
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
    document.getElementById('sideMenu').classList.remove('active');
    document.querySelector('.back-btn').style.display = 'flex';
    document.querySelector('.hamburger').style.display = 'flex';
    loadBestScore();
}

function showLeaderboard() {
    playSound('click');
    const best = localStorage.getItem('bestScore') || '0';
    const games = localStorage.getItem('gameCount') || '0';
    const corr = localStorage.getItem('totalCorrect') || '0';
    const wrg = localStorage.getItem('totalWrong') || '0';
    const total = parseInt(corr) + parseInt(wrg);
    const acc = total > 0 ? Math.round((parseInt(corr) / total) * 100) : 0;
    alert(
        '🏆 LEADERBOARD\n\n' +
        `Skor Tertinggi: ${best}\n` +
        `Total Main: ${games}x\n` +
        `✅ Benar: ${corr}\n` +
        `❌ Salah: ${wrg}\n` +
        `🎯 Akurasi: ${acc}%`
    );
}

function showAbout() {
    playSound('click');
    alert('🎉 RERE KUIS Premium\n\nDibuat oleh Rendi Asriko\nVersi 3.0 dengan efek premium');
}

function resetScore() {
    playSound('click');
    if (confirm('Hapus semua data (skor & statistik)?')) {
        localStorage.removeItem('bestScore');
        localStorage.removeItem('gameCount');
        localStorage.removeItem('totalCorrect');
        localStorage.removeItem('totalWrong');
        loadBestScore();
        alert('Data berhasil dihapus');
    }
}

// ===================================================
// TOMBOL KEMBALI
// ===================================================
function goBack() {
    playSound('click');
    clearInterval(timer);
    const menu = document.getElementById('menu-screen');
    const game = document.getElementById('game-screen');
    const result = document.getElementById('result-screen');
    const start = document.getElementById('start-screen');
    const backBtn = document.querySelector('.back-btn');
    const hamburger = document.querySelector('.hamburger');

    if (!game.classList.contains('hidden')) {
        game.classList.add('hidden');
        menu.classList.remove('hidden');
        loadBestScore();
        backBtn.style.display = 'flex';
        hamburger.style.display = 'flex';
    } else if (!menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        start.classList.remove('hidden');
        backBtn.style.display = 'none';
        hamburger.style.display = 'none';
    } else if (!result.classList.contains('hidden')) {
        result.classList.add('hidden');
        menu.classList.remove('hidden');
        loadBestScore();
        backBtn.style.display = 'flex';
        hamburger.style.display = 'flex';
        document.querySelector('.result-stats').innerHTML = '';
    } else {
        menu.classList.add('hidden');
        start.classList.remove('hidden');
        backBtn.style.display = 'none';
        hamburger.style.display = 'none';
    }
    document.getElementById('sideMenu').classList.remove('active');
}

// ===================================================
// KEYBOARD ENTER
// ===================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen.classList.contains('hidden')) {
            checkAnswer();
        }
    }
});

// ===================================================
// TAMBAHKAN SOUND TOGGLE DI SIDE MENU
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    const sideMenu = document.getElementById('sideMenu');
    const soundBtn = document.createElement('button');
    soundBtn.className = 'sound-toggle';
    soundBtn.innerText = '🔊';
    soundBtn.onclick = toggleSound;
    soundBtn.style.cssText = 'margin-top:20px; background:rgba(255,255,255,0.1); color:white; font-size:24px;';
    const resetBtn = sideMenu.querySelector('button:last-child');
    if (resetBtn) {
        resetBtn.parentNode.insertBefore(soundBtn, resetBtn.nextSibling);
    } else {
        sideMenu.appendChild(soundBtn);
    }

    // ===================================================
    // TUTUP SIDE MENU SAAT KLIK DI LUAR
    // ===================================================
    document.addEventListener('click', function(event) {
        const menu = document.getElementById('sideMenu');
        const hamburger = document.querySelector('.hamburger');
        if (menu.classList.contains('active')) {
            if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
                menu.classList.remove('active');
            }
        }
    });
});
