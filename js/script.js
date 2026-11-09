// --- ФУНКЦИЯ ВХОДА НА САЙТ (ЗАПУСК МУЗЫКИ) ---
function startExperience() {
    const introScreen = document.getElementById('intro-screen');
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const clickSound = document.getElementById('clickSound');

    introScreen.classList.add('hidden');

    if (bgMusic) {
        bgMusic.volume = 0.2;
        bgMusic.play().catch(e => console.log("Ошибка музыки"));
        if (musicBtn) musicBtn.innerText = "🔇 Выключить фон";
    }

    if (clickSound) {
        clickSound.volume = 0.5;
        clickSound.play();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ЗВУК ПРИ КЛИКЕ ---
    const clickSound = document.getElementById("clickSound");
    const clickableElements = document.querySelectorAll("nav a, .album-card, .close-btn, .download-link");
    
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
                bgMusic.play();
                musicBtn.innerText = "🔇 Выключить фон";
            } else {
                bgMusic.pause();
                musicBtn.innerText = "🔊 Включить фон";
            }
        });
    }

    // --- 3. АНИМАЦИЯ ПОЯВЛЕНИЯ ---
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
});

// --- 4. ФУНКЦИЯ ОТКРЫТИЯ АЛЬБОМА (ПЛЕЕР) ---
function openAlbum(albumTitle, folderPath, tracks) {
    const modal = document.getElementById('albumModal');
    const modalTitle = document.getElementById('modalTitle');
    const trackList = document.getElementById('trackList');
    const player = document.getElementById('modalPlayer');
    const bgMusic = document.getElementById('bgMusic');

    if (bgMusic) bgMusic.pause();

    trackList.innerHTML = '';
    modalTitle.innerText = albumTitle;

    tracks.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        
        trackItem.innerHTML = `<span class="track-number">${index + 1}</span> ${track.title}`;
        
        trackItem.onclick = () => {
            player.src = `${folderPath}/${track.file}`;
            player.play();
            
            document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
            trackItem.classList.add('active');
        };
        
        trackList.appendChild(trackItem);
    });

    modal.style.display = "flex";
}

// --- 5. ФУНКЦИЯ ЗАКРЫТИЯ ---
function closeAlbum() {
    const modal = document.getElementById('albumModal');
    const player = document.getElementById('modalPlayer');
    player.pause();
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('albumModal');
    if (event.target == modal) {
        closeAlbum();
    }
}