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
        const music = document.getElementById("bgMusic");
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
    const music = document.getElementById("bgMusic");
    music.volume = 0.4;
    music.play();
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("menu-screen").classList.remove("hidden");
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
// DATABASE KATA KUNCI (banyak jawaban relevan per soal)
// ===================================================
const keywords = {
    mudah: [
        // listrik padam → cari penerangan
        ["lilin","senter","obor","lampu","hp","handphone","ponsel","korek","lilin api","emergency","darurat","baterai","powerbank","cahaya","api"],
        // makanan ulang tahun
        ["kue","tart","nasi","pizza","ayam","bakar","goreng","mie","soto","bakso","es krim","eskrim","ice cream","snack","makanan","jajan","ulang tahun","cake"],
        // barang bepergian
        ["hp","handphone","ponsel","dompet","kunci","tas","baju","uang","kartu","ktp","masker","charger","earphone","headset","motor","kendaraan"],
        // aktivitas sebelum tidur
        ["gosok gigi","sikat gigi","cuci muka","wudhu","berdoa","doa","sholat","main hp","nonton","baca","minum","toilet","kamar mandi","ganti baju","piyama"],
        // tempat akhir pekan
        ["mall","mal","pantai","taman","gunung","kebun","bioskop","restoran","wisata","kolam renang","renang","museum","pasar","keluarga","piknik","jalan"],
        // benda tas pelajar
        ["buku","pensil","pulpen","pena","penggaris","penghapus","tas","bekal","makanan","hp","handphone","uang","dompet","seragam","alat tulis","kalkulator"],
        // kegiatan liburan sekolah
        ["jalan","liburan","wisata","pantai","gunung","main","bermain","tidur","nonton","baca","les","belajar","kumpul","keluarga","mudik","kampung"],
        // makanan kantin sekolah
        ["nasi","goreng","mie","bakso","soto","es","minuman","jajan","snack","gorengan","indomie","ayam","tahu","tempe","roti","lontong","cilok","batagor"],
        // aplikasi nonton video
        ["youtube","tiktok","instagram","netflix","vidio","iflix","viu","reels","shorts","video","streaming","disney","prime","mivo","rcti"],
        // alasan ke pasar
        ["belanja","beli","sayur","buah","ikan","daging","bumbu","kebutuhan","murah","masak","dapur","keperluan","groceries","sembako","bahan"]
    ],
    sedang: [
        // alasan terlambat sekolah
        ["macet","ban","bocor","kesiangan","bangun","telat","hujan","motor","kendaraan","mogok","sakit","jalanan","kemacetan","tidak ada","angkot","ojek"],
        // aplikasi komunikasi online
        ["whatsapp","wa","telegram","line","instagram","dm","pesan","chat","facebook","messenger","signal","email","zoom","meet","discord"],
        // pekerjaan tanggung jawab keselamatan
        ["dokter","pilot","polisi","tentara","pemadam","kebakaran","supir","driver","perawat","petugas","security","satpam","bidan","paramedik","tim sar","penjaga"],
        // barang elektronik rumah modern
        ["televisi","tv","kulkas","ac","mesin cuci","kipas","angin","microwave","rice cooker","laptop","komputer","hp","handphone","smartphone","wifi","router"],
        // setelah terima gaji
        ["bayar","tagihan","listrik","air","cicilan","nabung","tabung","investasi","belanja","kirim","transfer","keluarga","orang tua","kredit","utang","jajan"],
        // alasan belanja online
        ["murah","hemat","praktis","malas","mudah","gratis","ongkir","diskon","promo","cashback","tidak","keluar","rumah","waktu","efisien","nyaman"],
        // tempat suasana tenang belajar
        ["perpustakaan","kafe","cafe","taman","kamar","rumah","coworking","warnet","warung","masjid","mushola","kantor","ruang","sepi","tenang","sunyi"],
        // barang pindah rumah baru
        ["kasur","tempat tidur","lemari","meja","kursi","sofa","kulkas","tv","televisi","kompor","gas","dapur","ac","kipas","bantal","perabot","furnitur"],
        // aktivitas menunggu kendaraan umum
        ["main hp","handphone","scroll","nonton","musik","dengerin","baca","duduk","ngobrol","makan","jajan","foto","selfie","medsos","media sosial","instagram","tiktok"],
        // alasan ganti ponsel masih berfungsi
        ["baru","model","kamera","spesifikasi","rusak","lambat","lemot","memori","penuh","baterai","drop","tren","mode","upgrade","fitur","canggih"]
    ],
    sulit: [
        // pertimbangan beli smartphone
        ["harga","kamera","baterai","ram","memori","penyimpanan","merek","brand","layar","prosesor","desain","warna","garansi","review","spesifikasi","fitur","os","android"],
        // alasan lanjut kuliah
        ["pekerjaan","kerja","karir","ilmu","pengetahuan","gelar","ijazah","sarjana","cita","masa depan","penghasilan","gaji","sosial","status","orang tua","keluarga"],
        // keterampilan era digital
        ["komunikasi","komputer","coding","programming","digital","media sosial","bahasa inggris","analisis","data","kreativitas","adaptasi","teknologi","problem solving","leadership","kolaborasi"],
        // tantangan mulai usaha
        ["modal","uang","dana","pelanggan","konsumen","persaingan","kompetitor","pengalaman","ilmu","manajemen","promosi","marketing","risiko","kerugian","tim","sdm"],
        // teknologi masa depan
        ["ai","artificial intelligence","kecerdasan buatan","robot","vr","ar","virtual reality","blockchain","ev","kendaraan listrik","energi terbarukan","bioteknologi","5g","quantum","space","luar angkasa"],
        // perusahaan gagal berkembang
        ["manajemen","pemimpin","karyawan","inovasi","strategi","pemasaran","marketing","kompetitor","persaingan","adaptasi","teknologi","korupsi","keuangan","pelanggan","produk","layanan"],
        // faktor pilih tempat kerja
        ["gaji","salary","lokasi","jarak","fasilitas","tunjangan","karir","budaya","lingkungan","reputasi","perusahaan","jam kerja","fleksibel","bonus","jenjang","pengembangan"],
        // persiapan wawancara kerja
        ["cv","resume","pakaian","baju","rapi","riset","perusahaan","latihan","jawaban","portofolio","dokumen","ijazah","tepat waktu","doa","mental","persiapan"],
        // dampak positif teknologi
        ["komunikasi","informasi","mudah","cepat","efisien","kesehatan","pendidikan","ekonomi","bisnis","hiburan","transportasi","belanja","online","koneksi","produktivitas"],
        // inovasi teknologi produktivitas
        ["ai","artificial intelligence","cloud","komputasi awan","automation","otomasi","software","aplikasi","robot","drone","iot","internet of things","erp","crm","saas"]
    ]
};

