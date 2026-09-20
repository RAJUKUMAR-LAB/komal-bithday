// Main Application Logic for Komal's Birthday Surprise

// Helper to safely get the AudioManager instance
function getAudioMgr() {
    return window.audioManager || (typeof audioManager !== 'undefined' ? audioManager : null);
}

// Auto-play the Special Dedication Song immediately on script execution & DOM ready!
function triggerAutoSpecialAudio() {
    const mgr = getAudioMgr();
    if (mgr) {
        mgr.playSpecialSong();
    }
}

// Immediate attempt as early as possible
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    triggerAutoSpecialAudio();
} else {
    document.addEventListener('DOMContentLoaded', triggerAutoSpecialAudio);
}
window.addEventListener('load', triggerAutoSpecialAudio);

// Instant global gesture unlock on first user tap/click/key
let audioUnlocked = false;
const unlockAudioOnce = () => {
    if (audioUnlocked) return;
    audioUnlocked = true;
    const mgr = getAudioMgr();
    if (mgr) {
        mgr.init();
        if (!mgr.isPlayingSpecial && !mgr.isPlayingBGM && !mgr.specialSongFinished) {
            mgr.playSpecialSong();
        }
    }
    ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'].forEach(evt => {
        window.removeEventListener(evt, unlockAudioOnce, true);
        document.removeEventListener(evt, unlockAudioOnce, true);
    });
};
['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'].forEach(evt => {
    window.addEventListener(evt, unlockAudioOnce, { capture: true, passive: true });
    document.addEventListener(evt, unlockAudioOnce, { capture: true, passive: true });
});

document.addEventListener('DOMContentLoaded', () => {
    triggerAutoSpecialAudio();
    initQuizFlow();
    initLifeCounter();
    initCake();
    initBalloons();
    initLoveLetter();
    initPolaroidLightbox();
    initWishGenerator();
    initFriendsWishes();
    initHUD();
    initHeroSlider();
    initReasonDispenser();
    initGiftBoxes();
    initMusicInterludes();
    initIronManSection();
});

/* ==========================================================================
   STAGE 1: INTERACTIVE LOVE QUIZ FLOW (8 Lovingly Crafted Questions & Surprises)
   Dedicated Special Song (1:41) Plays Continuously Throughout The Surprise
   ========================================================================== */
