let wasBackgroundPlayingBeforeAlbum = false;
let previouslyFocusedElement = null;

function updateMusicButton() {
    const musicBtn = document.getElementById("musicBtn");
    const bgMusic = document.getElementById("bgMusic");
    if (!musicBtn || !bgMusic) return;
    const playing = !bgMusic.paused;
    musicBtn.textContent = playing ? "🔇 Выключить фон" : "🔊 Включить фон";
    musicBtn.setAttribute("aria-pressed", String(playing));
}

function showPlayerStatus(message) {
    const status = document.getElementById("playerStatus");
    if (status) status.textContent = message;
}

// --- ФУНКЦИЯ ВХОДА НА САЙТ (ЗАПУСК МУЗЫКИ) ---
function startExperience() {
    const introScreen = document.getElementById('intro-screen');
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const clickSound = document.getElementById('clickSound');

    if (introScreen) introScreen.classList.add('hidden');

    if (bgMusic) {
        bgMusic.volume = 0.2;
        bgMusic.play().then(updateMusicButton).catch(updateMusicButton);
    }

    if (clickSound) {
        clickSound.volume = 0.5;
        clickSound.play().catch(() => {});
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ЗВУК ПРИ КЛИКЕ ---
    const clickSound = document.getElementById("clickSound");
    const clickableElements = document.querySelectorAll("nav a, .album-card, .close-btn, .download-link, .shake-btn");
    
    clickableElements.forEach(element => {
        element.addEventListener("click", () => {
            if(clickSound) {
                clickSound.volume = 0.3;
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log("Звук не загружен"));
            }
        });
    });

    // --- 2. КНОПКА ВЫКЛЮЧЕНИЯ ФОНА ---
    const bgMusic = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicBtn");

    if(bgMusic) bgMusic.volume = 0.2; 

    if(musicBtn) {
        musicBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (bgMusic.paused) {
                bgMusic.play().then(updateMusicButton).catch(updateMusicButton);
            } else {
                bgMusic.pause();
                updateMusicButton();
            }
        });
    }

    const modalPlayer = document.getElementById("modalPlayer");
    if (modalPlayer) {
        modalPlayer.addEventListener("error", () => showPlayerStatus("Не удалось загрузить аудио. Попробуйте другой трек."));
        modalPlayer.addEventListener("playing", () => showPlayerStatus(""));
    }
    document.addEventListener("keydown", e => {
        const modal = document.getElementById("albumModal");
        if (e.key === "Escape" && modal && modal.style.display === "flex") closeAlbum();
    });

    // --- 3. АНИМАЦИЯ ПОЯВЛЕНИЯ (SCROLL) ---
    const fadeElements = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1 };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);
    fadeElements.forEach(fader => appearOnScroll.observe(fader));


    // --- 4. ГЕНЕРАТОР ИСКР НА ФОНЕ ---
    const sparksContainer = document.getElementById("sparks-container");
    
    if (sparksContainer) {
        function createSpark() {
            const spark = document.createElement("div");
            spark.classList.add("spark");
            
            const size = Math.random() * 4 + 2;
            spark.style.width = `${size}px`;
            spark.style.height = `${size}px`;
            spark.style.left = `${Math.random() * 100}vw`;
            spark.style.animationDuration = `${Math.random() * 4 + 3}s`;
            
            sparksContainer.appendChild(spark);
            
            setTimeout(() => {
                spark.remove();
            }, 7000);
        }
        setInterval(createSpark, 300);
    }

    // --- 5. ЛОГИКА КНОПКИ ТРЯСКИ В ПЛЕЕРЕ ---
    const shakeBtn = document.getElementById('shakeBtn');
    const modalContent = document.querySelector('.modal-content');

    if (shakeBtn && modalContent) {
        shakeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalContent.classList.toggle('shake-active');
            
            if (modalContent.classList.contains('shake-active')) {
                shakeBtn.innerText = "🛑 ВЫКЛЮЧИТЬ ТРЯСКУ";
                shakeBtn.classList.add('active');
            } else {
                shakeBtn.innerText = "📳 ВКЛЮЧИТЬ ТРЯСКУ";
                shakeBtn.classList.remove('active');
            }
        });
    }
});


// --- 6. ФУНКЦИЯ ОТКРЫТИЯ АЛЬБОМА (ПЛЕЕР) ---
function openAlbum(albumTitle, folderPath, tracks) {
    const modal = document.getElementById('albumModal');
    const modalTitle = document.getElementById('modalTitle');
    const trackList = document.getElementById('trackList');
    const player = document.getElementById('modalPlayer');
    const bgMusic = document.getElementById('bgMusic');
    
    // Сбрасываем тряску при открытии нового альбома
    const shakeBtn = document.getElementById('shakeBtn');
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) modalContent.classList.remove('shake-active');
    if (shakeBtn) {
        shakeBtn.innerText = "📳 ВКЛЮЧИТЬ ТРЯСКУ";
        shakeBtn.classList.remove('active');
    }

    wasBackgroundPlayingBeforeAlbum = Boolean(bgMusic && !bgMusic.paused);
    previouslyFocusedElement = document.activeElement;
    if (bgMusic) bgMusic.pause();
    updateMusicButton();
    showPlayerStatus("");

    trackList.innerHTML = '';
    modalTitle.innerText = albumTitle;

    tracks.forEach((track, index) => {
        const trackItem = document.createElement('button');
        trackItem.type = 'button';
        trackItem.className = 'track-item';
        
        const number = document.createElement("span");
        number.className = "track-number";
        number.textContent = String(index + 1);
        trackItem.append(number, document.createTextNode(track.title));
        
        trackItem.onclick = () => {
            player.src = `${folderPath}/${track.file}`;
            showPlayerStatus("Загрузка аудио…");
            player.play().catch(() => showPlayerStatus("Не удалось запустить трек. Нажмите ▶ на плеере или выберите другой."));
            
            document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
            trackItem.classList.add('active');
        };
        
        trackList.appendChild(trackItem);
    });

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.querySelector(".close-btn")?.focus();
}

// --- 7. ФУНКЦИЯ ЗАКРЫТИЯ ПЛЕЕРА ---
function closeAlbum() {
    const modal = document.getElementById('albumModal');
    const player = document.getElementById('modalPlayer');
    
    const shakeBtn = document.getElementById('shakeBtn');
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) modalContent.classList.remove('shake-active');
    
    if (player) {
        player.pause();
        player.removeAttribute("src");
        player.load();
    }
    if (modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("modal-open");
    showPlayerStatus("");
    const bgMusic = document.getElementById("bgMusic");
    if (wasBackgroundPlayingBeforeAlbum && bgMusic) bgMusic.play().then(updateMusicButton).catch(updateMusicButton);
    wasBackgroundPlayingBeforeAlbum = false;
    previouslyFocusedElement?.focus();
}

window.onclick = function(event) {
    const modal = document.getElementById('albumModal');
    if (event.target == modal) {
        closeAlbum();
    }
}
