// --- ФУНКЦИЯ ВХОДА НА САЙТ (ЗАПУСК МУЗЫКИ) ---
function startExperience() {
    const introScreen = document.getElementById('intro-screen');
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const clickSound = document.getElementById('clickSound');

    if (introScreen) introScreen.classList.add('hidden');

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
                bgMusic.play();
                musicBtn.innerText = "🔇 Выключить фон";
            } else {
                bgMusic.pause();
                musicBtn.innerText = "🔊 Включить фон";
            }
        });
    }

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

// --- 7. ФУНКЦИЯ ЗАКРЫТИЯ ПЛЕЕРА ---
function closeAlbum() {
    const modal = document.getElementById('albumModal');
    const player = document.getElementById('modalPlayer');
    
    const shakeBtn = document.getElementById('shakeBtn');
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) modalContent.classList.remove('shake-active');
    
    if (player) player.pause();
    if (modal) modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('albumModal');
    if (event.target == modal) {
        closeAlbum();
    }
}