function initQuizFlow() {
    document.body.classList.add('quiz-active');
    const quizOverlay = document.getElementById('quiz-overlay');
    const step1 = document.getElementById('quiz-step-1');
    const step2 = document.getElementById('quiz-step-2');
    const step3 = document.getElementById('quiz-step-3');
    const step4 = document.getElementById('quiz-step-4');
    const step5 = document.getElementById('quiz-step-5');
    const step6 = document.getElementById('quiz-step-6');
    const step7 = document.getElementById('quiz-step-7');
    const step8 = document.getElementById('quiz-step-8');
    const stepCelebration = document.getElementById('quiz-step-celebration');

    const btnYes = document.getElementById('btn-yes-identity');
    const btnNo = document.getElementById('btn-no-runaway');
    const dots = document.querySelectorAll('.progress-dot');

    // Special dedication song controls (1:41 duration = 101s)
    const specialPlayBtn = document.getElementById('quiz-special-play-btn');
    const specialBanner = document.getElementById('quiz-special-music-banner');

    if (specialPlayBtn) {
        specialPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const mgr = getAudioMgr();
            if (mgr) mgr.toggleSpecialSong();
        });
    }

    const specialProgressBg = document.querySelector('.quiz-special-progress-bg');
    if (specialProgressBg) {
        specialProgressBg.addEventListener('click', (e) => {
            e.stopPropagation();
            const mgr = getAudioMgr();
            if (mgr && mgr.specialAudio) {
                const rect = specialProgressBg.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(1, clickX / rect.width));
                const dur = mgr.specialAudio.duration || 101;
                mgr.specialAudio.currentTime = pct * dur;
                if (!mgr.isPlayingSpecial) {
                    mgr.forcePlaySpecialSong(false);
                }
            }
        });
    }

    if (specialBanner) {
        specialBanner.addEventListener('click', (e) => {
            if (e.target.closest('#quiz-special-play-btn') || e.target.closest('.quiz-special-progress-bg')) return;
            const mgr = getAudioMgr();
            if (mgr) mgr.toggleSpecialSong();
        });
    }



    // Fun messages when dodging the 'No' button with pet names
    const funnyNoMessages = [
        "Arey Mithi Chinni pakad ke dikhao! 😜",
        "Galat button Babu! 😂",
        "No option doesn't exist for my Sona! 🚫",
        "Pakdo mujhe agar dum hai! 🏃‍♀️",
        "Sirf YES dabana padega Cutie! 🥰",
        "Komal, you are stuck with me forever! 💖",
        "Arey aise kaise No bologe Babu? 🥺",
        "Mithi Chinni sirf meri hai! 🍬"
    ];
    let dodgeCount = 0;

    // Enhanced Runaway button mechanism with safe dodging geometry
    const dodgeSpots = [
        { x: -115, y: -28 },
        { x: 115, y: -28 },
        { x: -130, y: 18 },
        { x: 130, y: 18 },
        { x: -95, y: -48 },
        { x: 95, y: -48 }
    ];

    function dodgeButton() {
        audioManager.playDodge();
        const spot = dodgeSpots[dodgeCount % dodgeSpots.length];

        btnNo.style.transform = `translate(${spot.x}px, ${spot.y}px)`;
        btnNo.textContent = funnyNoMessages[dodgeCount % funnyNoMessages.length];
        dodgeCount++;

        // Make YES button slightly pulse/scale to invite click, capped at 1.08
        const currentScale = Math.min(1.08, 1 + (dodgeCount * 0.015));
        btnYes.style.transform = `scale(${currentScale})`;
    }

    btnNo.addEventListener('mouseenter', dodgeButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        dodgeButton();
    });
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        dodgeButton();
    });

    // Interactive Photo Toggle on Quiz Step 1 (Couple <-> Solo)
    const quizAvatarBox = document.getElementById('quiz-avatar-box');
    const quizAvatarImg = document.getElementById('quiz-avatar-img');
    const btnToggleQuizPhoto = document.getElementById('btn-toggle-quiz-photo');
    const quizAvatarTag = document.getElementById('quiz-avatar-tag');

    function toggleQuizAvatarPhoto(e) {
        if (e) e.stopPropagation();
        if (!quizAvatarImg) return;

        const isCouple = quizAvatarImg.getAttribute('data-state') === 'couple';
        quizAvatarImg.style.opacity = '0';
        quizAvatarImg.style.transform = 'scale(0.92)';

        if (window.audioManager) {
            audioManager.playChime();
        }
        if (window.particleEngine) {
            const rect = quizAvatarImg.getBoundingClientRect();
            particleEngine.launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
        }

        setTimeout(() => {
            if (isCouple) {
                quizAvatarImg.src = 'https://lh3.googleusercontent.com/d/1eggvmffqQwg7Rwzj527Zb0rVoi_qKlPG'; // Stunning solo portrait
                quizAvatarImg.setAttribute('data-state', 'solo');
                if (quizAvatarTag) quizAvatarTag.innerHTML = '<span>🌸 Mithi Chinni Solo Queen 👑</span>';
            } else {
                quizAvatarImg.src = 'https://lh3.googleusercontent.com/d/1iLugHtMzizXcXTFyHeS_hwB7DGCV6VQj'; // Couple photo
                quizAvatarImg.setAttribute('data-state', 'couple');
                if (quizAvatarTag) quizAvatarTag.innerHTML = '<span>💖 Babu & Mithi Chinni 💕</span>';
            }
            quizAvatarImg.style.opacity = '1';
            quizAvatarImg.style.transform = 'scale(1)';
        }, 180);
    }

    if (btnToggleQuizPhoto) btnToggleQuizPhoto.addEventListener('click', toggleQuizAvatarPhoto);
    if (quizAvatarBox) quizAvatarBox.addEventListener('click', (e) => {
        if (e.target.closest('#btn-toggle-quiz-photo')) return;
        toggleQuizAvatarPhoto(e);
    });

    // Question Surprise Modal elements
    const surpriseModal = document.getElementById('surprise-modal');
    const surpriseIcon = document.getElementById('surprise-icon');
    const surpriseTitle = document.getElementById('surprise-title');
    const surpriseBody = document.getElementById('surprise-body');
    const btnSurpriseContinue = document.getElementById('btn-surprise-continue');
    let pendingSurpriseAction = null;

    function openSurpriseModal(icon, title, bodyHtml, onContinue) {
        if (!surpriseModal) {
            if (onContinue) onContinue();
            return;
        }
        // Always ensure floating player and lyrics pill are collapsed
        const fp = document.getElementById('floating-master-player');
        if (fp) {
            fp.classList.add('collapsed');
            fp.classList.remove('is-playing');
        }
        const lp = document.getElementById('floating-lyrics-pill');
        if (lp) lp.classList.add('hidden');

        surpriseIcon.textContent = icon;
        surpriseTitle.textContent = title;
        surpriseBody.innerHTML = bodyHtml;
        pendingSurpriseAction = onContinue;

        const box = surpriseModal.querySelector('.surprise-modal-box');
        if (box) box.scrollTop = 0;

        surpriseModal.classList.add('active');
        audioManager.playChime();
        if (particleEngine) particleEngine.launchConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 80);
    }

    if (btnSurpriseContinue) {
        btnSurpriseContinue.addEventListener('click', () => {
            surpriseModal.classList.remove('active');
            if (pendingSurpriseAction) {
                const action = pendingSurpriseAction;
                pendingSurpriseAction = null;
                setTimeout(action, 280);
            }
        });
    }

    // Step 1: Yes Clicked -> Surprise 1
    btnYes.addEventListener('click', () => {
        audioManager.playChime();
        openSurpriseModal(
            "👑",
            "Official Mithi Chinni Certificate 📜❤️",
            "<strong>1000% Identity Verified! 👑</strong><br>Access Granted! Sweetest Mithi Chinni in the universe & Babu's forever favorite human! 🥰✨",
            () => {
                step1.classList.remove('active');
                step2.classList.add('active');
                updateDots(1);

                const firstPin = document.querySelector('.pin-digit[data-index="0"]');
                if (firstPin) firstPin.focus();
            }
        );
    });

    // Step 2: Birthday Date Lock (22 / 09 / 2003) -> Surprise 2
    const pinInputs = document.querySelectorAll('.pin-digit');
    const expectedPin = "22092003";

    pinInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length > 0) {
                e.target.value = val.slice(-1);
                if (index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                }
            }
            checkPin();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });

    function checkPin() {
        let entered = "";
        pinInputs.forEach(inp => entered += inp.value);
        if (entered.length === 8) {
            if (entered === expectedPin) {
                audioManager.playChime();
                document.getElementById('pin-error-msg').textContent = "✨ 22 September 2003: Verified with 1000% Love! 💖";
                document.getElementById('pin-error-msg').style.color = "#0be881";

                setTimeout(() => {
                    openSurpriseModal(
                        "🌟",
                        "Cosmic Star Lock: 22-09-2003 ✨",
                        "<strong>The Heavens Celebrated! 🎂</strong><br>22 years ago, God sent his sweetest angel to earth — YOU! Happy 23rd Birthday my angel! 💖🌟",
                        () => {
                            step2.classList.remove('active');
                            step3.classList.add('active');
                            updateDots(2);
                        }
                    );
                }, 500);
            } else {
                audioManager.playDodge();
                document.getElementById('pin-error-msg').textContent = "Oops! Remember your special DOB: 22-09-2003 😉";
                document.getElementById('pin-error-msg').style.color = "#ff4d79";
            }
        }
    }

    // Generic Option Card Handler for Steps 3 through 8 with custom heartfelt surprises!
    const optionCards = document.querySelectorAll('.quiz-option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('correct');
            audioManager.playChime();
            if (particleEngine) particleEngine.launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 60);

            const nextTarget = card.getAttribute('data-next');
            const currentStep = card.closest('.quiz-step');
            const currentStepId = currentStep ? currentStep.id : '';

            setTimeout(() => {
                if (currentStepId === 'quiz-step-3') {
                    // Surprise 3: Love Quantity Alert
                    openSurpriseModal(
                        "💥💘",
                        "Love Meter: Limit Exceeded! 📈",
                        "<strong>System Overload! 💥</strong><br>Babu ka pyaar numbers me measure nahi ho sakta... Truly infinite & multiplying with every heartbeat! 💖",
                        () => {
                            currentStep.classList.remove('active');
                            const nextEl = document.getElementById('quiz-step-4');
                            if (nextEl) nextEl.classList.add('active');
                            updateDots(3);
                        }
                    );
                } else if (currentStepId === 'quiz-step-4') {
                    // Surprise 4: Smile Scanner
                    openSurpriseModal(
                        "🥺🌸",
                        "Smile Scanner: 10,000 / 10 ✨",
                        "<strong>1000% Lethal Cuteness! 🌸</strong><br>Aapki ek smile Babu ki 100% thakan door kar deti hai! Duniya ki sabse pyari smile aapki hai! 🥰🍬",
                        () => {
                            currentStep.classList.remove('active');
                            const nextEl = document.getElementById('quiz-step-5');
                            if (nextEl) nextEl.classList.add('active');
                            updateDots(4);
                        }
                    );
                } else if (currentStepId === 'quiz-step-5') {
                    // Surprise 5: Babu Apology Contract
                    openSurpriseModal(
                        "📜✍️",
                        "Babu Apology Contract 🥺",
                        "<strong>Signed Agreement: 📜</strong><br>• 100 'Sorry Babu' with puppy eyes 🥺<br>• Unlimited chocolates & treats 🍫<br>• 24/7 hugs on demand 🤗",
                        () => {
                            currentStep.classList.remove('active');
                            const nextEl = document.getElementById('quiz-step-6');
                            if (nextEl) nextEl.classList.add('active');
                            updateDots(5);
                        }
                    );
                } else if (currentStepId === 'quiz-step-6') {
                    // Surprise 6: Sabse Pyari Memory & Pehli Nazar
                    openSurpriseModal(
                        "💓📸",
                        "Heartbeat Archive 🥹✨",
                        "<strong>Sabse Pavitra Hansi! 🌸</strong><br>Jab aap hasti ho na Babu, pure jahan ki bahaar khil jaati hai! Always stay smiling cutie! 🥰",
                        () => {
                            currentStep.classList.remove('active');
                            const nextEl = document.getElementById('quiz-step-7');
                            if (nextEl) nextEl.classList.add('active');
                            updateDots(6);
                        }
                    );
                } else if (currentStepId === 'quiz-step-7') {
                    // Surprise 7: Babu Ka Secret Thought & Dil Ki Baat
                    openSurpriseModal(
                        "💌🗝️",
                        "Secret Love Vault 💖",
                        "<strong>Dil Ki Baat! 🍬</strong><br>Komal, aap meri har saans ka sabse keemti hissa ho! Aapke bina Babu kuch bhi nahi! 🥺❤️",
                        () => {
                            currentStep.classList.remove('active');
                            const nextEl = document.getElementById('quiz-step-8');
                            if (nextEl) nextEl.classList.add('active');
                            updateDots(7);
                        }
                    );
                } else if (currentStepId === 'quiz-step-8') {
                    // Surprise 8: The Ultimate Lifetime Promise
                    openSurpriseModal(
                        "💍💎",
                        "The Eternal Promise 🌹",
                        "<strong>Promise Sealed Forever! 💍</strong><br>From this birthday to eternity, you are my Mithi Chinni & I am forever your Babu! 💖✨",
                        () => {
                            currentStep.classList.remove('active');
                            triggerFinalUnlock();
                        }
                    );
                } else {
                    if (currentStep) currentStep.classList.remove('active');
                    if (nextTarget === 'celebration') {
                        triggerFinalUnlock();
                    } else if (nextTarget) {
                        const nextEl = document.getElementById(`quiz-step-${nextTarget}`);
                        if (nextEl) {
                            nextEl.classList.add('active');
                            updateDots(parseInt(nextTarget) - 1);
                        }
                    }
                }
            }, 450);
        });
    });

    function updateDots(activeIdx) {
        dots.forEach((dot, idx) => {
            if (idx === activeIdx) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    function triggerFinalUnlock() {
        stepCelebration.classList.add('active');
        updateDots(7);

        // Keep Special Dedication Song playing continuously throughout the entire website!
        if (window.audioManager && !audioManager.isPlayingSpecial && !audioManager.isPlayingBGM) {
            audioManager.playSpecialSong();
        }

        let countdown = 3;
        const countText = document.getElementById('unlock-countdown');
        countText.textContent = countdown;

        const countTimer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countText.textContent = countdown;
                audioManager.playNote(440, 0, 0.4);
            } else {
                clearInterval(countTimer);
                countText.textContent = "🎉 SURPRISE! 🎉";
                audioManager.playCelebrationFanfare();

                if (particleEngine) {
                    particleEngine.launchConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 180);
                    particleEngine.launchFirework(window.innerWidth * 0.3, window.innerHeight * 0.3);
                    particleEngine.launchFirework(window.innerWidth * 0.7, window.innerHeight * 0.3);
                }

                setTimeout(() => {
                    quizOverlay.classList.add('hidden');
                    document.body.classList.remove('quiz-active');
                    const hudBgmBtn = document.getElementById('hud-bgm-toggle');
                    if (hudBgmBtn) hudBgmBtn.classList.add('active');

                    // Now celebration is unlocked, sync floating master player for main screen
                    const mgr = getAudioMgr();
                    if (mgr) {
                        mgr.syncSpecialUI(mgr.isPlayingSpecial);
                    }
                }, 1000);
            }
        }, 800);
    }
}


