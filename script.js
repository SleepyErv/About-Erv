// Pop-up window:

document.addEventListener('DOMContentLoaded', function() {
    window.setPopupBgColor = function(color) {
        document.documentElement.style.setProperty('--popup-bg', color);
    };

    window.openPopup = function(type) {
        closePopup();
        document.getElementById('popup-overlay').style.display = 'block';
        document.getElementById('popup-' + type).style.display = 'block';
    };

    window.closePopup = function() {
        document.getElementById('popup-overlay').style.display = 'none';
        ['about', 'hobbies', 'source'].forEach(id => {
            const el = document.getElementById('popup-' + id);
            if (el) el.style.display = 'none';
        });
    };

    document.getElementById('popup-overlay').addEventListener('click', window.closePopup);

    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape") window.closePopup();
    });

    // Music player button

    const musicBtn = document.getElementById('music-btn');
    const musicAudio = document.getElementById('music-audio');
    let isPlaying = false;

    musicBtn.textContent = "⏵";

    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            musicAudio.pause();
            musicBtn.textContent = "⏵";
        } else {
            musicAudio.play();
            musicBtn.textContent = "⏸";
        }
        isPlaying = !isPlaying;
    });

    musicAudio.addEventListener('ended', function() {
        musicBtn.textContent = "⏵";
        isPlaying = false;
    });
    
    // Sound effect on hover for buttons/links
    
    const hoverSound = document.getElementById('hover-sound');
    document.querySelectorAll('.Ribbon a, .music-btn, .popup-close').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (hoverSound) {
                hoverSound.currentTime = 0;
                hoverSound.play();
            }
        });
    });

    // Shake and confetti for "Ervin."
    const ervin = document.getElementById('ervin-name');
    let holdStart = 0;
    let shakeInterval = null;

    function startShake() {
        holdStart = Date.now();
        let shakeSpeed = 150;
        ervin.classList.add('shake');
        clearInterval(shakeInterval);
        shakeInterval = setInterval(() => {
            // Increase shake frequency as you hold
            const held = Date.now() - holdStart;
            shakeSpeed = Math.max(30, 150 - Math.floor(held / 10));
            ervin.style.animationDuration = (shakeSpeed / 1000) + 's';
        }, 50);
    }

    function stopShakeAndConfetti() {
        if (!holdStart) return;
        ervin.classList.remove('shake');
        ervin.style.animationDuration = '';
        clearInterval(shakeInterval);

        // Calculate hold duration and confetti count
        const held = Date.now() - holdStart;
        holdStart = 0;
        let count = Math.min(60, 8 + Math.floor(held / 60)); // More hold = more confetti, capped

        sprayConfetti(ervin, count);
    }

    // Mouse events
    ervin.addEventListener('mousedown', startShake);
    ervin.addEventListener('mouseup', stopShakeAndConfetti);
    ervin.addEventListener('mouseleave', () => {
        ervin.classList.remove('shake');
        ervin.style.animationDuration = '';
        clearInterval(shakeInterval);
        holdStart = 0;
    });

    // Touch events for mobile
    ervin.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startShake();
    });
    ervin.addEventListener('touchend', function(e) {
        e.preventDefault();
        stopShakeAndConfetti();
    });

    // Confetti function
    function sprayConfetti(target, count) {
        const rect = target.getBoundingClientRect();
        for (let i = 0; i < count; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.background = '#ce9753';
            conf.style.left = (rect.left + rect.width / 2 + window.scrollX - 5) + 'px';
            conf.style.top = (rect.top + window.scrollY - 10) + 'px';

            // Outward explosion: angle 0 to 2π
            const angle = Math.random() * 2 * Math.PI;
            const blast = 120 + Math.random() * 80;
            const x = Math.cos(angle) * blast;
            const y = Math.sin(angle) * blast;

            // For falling, keep X the same, just add to Y
            const fallY = y + 180 + Math.random() * 60;

            conf.style.setProperty('--confetti-up-transform', `translate(${x}px, ${y}px) scale(0.7) rotate(${Math.random()*720-360}deg)`);
            conf.style.setProperty('--confetti-down-transform', `translate(${x}px, ${fallY}px) scale(0.7) rotate(${Math.random()*720-360}deg)`);

            document.body.appendChild(conf);
            setTimeout(() => conf.remove(), 1800);
        }
    }
});