// ===================================================
// FUNGSI CEK JAWABAN RELEVAN
// ===================================================
function isAnswerCorrect(input, questionIndex, level) {
    const jawaban = input.toLowerCase().trim();
    const kataKunci = keywords[level][questionIndex];
    return kataKunci.some(k => jawaban.includes(k) || k.includes(jawaban));
}

// ===================================================
// VARIABEL GAME
// ===================================================
let currentQuestions = [];
let currentIndicesOriginal = [];
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

    // Acak soal beserta index aslinya agar keywords tetap sinkron
    const indices = shuffleArray([...Array(questions[level].length).keys()]);
    currentQuestions = indices.map(i => questions[level][i]);
    currentIndicesOriginal = indices;

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

function checkAnswer() {
    if (answerLocked) return;

    const input = document.getElementById("answerInput").value.trim();

    if (input.length < 3) {
        playSound('wrong');
        document.getElementById("message").innerText = "⚠️ Jawaban terlalu pendek";
        return;
    }

    const originalIdx = currentIndicesOriginal[currentIndex];
    const benar = isAnswerCorrect(input, originalIdx, levelName);

    if (benar) {
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
// ===================================================
// SHARE KE WHATSAPP (DIPERBAIKI)
// ===================================================
function shareResult() {
    const finalScore = document.getElementById('finalScore').innerText;
    const best = localStorage.getItem('bestScore') || '0';

    const text =
        `🎮 RERE KUIS\n\n` +
        `🏆 Skor Akhir: ${finalScore}\n` +
        `⭐ Skor Tertinggi: ${best}`;

    window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        '_blank'
    );
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
        backBtn.style.display = 'flex';
        hamburger.style.display = 'flex';
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
        backBtn.style.display = 'flex';
        hamburger.style.display = 'flex';
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

document.addEventListener("visibilitychange", () => {
    const music = document.getElementById("bgMusic");

    if (document.hidden) {
        music.pause();
    } else {
        music.play().catch(() => {});
    }
});

window.addEventListener("beforeunload", () => {
    const music = document.getElementById("bgMusic");
    music.pause();
    music.currentTime = 0;
});