/* ==========================================================================
   LIVE LIFE JOURNEY COUNTER (Since 22-09-2003)
   ========================================================================== */
function initLifeCounter() {
    // Komal's Date of Birth: 22 September 2003, 00:00:00 IST
    const birthDate = new Date(2003, 8, 22, 0, 0, 0); // Month is 0-indexed (8 = September)

    function updateClock() {
        const now = new Date();
        const diffMs = now - birthDate;

        if (diffMs < 0) return;

        // Approximate units
        const totalSeconds = Math.floor(diffMs / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        // Precise year calculation
        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Update UI
        const elYears = document.getElementById('counter-years');
        const elDays = document.getElementById('counter-days');
        const elHours = document.getElementById('counter-hours');
        const elMinutes = document.getElementById('counter-minutes');
        const elSeconds = document.getElementById('counter-seconds');

        if (elYears) elYears.textContent = years;
        if (elDays) elDays.textContent = totalDays.toLocaleString();
        if (elHours) elHours.textContent = totalHours.toLocaleString();
        if (elMinutes) elMinutes.textContent = totalMinutes.toLocaleString();
        if (elSeconds) elSeconds.textContent = totalSeconds.toLocaleString();
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* ==========================================================================
   VIRTUAL BIRTHDAY CAKE & CANDLE BLOW
   ========================================================================== */
function initCake() {
    const btnBlow = document.getElementById('btn-blow-candles');
    const flames = document.querySelectorAll('.flame');
    const smokePuffs = document.querySelectorAll('.smoke-puff');
    const statusMsg = document.getElementById('cake-status');
    let blown = false;

    function blowCandles() {
        if (blown) return;
        blown = true;

        audioManager.playBlowCandle();

        // Extinguish flames with puff animation
        flames.forEach(f => f.classList.add('extinguished'));
        smokePuffs.forEach(s => s.classList.add('rising'));

        if (statusMsg) {
            statusMsg.innerHTML = "✨ Wish Sent To The Stars! May All Your Dreams Come True, Komal! 🎂🎉";
        }
        btnBlow.textContent = "🎂 Candles Blown! Happy Birthday! 🎉";
        btnBlow.style.background = "linear-gradient(135deg, #0be881, #05c46b)";

        // Grand celebration sequence
        setTimeout(() => {
            audioManager.playCelebrationFanfare();
            audioManager.triggerSituation('candle_blown'); // Auto-plays Ishq De Fanniyar at 11s celebratory beat!
            if (particleEngine) {
                particleEngine.launchConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 180);
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        particleEngine.launchFirework(
                            window.innerWidth * (0.2 + Math.random() * 0.6),
                            window.innerHeight * (0.2 + Math.random() * 0.4)
                        );
                    }, i * 400);
                }
            }
        }, 500);
    }

    if (btnBlow) {
        btnBlow.addEventListener('click', blowCandles);
    }

    // Also allow tapping directly on flames
    flames.forEach(flame => {
        flame.addEventListener('click', blowCandles);
    });
}

/* ==========================================================================
   POP-THE-BALLOONS COMPLIMENT ARENA
   ========================================================================== */
function initBalloons() {
    const balloons = document.querySelectorAll('.balloon-item');
    const popup = document.getElementById('compliment-popup');
    const popupText = document.getElementById('compliment-text');
    const popupEmoji = document.getElementById('compliment-emoji');
    const btnClosePopup = document.getElementById('btn-close-compliment');

    const compliments = [
        { emoji: "🍬", text: "Meri Mithi Chinni, aapki smile is duniya ki sabse mithi aur pyari cheez hai!" },
        { emoji: "👑", text: "Meri Sona: B.Tech CSE Queen! Beauty, brilliant brain aur sabse pyara dil ek saath." },
        { emoji: "🌸", text: "Meri Babu, aapki masoomiyat aur caring nature aapko 8 billion logon mein sabse special banata hai." },
        { emoji: "💫", text: "Jab meri Mithi Chinni hasti hai, sach mein mere saare gham chhoo-mantar ho jaate hain!" },
        { emoji: "🥺", text: "Mera pyara baccha! Thank you for coming into my life and turning ordinary days into fairy tales." },
        { emoji: "💖", text: "Meri Jaan, mera Babu, mera Sona — you are my forever favorite thought and my whole universe!" },
        { emoji: "🦾", text: "I Love You 3000 Meri Mithi Chinni! Chahe Tony Stark ho ya Babu, aap jaisa superhero lover poore multiverse mein nahi!" }
    ];

    balloons.forEach((balloon, idx) => {
        balloon.addEventListener('click', () => {
            if (balloon.classList.contains('popped')) return;

            balloon.classList.add('popped');
            audioManager.playPop();
            audioManager.triggerSituation('balloon_pop'); // Contextual song switch: Aitbaar from 30s!

            const comp = compliments[idx % compliments.length];
            popupEmoji.textContent = comp.emoji;
            popupText.textContent = comp.text;

            if (particleEngine) {
                const rect = balloon.getBoundingClientRect();
                particleEngine.launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
            }

            setTimeout(() => {
                popup.classList.add('active');
            }, 250);
        });
    });

    if (btnClosePopup) {
        btnClosePopup.addEventListener('click', () => {
            popup.classList.remove('active');
            audioManager.playChime();
        });
    }
}

/* ==========================================================================
   WAX-SEALED ROMANTIC LOVE LETTER
   ========================================================================== */
function initLoveLetter() {
    const envelope = document.getElementById('envelope-box');
    const flap = document.getElementById('envelope-flap');
    const seal = document.getElementById('wax-seal');
    const letterPaper = document.getElementById('letter-paper');
    let isOpen = false;

    function openLetter() {
        if (isOpen) return;
        isOpen = true;

        audioManager.playChime();
        audioManager.triggerSituation('letter_opened'); // Auto-plays Ijazat (Arijit Singh) at 12s for handwritten letter!
        if (particleEngine) particleEngine.launchConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 70);

        seal.style.transform = "translate(-50%, -50%) scale(0)";
        flap.style.transform = "rotateX(180deg)";

        setTimeout(() => {
            letterPaper.classList.add('open');
            letterPaper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
    }

    if (envelope) envelope.addEventListener('click', openLetter);
    if (seal) seal.addEventListener('click', (e) => {
        e.stopPropagation();
        openLetter();
    });
}

/* ==========================================================================
   POLAROID LIGHTBOX
   ========================================================================== */
function initPolaroidLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalCaption = document.getElementById('lightbox-caption');
    const modalNoteText = document.getElementById('lightbox-note-text');
    const btnClose = document.getElementById('lightbox-close');
    const polaroidItems = document.querySelectorAll('.polaroid-item');

    polaroidItems.forEach(item => {
        // Flip hint click handler (Front -> Back)
        const flipHint = item.querySelector('.polaroid-flip-hint');
        if (flipHint) {
            flipHint.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.toggle('flipped');
                audioManager.playChime();
                audioManager.triggerSituation('polaroid_clicked'); // Tum Ho Toh from 30s!
            });
        }

        // Flip back click handler (Back -> Front)
        const flipBack = item.querySelector('.love-note-flip-back');
        if (flipBack) {
            flipBack.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.remove('flipped');
                audioManager.playChime();
                audioManager.triggerSituation('polaroid_clicked'); // Tum Ho Toh from 30s!
            });
        }

        // Clicking the polaroid body
        item.addEventListener('click', (e) => {
            // Ignore if clicked on buttons
            if (e.target.closest('.polaroid-flip-hint') || e.target.closest('.love-note-flip-back')) return;

            // Trigger contextual romantic song on memory click
            audioManager.triggerSituation('polaroid_clicked'); // Tum Ho Toh from 30s!

            // If currently flipped on back, clicking will flip back to front
            if (item.classList.contains('flipped')) {
                item.classList.remove('flipped');
                audioManager.playChime();
                return;
            }

            // Otherwise open dual Lightbox modal!
            const img = item.querySelector('.polaroid-img');
            const caption = item.getAttribute('data-caption') || (item.querySelector('.polaroid-caption') ? item.querySelector('.polaroid-caption').textContent : '');
            const note = item.getAttribute('data-note') || (item.querySelector('.love-note-content') ? item.querySelector('.love-note-content').textContent.replaceAll('"', '') : '');

            if (img && modal && modalImg) {
                modalImg.src = img.src;
                if (modalCaption) modalCaption.textContent = caption;
                if (modalNoteText) modalNoteText.textContent = `"${note.trim()}"`;
                modal.classList.add('active');
                audioManager.playChime();
            }
        });
    });

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('lightbox-container')) {
                modal.classList.remove('active');
            }
        });
    }
}

/* ==========================================================================
   MAKE A BIRTHDAY WISH (SHOOTING STAR GENERATOR)
   ========================================================================== */
function initWishGenerator() {
    const btnSendWish = document.getElementById('btn-send-wish');
    const wishInput = document.getElementById('wish-input');
    const wishesJar = document.getElementById('wishes-jar');
    const wishList = document.getElementById('wishes-list');

    if (btnSendWish && wishInput) {
        btnSendWish.addEventListener('click', () => {
            const text = wishInput.value.trim();
            if (!text) {
                wishInput.focus();
                return;
            }

            audioManager.playChime();
            audioManager.triggerSituation('wish_sent'); // Contextual song switch: Tujhko from 30s!
            if (particleEngine) {
                particleEngine.launchShootingStar();
                particleEngine.launchConfetti(window.innerWidth / 2, window.innerHeight * 0.7, 60);
            }

            wishesJar.classList.add('active');
            const item = document.createElement('div');
            item.style.padding = "10px 14px";
            item.style.margin = "8px 0";
            item.style.borderRadius = "12px";
            item.style.background = "rgba(255, 117, 140, 0.15)";
            item.style.border = "1px solid rgba(255, 184, 108, 0.3)";
            item.style.color = "#ffeaa7";
            item.style.fontFamily = "var(--font-script)";
            item.style.fontSize = "1.3rem";
            item.innerHTML = `⭐ "${text}" — <em>Saved in the stars forever!</em>`;

            wishList.prepend(item);
            wishInput.value = "";
            btnSendWish.textContent = "✨ Wish Sent to the Universe! ✨";

            setTimeout(() => {
                btnSendWish.textContent = "🌟 Make Another Wish";
            }, 3000);
        });
    }
}

/* ==========================================================================
   FLOATING ACTION HUD & GLOBAL HEART ANIMATIONS
   ========================================================================== */
function initHUD() {
    const btnBGM = document.getElementById('hud-bgm-toggle');
    const btnHeartRain = document.getElementById('hud-heart-rain-btn');
    const btnConfetti = document.getElementById('hud-confetti-btn');
    const btnReplayQuiz = document.getElementById('hud-quiz-replay');



    if (btnBGM) {
        btnBGM.addEventListener('click', () => {
            const mgr = getAudioMgr();
            const isPlaying = mgr ? mgr.toggleBGM() : false;
            if (btnBGM) btnBGM.classList.toggle('active', isPlaying);
        });
    }

    // Heart Rain Button
    if (btnHeartRain) {
        btnHeartRain.addEventListener('click', () => {
            audioManager.playChime();
            let count = 0;
            const rainInterval = setInterval(() => {
                if (particleEngine) {
                    particleEngine.launchConfetti(Math.random() * window.innerWidth, -20, 15);
                }
                count++;
                if (count > 25) clearInterval(rainInterval);
            }, 120);
        });
    }

    if (btnConfetti) {
        btnConfetti.addEventListener('click', () => {
            audioManager.playChime();
            if (particleEngine) {
                particleEngine.launchConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 120);
                particleEngine.launchFirework(window.innerWidth * 0.5, window.innerHeight * 0.3);
            }
        });
    }

    if (btnReplayQuiz) {
        btnReplayQuiz.addEventListener('click', () => {
            const quizOverlay = document.getElementById('quiz-overlay');
            for (let i = 1; i <= 8; i++) {
                const s = document.getElementById(`quiz-step-${i}`);
                if (s) s.classList.remove('active');
            }
            const sCeleb = document.getElementById('quiz-step-celebration');
            if (sCeleb) sCeleb.classList.remove('active');
            const sModal = document.getElementById('surprise-modal');
            if (sModal) sModal.classList.remove('active');

            const s1 = document.getElementById('quiz-step-1');
            if (s1) s1.classList.add('active');
            document.body.classList.add('quiz-active');
            const fp = document.getElementById('floating-master-player');
            if (fp) {
                fp.classList.add('collapsed');
                fp.classList.remove('is-playing');
            }
            const lp = document.getElementById('floating-lyrics-pill');
            if (lp) lp.classList.add('hidden');
            quizOverlay.classList.remove('hidden');

            const dots = document.querySelectorAll('.progress-dot');
            dots.forEach((d, i) => d.classList.toggle('active', i === 0));

            // Reset PIN inputs
            const pinInputs = document.querySelectorAll('.pin-digit');
            pinInputs.forEach(inp => inp.value = "");
            const pinMsg = document.getElementById('pin-error-msg');
            if (pinMsg) {
                pinMsg.textContent = "Hint: The day angel Komal was born (22-09-2003) 🌸";
                pinMsg.style.color = "var(--accent-gold)";
            }

            // Reset options
            document.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('correct'));

            // Restart Special Dedication Song
            if (window.audioManager) {
                audioManager.playSpecialSong();
            }
        });
    }

    // Global Click Anywhere Heart & Love Particle Spawner
    document.addEventListener('click', (e) => {
        // Don't trigger on inputs, textareas, selects, buttons, or player controls
        if (e.target.closest('input, textarea, button, select, a, .f-btn-ctrl, .floating-master-player, .ambient-floating-badges')) return;

        // Spawn floating emoji
        const heart = document.createElement('div');
        heart.className = 'floating-click-heart';
        const emojis = ['💖', '🍬', '❤️', '🌸', '✨', '🥰', '💕', '💋', '👑'];
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        document.body.appendChild(heart);

        // Also occasionally spawn a cute romantic tag
        if (Math.random() > 0.45) {
            const tag = document.createElement('div');
            tag.className = 'floating-click-tag';
            const tags = ['Mithi Chinni 🍬', 'Babu ❤️', 'Sona ✨', 'Meri Jaan 💖', '1000% Love 🥰', 'Happy Birthday 🎂'];
            tag.textContent = tags[Math.floor(Math.random() * tags.length)];
            tag.style.left = `${e.clientX + 16}px`;
            tag.style.top = `${e.clientY - 16}px`;
            document.body.appendChild(tag);
            setTimeout(() => tag.remove(), 1200);
        }

        setTimeout(() => {
            heart.remove();
        }, 1100);
    });
}

/* ==========================================================================
   HERO SPOTLIGHT PHOTO SLIDER
   ========================================================================== */
function initHeroSlider() {
    const spotlightImg = document.getElementById('hero-spotlight-img');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');
    const dots = document.querySelectorAll('.hero-slider-dot');
    const container = document.querySelector('.hero-photo-showcase');

    if (!spotlightImg) return;

    const photos = [
        {
            src: 'https://lh3.googleusercontent.com/d/1eggvmffqQwg7Rwzj527Zb0rVoi_qKlPG',
            badge: '🌸 Radiant Queen',
            title: 'Duniya Ki Sabse Pyari Smile — Mithi Chinni Komal 🌸',
            alt: 'Radiant & Beautiful Komal'
        },
        {
            src: 'https://lh3.googleusercontent.com/d/1Pq-osTH4YLOh1tUoI9ZZtDZZ4kmdmN5H',
            badge: '👑 Royal Grace',
            title: 'Royal Elegance & Angelic Charm In Traditional Attire ✨',
            alt: 'Royal & Elegant Attire'
        },
        {
            src: 'https://lh3.googleusercontent.com/d/1iLugHtMzizXcXTFyHeS_hwB7DGCV6VQj',
            badge: '💑 Made For Each Other',
            title: 'Babu & Mithi Chinni — Do Jism Ek Jaan Forever & Always ❤️',
            alt: 'Babu & Mithi Chinni Together'
        },
        {
            src: 'https://lh3.googleusercontent.com/d/14fiBHjwWnY3yPehhfuB1BoLtxPLVhlGo',
            badge: '✨ Pure Innocence',
            title: 'Aankhon Mein Sitare Aur Dil Mein Masoomiyat 💖',
            alt: 'Pure Radiance & Grace'
        },
        {
            src: 'https://lh3.googleusercontent.com/d/1s9JZwnSAf0_wzraoSDBBk-y3rXg1Voll',
            badge: '🏛️ Royal Moments',
            title: 'Palace Memories & Sitaron Jaisa Pyaar With Babu 👑',
            alt: 'Sweetest Smile of Mithi Chinni'
        },
        {
            src: 'https://lh3.googleusercontent.com/d/1xGOhN7rGX5ngE3Rh8cqKz8accxkMc4Kc',
            badge: '🥰 Eternal Sweetness',
            title: 'Duniya Ki Sabse Khoobsurat Sona — Forever Mine 🌹',
            alt: 'Grace & Charm'
        }
    ];

    const photoTitleEl = document.getElementById('hero-photo-title');
    const photoCounterEl = document.getElementById('hero-photo-counter');
    const photoBadgeEl = document.getElementById('hero-photo-badge-text');

    let currentIndex = 0;
    let autoPlayTimer = null;

    function goToSlide(index) {
        if (index < 0) {
            currentIndex = photos.length - 1;
        } else if (index >= photos.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        spotlightImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        spotlightImg.style.opacity = '0';
        spotlightImg.style.transform = 'scale(0.96)';

        if (photoTitleEl) photoTitleEl.style.opacity = '0';

        setTimeout(() => {
            const currentItem = photos[currentIndex];
            spotlightImg.src = currentItem.src;
            spotlightImg.alt = currentItem.alt;
            spotlightImg.style.opacity = '1';
            spotlightImg.style.transform = 'scale(1)';

            if (photoTitleEl) {
                photoTitleEl.textContent = currentItem.title;
                photoTitleEl.style.opacity = '1';
            }
            if (photoCounterEl) {
                photoCounterEl.textContent = `Photo ${currentIndex + 1} of ${photos.length}`;
            }
            if (photoBadgeEl) {
                photoBadgeEl.textContent = currentItem.badge;
            }
        }, 220);

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.audioManager) audioManager.playChime();
            goToSlide(currentIndex - 1);
            resetAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.audioManager) audioManager.playChime();
            goToSlide(currentIndex + 1);
            resetAutoPlay();
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(dot.getAttribute('data-index'), 10);
            if (!isNaN(idx)) {
                if (window.audioManager) audioManager.playChime();
                goToSlide(idx);
                resetAutoPlay();
            }
        });
    });

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 4500);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    if (container) {
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);
        container.addEventListener('touchstart', stopAutoPlay, { passive: true });
        container.addEventListener('touchend', startAutoPlay, { passive: true });
    }

    startAutoPlay();
}

/* ==========================================================================
   100 THINGS I LOVE ABOUT YOU (Secret Reason Dispenser)
   ========================================================================== */
function initReasonDispenser() {
    const btnDraw = document.getElementById('btn-draw-reason');
    const numberEl = document.getElementById('dispenser-number');
    const textEl = document.getElementById('dispenser-text');
    const displayBox = document.getElementById('dispenser-display');

    if (!btnDraw || !textEl || !numberEl) return;

    const reasons = [
        "Kyunki jab tum hasti ho na meri Mithi Chinni, toh poori duniya ki khushiyan ek taraf ho jaati hain. ❤️",
        "Kyunki tumhara gussa bhi itna cute hota hai ki bas dher saara pyaar karne ka dil karta hai! 🥺",
        "Kyunki tum ek brilliant B.Tech CSE coder ho aur tumhare bade sapne mujhe bohot inspire karte hain. 💻✨",
        "Kyunki phone pe tumhari awaz sunte hi mere poore din ka stress ek second mein gayab ho jata hai. 📱🌸",
        "Kyunki tum bina bole meri har baat samajh jaati ho meri pyari Babu. 💖",
        "Kyunki tumhari aankhon mein sitaron jaisi chamak aur bachpan jaisi masoomiyat hai. ✨",
        "Kyunki tum meri zindagi ki wo Mithi Chinni ho jiske bina meri har subah pheeki hai. 🍬",
        "Kyunki jab tum 'Babu' keh kar bulati ho, mera dil ghanto tak muskurata rehta hai. 🥰",
        "Kyunki tumhara dil itna saaf aur caring hai ki tum hamesha sabka khayal rakhti ho. 🌹",
        "Kyunki tum meri sabse acchi dost bhi ho aur meri zindagi ka sabse pyara pyaar bhi. 👑",
        "Kyunki tumhare saath khamoshi bhi ek behad khoobsurat sukoon deti hai. 🌙",
        "Kyunki jab tum traditional dress pehanti ho, maano asmaan se koi pari utar aayi ho. 🌸",
        "Kyunki tumhari har zidd, har shararat mere chehre par muskaan laati hai. 🍬",
        "Kyunki 22/09/2003 ko khuda ne sabse anmol tohfa meri kismat mein likh diya tha. 🎂",
        "Kyunki tum mujhe har din ek behtar insaan banati ho. 🌟",
        "Kyunki tumhari ek jhalak dekhne ke liye mera dil hamesha bekarar rehta hai. 💕",
        "Kyunki tum meri prayer ho, meri mannat ho, aur meri poori duniya ho meri Sona. 🤲❤️",
        "Kyunki tumhari innocence is duniya ki sabse rare aur precious cheez hai. 💎",
        "Kyunki jab tum gussa hoke mooh fulaati ho, toh 10 guna zyada cute lagti ho! 😂",
        "Kyunki tumhare bina mera koi bhi festival, koi bhi din poora nahi hota. 🎆",
        "Kyunki tum mere har secret ki sabse safe guardian ho. 🔐",
        "Kyunki tumhari har photo itni pyari hai ki gallery se nazar hatana mushkil ho jata hai. 📸",
        "Kyunki tum mere liye 1000% infinite ho — made for each other forever! ♾️❤️",
        "Kyunki tumhare sapne mere sapne hain, aur tumhari kamyabi meri sabse badi khushi hai. 🎓",
        "Kyunki tum meri zindagi ka pehla aur aakhri saccha pyaar ho. 💍",
        "Kyunki tumhare haath pakadne par lagta hai poori duniya jeet li. 🤝",
        "Kyunki tum meri sweetest Mithi Chinni ho, jiska koi muqabla nahi! 🍯",
        "Kyunki tumhari aankhein jab mujhse baat karti hain, toh lafzon ki zaroorat nahi padti. 👀✨",
        "Kyunki tum meri rooh ka hissa ho meri pyari Komal. 🕊️",
        "Kyunki main tumhe kal se zyada aur aane wale kal se thoda kam pyaar karta hoon — hamesha badhta hua pyaar! 💖",
        "Kyunki Tony Stark ne kaha tha 'I Love You 3000', lekin mera pyaar aapke liye 3000 times infinity aur har multiverse se bhi bada hai! 🦾❤️✨",
        "Kyunki tum meri Pepper Potts ho — jab main lost hota hoon, tum hi meri sabse badi guidance aur sabse pyara sukoon banti ho. 💍💙",
        "Kyunki 'Proof That Tony Stark Has A Heart' toh sabne dekha, par mere dil ki har ek beat sirf 'Komal Komal' kehti hai! ⚡💖"
    ];

    let drawnIndices = [];
    let currentCount = 1;

    btnDraw.addEventListener('click', (e) => {
        if (window.audioManager) {
            audioManager.playChime();
            audioManager.triggerSituation('reason_drawn'); // Contextual song switch: Aitbaar from 30s!
        }

        const rect = btnDraw.getBoundingClientRect();
        if (window.particleEngine) {
            particleEngine.launchConfetti(rect.left + rect.width / 2, rect.top, 50);
        }

        // Pick next reason without repeating until all shown
        if (drawnIndices.length >= reasons.length) {
            drawnIndices = [];
        }
        let nextIdx;
        do {
            nextIdx = Math.floor(Math.random() * reasons.length);
        } while (drawnIndices.includes(nextIdx) && drawnIndices.length < reasons.length);

        drawnIndices.push(nextIdx);
        currentCount++;

        // Smooth text morph
        displayBox.style.transform = 'scale(0.96)';
        displayBox.style.opacity = '0.4';

        setTimeout(() => {
            numberEl.textContent = `Reason #${(currentCount % 100) || 100} of 100 💖`;
            textEl.textContent = `"${reasons[nextIdx]}"`;
            displayBox.style.transform = 'scale(1)';
            displayBox.style.opacity = '1';
        }, 200);
    });
}

/* ==========================================================================
   3 MYSTERY BIRTHDAY GIFT BOXES
   ========================================================================== */
function initGiftBoxes() {
    const giftBoxes = document.querySelectorAll('.gift-box-card');

    giftBoxes.forEach((box) => {
        box.addEventListener('click', () => {
            const wasOpened = box.classList.contains('opened');
            box.classList.toggle('opened');

            if (!wasOpened) {
                if (window.audioManager) {
                    audioManager.playChime();
                    const giftId = box.getAttribute('data-gift');
                    if (giftId === '1') {
                        audioManager.triggerSituation('gift_1_opened'); // Humdum from 30s!
                    } else if (giftId === '2') {
                        audioManager.triggerSituation('gift_2_opened'); // Tujhko from 30s!
                    } else if (giftId === '3') {
                        audioManager.triggerSituation('gift_3_opened'); // O Sanam from 30s!
                    } else {
                        audioManager.triggerSituation('gift_opened'); // O Sanam from 30s!
                    }
                }
                const rect = box.getBoundingClientRect();
                if (window.particleEngine) {
                    particleEngine.launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
                }
            }
        });
    });
}

/* ==========================================================================
   ROMANTIC MUSIC INTERLUDES & MASTER JUKEBOX CONTROLLER
   ========================================================================== */
function initMusicInterludes() {
    const interludeSections = document.querySelectorAll('.music-interlude-section');

    interludeSections.forEach(section => {
        const songIdx = parseInt(section.getAttribute('data-song-index'), 10);
        const playBtn = section.querySelector('.btn-song-play');
        const mainPartBtn = section.querySelector('.btn-song-mainpart');
        const scrubberBg = section.querySelector('.music-progress-bar-bg');

        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (audioManager.currentTrackIndex === songIdx && audioManager.isPlayingBGM) {
                    audioManager.pauseTrack();
                } else {
                    // Start track after 10-15s intro cutoff ("MST BAJEGA"!)
                    audioManager.playTrack(songIdx, null);
                }
            });
        }

        if (mainPartBtn) {
            mainPartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                audioManager.playMainPart(songIdx);
            });
        }

        if (scrubberBg) {
            scrubberBg.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = scrubberBg.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                if (audioManager.currentTrackIndex !== songIdx) {
                    audioManager.playTrack(songIdx, null);
                }
                audioManager.seek(percentage);
            });
        }
    });

    // Quick Mood Jukebox Buttons
    const moodChips = document.querySelectorAll('.btn-mood-chip');
    moodChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.stopPropagation();
            const songIdx = parseInt(chip.getAttribute('data-song'), 10);
            moodChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            // Play from the main part / chorus directly!
            audioManager.playMainPart(songIdx);
        });
    });

    // Master Floating Player Controls
    const masterPlayBtn = document.getElementById('master-play-btn');
    const masterPrevBtn = document.getElementById('master-prev-btn');
    const masterNextBtn = document.getElementById('master-next-btn');
    const masterMainPartBtn = document.getElementById('master-mainpart-btn');
    const masterHideBtn = document.getElementById('master-hide-btn');
    const floatingPlayer = document.getElementById('floating-master-player');

    if (masterPlayBtn) {
        masterPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            audioManager.togglePlay();
        });
    }

    if (masterPrevBtn) {
        masterPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            audioManager.playPrev();
        });
    }

    if (masterNextBtn) {
        masterNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            audioManager.playNext();
        });
    }

    if (masterMainPartBtn) {
        masterMainPartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            audioManager.playMainPart(audioManager.currentTrackIndex);
        });
    }

    if (masterHideBtn && floatingPlayer) {
        masterHideBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingPlayer.classList.add('collapsed');
            const lyricsPill = document.getElementById('floating-lyrics-pill');
            if (lyricsPill) lyricsPill.classList.add('hidden');
        });
    }

    // Return to Special Dedication Song button on Floating Master Player
    const masterSpecialBtn = document.getElementById('master-special-btn');
    if (masterSpecialBtn) {
        masterSpecialBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.audioManager) {
                audioManager.forcePlaySpecialSong();
            }
        });
    }

    // Click on vows scroll gives a gentle romantic chime without interrupting background audio
    const vowsScroll = document.querySelector('.vows-scroll');
    if (vowsScroll) {
        vowsScroll.addEventListener('click', () => {
            if (window.audioManager) {
                audioManager.playChime();
            }
        });
    }
}

/* ==========================================================================
   FRIENDS WISHES WALL CONTROLLER (AKASH, RAUSHAN, ABHISHEK, ADITYA, ASHIK, PANDIT & GANG)
   ========================================================================== */
function initFriendsWishes() {
    const filterChips = document.querySelectorAll('.wish-filter-chip');
    const wishesGrid = document.getElementById('friends-wishes-grid');
    const btnPostWish = document.getElementById('btn-post-friend-wish');
    const nameInput = document.getElementById('friend-wish-name');
    const avatarSelect = document.getElementById('friend-wish-avatar');
    const msgInput = document.getElementById('friend-wish-msg');

    // 1. Category Filters
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter');
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const currentCards = document.querySelectorAll('.friend-wish-card');
            currentCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                const categories = category.split(/\s+/);
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            if (window.audioManager) {
                audioManager.playChime();
            }
        });
    });

    // 2. Like Button Handler function
    function setupLikeButton(btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            let currentLikes = parseInt(btn.getAttribute('data-likes') || '0', 10);
            const countEl = btn.querySelector('.like-count');
            const isLiked = btn.classList.contains('liked');

            if (!isLiked) {
                currentLikes += 1;
                btn.classList.add('liked');
                if (window.particleEngine) {
                    const rect = btn.getBoundingClientRect();
                    particleEngine.launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
                }
                if (window.audioManager) {
                    audioManager.playChime();
                }
            } else {
                currentLikes -= 1;
                btn.classList.remove('liked');
            }

            btn.setAttribute('data-likes', currentLikes);
            if (countEl) countEl.textContent = currentLikes;
        });
    }

    document.querySelectorAll('.btn-like-wish').forEach(btn => setupLikeButton(btn));

    // 3. Post Custom Friend Wish
    if (btnPostWish && nameInput && msgInput && wishesGrid) {
        btnPostWish.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const msg = msgInput.value.trim();
            const avatarEmoji = (avatarSelect && avatarSelect.value) ? avatarSelect.value : '🌸';

            if (!name || !msg) {
                if (!name) nameInput.focus();
                else msgInput.focus();

                btnPostWish.style.transform = 'translateX(-5px)';
                setTimeout(() => { btnPostWish.style.transform = 'translateX(5px)'; }, 80);
                setTimeout(() => { btnPostWish.style.transform = 'translateX(0)'; }, 160);
                return;
            }

            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm} • Just Now`;

            // Create new card
            const newCard = document.createElement('div');
            newCard.className = 'friend-wish-card glass-card';
            newCard.setAttribute('data-category', 'squad');

            newCard.innerHTML = `
                <div class="wish-card-glow"></div>
                <div class="wish-card-top">
                    <div class="friend-avatar-wrapper avatar-custom">
                        <span class="friend-avatar-icon">${avatarEmoji}</span>
                        <span class="friend-badge-verified" title="Verified Friend">✓</span>
                    </div>
                    <div class="friend-info">
                        <h3 class="friend-name">${escapeHtml(name)} <span class="friend-verified-star">⭐</span></h3>
                        <span class="friend-role-badge role-boys">Devar Ji / Well-Wisher 💖</span>
                    </div>
                    <span class="wish-time-badge">${formattedTime}</span>
                </div>
                <div class="wish-card-message">
                    <span class="quote-mark">“</span>
                    <p>${escapeHtml(msg)}</p>
                </div>
                <div class="wish-card-footer">
                    <div class="wish-reaction-tag">
                        <span>💖 Pyaari Wish!</span>
                    </div>
                    <button class="btn-like-wish" data-likes="1">
                        <span class="like-icon">❤️</span> <span class="like-text">Love</span> <span class="like-count">1</span>
                    </button>
                </div>
            `;

            // Prepend new card to the wall
            wishesGrid.insertBefore(newCard, wishesGrid.firstChild);

            // Bind like button
            const newLikeBtn = newCard.querySelector('.btn-like-wish');
            if (newLikeBtn) setupLikeButton(newLikeBtn);

            // Reset inputs
            nameInput.value = '';
            msgInput.value = '';

            // Celebration confetti & audio feedback
            if (window.particleEngine) {
                particleEngine.launchConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 60);
            }
            if (window.audioManager) {
                audioManager.playChime();
            }

            // Scroll gently into view
            newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

/* ==========================================================================
   IRON MAN "LOVE YOU 3000" & ARC REACTOR INTERACTIVE EXPERIENCE
   ========================================================================== */
function initIronManSection() {
    const reactor = document.getElementById('arc-reactor-interactive');
    const housing = document.querySelector('.arc-reactor-housing');
    const btnCharge = document.getElementById('btn-charge-reactor');
    const btnPepper = document.getElementById('btn-pepper-vow');
    const statusToast = document.getElementById('reactor-status-msg');

    if (!reactor) return;

    let chargeCount = 0;
    const chargeMessages = [
        "⚡ ARC REACTOR AT 3000% OVERDRIVE! 💙 Babu's Heart is completely supercharged by Komal's Love!",
        "🚀 STARK CORE MAXIMUM OUTPUT: 'I Love You 3000' radiating across all multiverses!",
        "💎 QUANTUM FIELD STABILIZED: Komal's smile generates infinite clean energy for Babu's heart! 🌟",
        "🌌 ETERNAL REACTOR LOCK: Sealed with 3000 kisses, infinite promises, and unconditional love! 💍✨"
    ];

    const triggerReactorPower = (e, customMsg = null) => {
        if (housing) {
            housing.classList.remove('overcharged');
            void housing.offsetWidth; // trigger reflow
            housing.classList.add('overcharged');
        }

        if (window.audioManager) {
            audioManager.playChime();
        }

        if (window.particleEngine) {
            const rect = reactor.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            particleEngine.launchConfetti(centerX, centerY, 70);
            particleEngine.launchShootingStar();
        }

        if (statusToast) {
            const msg = customMsg || chargeMessages[chargeCount % chargeMessages.length];
            chargeCount++;
            statusToast.innerHTML = `<strong>⚡ PROTOCOL ENGAGED:</strong> ${msg}`;
            statusToast.classList.add('active');
        }
    };

    reactor.addEventListener('click', (e) => {
        triggerReactorPower(e);
    });

    if (btnCharge) {
        btnCharge.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerReactorPower(e);
        });
    }

    if (btnPepper) {
        btnPepper.addEventListener('click', (e) => {
            e.stopPropagation();
            const pepperMsg = "💍 <em>'Part of the journey is the end, but with you Komal, my love has no end.'</em> — Babu's Eternal Pepper Potts Vow! 💖👑";
            triggerReactorPower(e, pepperMsg);
        });
    }
}






