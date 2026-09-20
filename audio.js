// Web Audio API Sound Engine & Romantic Music Player for Komal's Birthday Surprise
// 100% Offline, Zero External Dependencies, All MP3s Located in Root Directory

class AudioManager {
    constructor() {
        window.audioManager = this;
        this.ctx = null;
        this.masterGain = null;

        // 10 Curated Romantic Bollywood Soundtracks (100% Offline in Root Folder)
        // Intro (18s) trimmed; each track is ~2:00 min with gentle fade-in & fade-out!
        this.playlist = [
            {
                id: 'aaj-se-teri',
                title: 'Aaj Se Teri',
                artist: 'Arijit Singh & Amit Trivedi',
                film: 'Padman (Akshay Kumar & Radhika Apte)',
                src: 'aaj-se-teri.mp3',
                introStart: 0,
                mainPart: 18,
                totalTime: '2:00',
                lyrics: '💍 "Aaj se teri saari galiyan meri ho gayi... aaj se mera ghar tera ho gaya" ❤️✨',
                mood: 'devotion'
            },
            {
                id: 'tum-ho-toh',
                title: 'Tum Ho Toh',
                artist: 'Vishal Mishra & Hansika Pareek',
                film: 'Saiyaara',
                src: 'tum-ho-toh.mp3',
                introStart: 0,
                mainPart: 24,
                totalTime: '2:00',
                lyrics: '🎶 "Tum ho toh har lamha haseen lagta hai... zameen aasmaan lagta hai" ❤️',
                mood: 'romantic'
            },
            {
                id: 'aitbaar',
                title: 'Aitbaar / Chand Mera Dil',
                artist: 'Faheem Abdullah & Sachin-Jigar',
                film: 'Chand Mera Dil',
                src: 'aitbaar.mp3',
                introStart: 0,
                mainPart: 26,
                totalTime: '2:00',
                lyrics: '✨ "Aitbaar... Chand mera dil, sitare teri aadaayein..." 🌙',
                mood: 'soulful'
            },
            {
                id: 'ishq-de-fanniyar',
                title: 'Ishq De Fanniyar (Female Version)',
                artist: 'Jyotica Tangri',
                film: 'Fukrey Returns',
                src: 'ishq-de-fanniyar.mp3',
                introStart: 0,
                mainPart: 16,
                totalTime: '2:00',
                lyrics: '🌸 "Karaan main tareefan... Meri cute Mithi Chinni ke fanniyar lada gaye!" 🍬',
                mood: 'playful'
            },
            {
                id: 'tujhko',
                title: 'Tujhko',
                artist: 'Arijit Singh',
                film: 'Cocktail 2',
                src: 'tujhko.mp3',
                introStart: 0,
                mainPart: 30,
                totalTime: '2:00',
                lyrics: '👑 "Tujhko jo paaya toh sab mil gaya... meri har dua tu hi" ✨',
                mood: 'devotion'
            },
            {
                id: 'humdum',
                title: 'Humdum',
                artist: 'Vishal Mishra & Raj Shekhar',
                film: 'Savi',
                src: 'humdum.mp3',
                introStart: 0,
                mainPart: 27,
                totalTime: '2:00',
                lyrics: '🤝 "Mera humdum tu, meri har saans me tu, meri pyari Sona..." 💖',
                mood: 'companion'
            },
            {
                id: 'ijazat',
                title: 'Ijazat',
                artist: 'Arijit Singh & Meet Bros',
                film: 'One Night Stand',
                src: 'ijazat.mp3',
                introStart: 0,
                mainPart: 20,
                totalTime: '1:50',
                lyrics: '💌 "Le qabool kar liya maine... dhoondhe har dafa tujhe hi dil mera" 🌹',
                mood: 'confession'
            },
            {
                id: 'tera-mera-rishta',
                title: 'Tera Mera Rishta (New Version)',
                artist: 'Mithoon, Saaj Bhatt & Mustafa',
                film: 'Awarapan 2',
                src: 'tera-mera-rishta.mp3',
                introStart: 0,
                mainPart: 30,
                totalTime: '2:00',
                lyrics: '💍 "Tera mera rishta hai kaisa, ek pal door gawara nahi... Janam-janam ka nata" ♾️',
                mood: 'eternal'
            },
            {
                id: 'o-sanam',
                title: 'O Sanam',
                artist: 'Akhil Sachdeva',
                film: 'Single',
                src: 'o-sanam.mp3',
                introStart: 0,
                mainPart: 34,
                totalTime: '2:00',
                lyrics: '🌹 "O Sanam... Tere bina jeena nahi meri Sona, har janam sirf tera" 💕',
                mood: 'eternal'
            },
            {
                id: 'barbaad',
                title: 'Barbaad',
                artist: 'Jubin Nautiyal & The Rish',
                film: 'Saiyaara',
                src: 'barbaad.mp3',
                introStart: 0,
                mainPart: 28,
                totalTime: '2:00',
                lyrics: '🎆 "Barbaad ho gaye hum tere pyaar mein... Happy 23rd Birthday Mithi Chinni!" 🎂',
                mood: 'celebration'
            }
        ];

        this.currentTrackIndex = 0;
        this.isPlayingBGM = false;
        this.isPlayingSpecial = false;
        this.specialEndedHandled = false;
        this.specialSongFinished = false;
        this.duckTimer = null;
        this.isTransitioning = false;
        this.hasPlayedFullSequence = false;
        this.outroSkipSeconds = 2.5;
        this.activeSource = 'special'; // Special song plays first!

        // Master Audio Engine: Single unified Audio instance for bulletproof mobile playback
        this.audio = new Audio('special-song-combined.mp3');
        this.audio.preload = 'auto';
        this.audio.volume = 1.0;
        this.audio.loop = false; // False so it transitions automatically to Bollywood tracks!

        // Transparent alias
        this.specialAudio = this.audio;

        this.setupAudioListeners();
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setupAudioListeners() {
        this.audio.addEventListener('timeupdate', () => {
            if (this.activeSource === 'special') {
                this.updateSpecialSongProgress();
                const cur = this.audio.currentTime;
                const dur = this.audio.duration;
                // Transition smoothly when special song reaches the end (~98s)
                if (dur && dur > 10 && cur >= (dur - 0.4) && !this.isTransitioning) {
                    this.isTransitioning = true;
                    this.handleSpecialSongEnded();
                }
            } else {
                this.updateTrackProgress();
                const dur = this.audio.duration;
                const cur = this.audio.currentTime;
                if (dur && dur > 30 && cur >= (dur - this.outroSkipSeconds) && !this.isTransitioning && this.isPlayingBGM) {
                    this.isTransitioning = true;
                    this.playNext();
                }
            }
        });

        this.audio.addEventListener('ended', () => {
            if (this.isTransitioning) return;
            this.isTransitioning = true;
            if (this.activeSource === 'special') {
                this.handleSpecialSongEnded();
            } else {
                this.playNext();
            }
        });

        this.audio.addEventListener('playing', () => {
            this.isTransitioning = false;
        });

        this.audio.addEventListener('play', () => {
            if (this.activeSource === 'special') {
                this.isPlayingSpecial = true;
                this.isPlayingBGM = false;
                this.syncSpecialUI(true);
                this.syncHUDState(true);
            } else {
                this.isPlayingBGM = true;
                this.isPlayingSpecial = false;
                this.syncUIState(true);
                this.syncHUDState(true);
            }
        });

        this.audio.addEventListener('pause', () => {
            if (this.activeSource === 'special') {
                this.isPlayingSpecial = false;
                this.syncSpecialUI(false);
                if (!this.isPlayingBGM) {
                    this.syncHUDState(false);
                }
            } else {
                this.isPlayingBGM = false;
                this.syncUIState(false);
                if (!this.isPlayingSpecial) {
                    this.syncHUDState(false);
                }
            }
        });
    }

    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Automatic transition from Special Song to Bollywood Playlist (Track 0: Aaj Se Teri)
    handleSpecialSongEnded() {
        if (this.specialEndedHandled) return;
        this.specialEndedHandled = true;

        console.log('Special Song completed! Continuing automatically with 10 Bollywood songs starting from Track #0 (Aaj Se Teri)...');
        this.isPlayingSpecial = false;
        this.specialSongFinished = true;
        this.syncSpecialUI(false);

        // Play Track #0 (Aaj Se Teri)
        this.playTrack(0, 0);
    }

    // Play Special Dedication Song (Called on initial unlock)
    playSpecialSong() {
        this.init();
        if (this.specialSongFinished || this.isPlayingBGM) {
            return;
        }

        this.activeSource = 'special';
        this.specialEndedHandled = false;

        const currentSrc = this.audio.getAttribute('src') || this.audio.src || '';
        if (!currentSrc.includes('special-song-combined.mp3')) {
            this.audio.src = 'special-song-combined.mp3';
            this.audio.load();
        }

        if (!this.audio.paused && this.isPlayingSpecial && this.audio.currentTime > 0) {
            return;
        }

        if (this.audio.ended) {
            this.audio.currentTime = 0;
        }

        this.audio.volume = 1.0;
        const promise = this.audio.play();
        if (promise !== undefined) {
            promise.then(() => {
                this.isPlayingSpecial = true;
                this.isPlayingBGM = false;
                this.isTransitioning = false;
                this.syncSpecialUI(true);
                this.syncHUDState(true);
            }).catch(err => {
                console.log('Audio autoplay waiting for user interaction:', err);
                this.isPlayingSpecial = false;
                this.syncSpecialUI(false);
            });
        }
    }

    forcePlaySpecialSong(resetTime = true) {
        this.init();
        this.activeSource = 'special';
        this.specialSongFinished = false;
        this.specialEndedHandled = false;
        this.isTransitioning = false;

        const currentSrc = this.audio.getAttribute('src') || this.audio.src || '';
        if (!currentSrc.includes('special-song-combined.mp3')) {
            this.audio.src = 'special-song-combined.mp3';
            this.audio.load();
        }

        if (resetTime || this.audio.ended) {
            this.audio.currentTime = 0;
        }

        this.audio.volume = 1.0;
        const promise = this.audio.play();
        if (promise !== undefined) {
            promise.then(() => {
                this.isPlayingSpecial = true;
                this.isPlayingBGM = false;
                this.syncSpecialUI(true);
                this.syncHUDState(true);
            }).catch(e => {
                console.warn('Special audio playback blocked:', e);
            });
        }
    }

    pauseSpecialSong() {
        if (this.activeSource === 'special') {
            this.audio.pause();
        }
        this.isPlayingSpecial = false;
        this.syncSpecialUI(false);
        this.syncHUDState(false);
    }

    toggleSpecialSong() {
        if (this.isPlayingSpecial && !this.audio.paused && this.activeSource === 'special') {
            this.pauseSpecialSong();
            return false;
        } else {
            this.forcePlaySpecialSong(false);
            return true;
        }
    }

    syncHUDState(isPlaying) {
        const hudBgmBtn = document.getElementById('hud-bgm-toggle');
        if (hudBgmBtn) {
            hudBgmBtn.classList.toggle('active', isPlaying);
        }
        const masterPlayBtn = document.getElementById('master-play-btn');
        if (masterPlayBtn) {
            masterPlayBtn.textContent = isPlaying ? '⏸' : '▶';
        }
        const floatingPlayer = document.getElementById('floating-master-player');
        if (floatingPlayer) {
            floatingPlayer.classList.toggle('is-playing', isPlaying);
        }
    }

    updateSpecialSongProgress() {
        const cur = this.audio.currentTime || 0;
        const dur = this.audio.duration || 98.3; // ~1:38 duration
        const pct = Math.min(100, (cur / dur) * 100);

        const fill = document.getElementById('quiz-special-progress-fill');
        const timeEl = document.getElementById('quiz-special-time');

        if (fill) fill.style.width = `${pct}%`;
        if (timeEl) timeEl.textContent = `${this.formatTime(cur)} / ${this.formatTime(dur)}`;
    }

    isQuizActive() {
        const quizOverlay = document.getElementById('quiz-overlay');
        const surpriseModal = document.getElementById('surprise-modal');
        const isOverlayOpen = quizOverlay && !quizOverlay.classList.contains('hidden');
        const isModalOpen = surpriseModal && surpriseModal.classList.contains('active');
        const isBodyActive = document.body && document.body.classList.contains('quiz-active');
        return isOverlayOpen || isModalOpen || isBodyActive;
    }

    syncSpecialUI(isPlaying) {
        const playIcon = document.getElementById('quiz-special-play-icon');
        const eqEl = document.getElementById('quiz-music-eq');
        const bannerEl = document.getElementById('quiz-special-music-banner');

        if (playIcon) playIcon.textContent = isPlaying ? '⏸' : '▶';
        if (eqEl) eqEl.classList.toggle('playing', isPlaying);
        if (bannerEl) bannerEl.classList.toggle('is-playing', isPlaying);

        // Reflect on Floating Master Player
        const floatingPlayer = document.getElementById('floating-master-player');
        const masterTitle = document.getElementById('master-player-title');
        const masterArtist = document.getElementById('master-player-artist');
        const masterPlayBtn = document.getElementById('master-play-btn');
        const lyricsPill = document.getElementById('floating-lyrics-pill');

        const quizActive = this.isQuizActive();

        if (floatingPlayer) {
            if (quizActive) {
                floatingPlayer.classList.add('collapsed');
                floatingPlayer.classList.remove('is-playing');
            } else if (isPlaying) {
                floatingPlayer.classList.remove('collapsed');
                floatingPlayer.classList.add('is-playing');
            } else if (!this.isPlayingBGM) {
                floatingPlayer.classList.remove('is-playing');
            }
        }

        if (masterTitle && isPlaying) {
            masterTitle.textContent = 'Special Dedication Song 🍬';
        }
        if (masterArtist && isPlaying) {
            masterArtist.textContent = "Babu's Heartfelt Melody 💕";
        }
        if (masterPlayBtn && !this.isPlayingBGM) {
            masterPlayBtn.textContent = isPlaying ? '⏸' : '▶';
        }
        if (lyricsPill) {
            if (quizActive) {
                lyricsPill.classList.add('hidden');
            } else if (isPlaying) {
                lyricsPill.innerHTML = `<span>🍬</span> <span>"Special Dedication for Meri Mithi Chinni Komal ❤️"</span>`;
                lyricsPill.classList.remove('hidden');
            } else if (!this.isPlayingBGM) {
                lyricsPill.classList.add('hidden');
            }
        }
    }

    // Play Bollywood track from 0s (Intro is already cut in the audio file!)
    playTrack(index, startTime = 0) {
        this.init();
        this.activeSource = 'bollywood';
        this.isPlayingSpecial = false;
        this.syncSpecialUI(false);

        if (index < 0) index = this.playlist.length - 1;
        if (index >= this.playlist.length) index = 0;

        const track = this.playlist[index];
        this.currentTrackIndex = index;

        const currentSrc = this.audio.getAttribute('src') || this.audio.src || '';
        const isSameTrack = currentSrc.includes(track.src);

        if (!isSameTrack) {
            this.audio.src = track.src;
            this.audio.load();
        }

        this.audio.currentTime = startTime || 0;
        this.audio.volume = 1.0;

        const p = this.audio.play();
        if (p !== undefined) {
            p.then(() => {
                this.isPlayingBGM = true;
                this.isTransitioning = false;
                this.syncUIState(true);
                this.syncHUDState(true);
            }).catch(err => {
                console.log('Bollywood audio play policy wait:', err);
            });
        }
    }

    // Jump directly to the chorus/hook of active song
    playMainPart(index) {
        this.init();
        if (this.activeSource === 'special' || this.isPlayingSpecial) {
            this.audio.currentTime = 30;
            this.audio.play().catch(() => {});
            return;
        }

        const track = this.playlist[index];
        if (!track) return;
        this.playTrack(index, track.mainPart || 0);

        if (window.particleEngine) {
            particleEngine.launchConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 70);
        }
    }

    pauseTrack() {
        this.audio.pause();
        this.isPlayingBGM = false;
        this.syncUIState(false);
        this.syncHUDState(false);
    }

    togglePlay() {
        this.init();
        if (!this.audio.paused && (this.isPlayingBGM || this.isPlayingSpecial)) {
            this.audio.pause();
            this.isPlayingBGM = false;
            this.isPlayingSpecial = false;
            this.syncUIState(false);
            this.syncSpecialUI(false);
            this.syncHUDState(false);
            return false;
        } else {
            if (this.activeSource === 'special' && !this.specialSongFinished) {
                this.forcePlaySpecialSong(false);
            } else {
                this.playTrack(this.currentTrackIndex, this.audio.currentTime || 0);
            }
            return true;
        }
    }

    getRandomTrackIndex() {
        const available = [];
        for (let i = 0; i < this.playlist.length; i++) {
            if (i !== this.currentTrackIndex) available.push(i);
        }
        return available[Math.floor(Math.random() * available.length)];
    }

    playNext() {
        this.isTransitioning = false;
        if (this.activeSource === 'special' || this.isPlayingSpecial) {
            this.handleSpecialSongEnded();
            return;
        }

        if (this.hasPlayedFullSequence) {
            const nextIdx = this.getRandomTrackIndex();
            this.playTrack(nextIdx, 0);
        } else {
            let nextIdx = this.currentTrackIndex + 1;
            if (nextIdx >= this.playlist.length) {
                this.hasPlayedFullSequence = true;
                nextIdx = this.getRandomTrackIndex();
            }
            this.playTrack(nextIdx, 0);
        }
    }

    playPrev() {
        this.isTransitioning = false;
        if (this.activeSource === 'special' || this.isPlayingSpecial) {
            this.audio.currentTime = 0;
            this.audio.play().catch(() => {});
            return;
        }

        const prevIdx = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.playTrack(prevIdx, 0);
    }

    seek(percentage) {
        if (!this.audio.duration) return;
        this.audio.currentTime = percentage * this.audio.duration;
    }

    startBGM() {
        this.playSpecialSong();
    }

    stopBGM() {
        this.audio.pause();
        this.isPlayingBGM = false;
        this.isPlayingSpecial = false;
        this.syncUIState(false);
        this.syncSpecialUI(false);
        this.syncHUDState(false);
    }

    toggleBGM() {
        return this.togglePlay();
    }

    triggerSituation(situation) {
        // Keeps song playing uninterrupted
    }

    // Sync all UI components
    syncUIState(isPlaying) {
        const curTrack = this.playlist[this.currentTrackIndex];

        // 1. Update HUD button
        const hudBgmBtn = document.getElementById('hud-bgm-toggle');
        if (hudBgmBtn) {
            hudBgmBtn.classList.toggle('active', isPlaying);
        }

        // 2. Update all Interlude Cards
        const interludeCards = document.querySelectorAll('.music-interlude-section');
        interludeCards.forEach(sec => {
            const songIdx = parseInt(sec.getAttribute('data-song-index'), 10);
            const card = sec.querySelector('.music-interlude-card');
            const playBtn = sec.querySelector('.btn-song-play');
            const playText = sec.querySelector('.play-text');
            const playIcon = sec.querySelector('.play-icon');

            if (songIdx === this.currentTrackIndex) {
                if (card) card.classList.toggle('is-playing', isPlaying);
                if (playText) playText.textContent = isPlaying ? 'Pause' : 'Play Song';
                if (playIcon) playIcon.textContent = isPlaying ? '⏸' : '▶';
            } else {
                if (card) card.classList.remove('is-playing');
                if (playText) playText.textContent = 'Play Song';
                if (playIcon) playIcon.textContent = '▶';
            }
        });

        // 3. Update Floating Master Player
        const floatingPlayer = document.getElementById('floating-master-player');
        const masterTitle = document.getElementById('master-player-title');
        const masterArtist = document.getElementById('master-player-artist');
        const masterPlayBtn = document.getElementById('master-play-btn');

        const quizActive = this.isQuizActive();

        if (floatingPlayer) {
            if (quizActive) {
                floatingPlayer.classList.add('collapsed');
                floatingPlayer.classList.remove('is-playing');
            } else {
                floatingPlayer.classList.remove('collapsed');
                floatingPlayer.classList.toggle('is-playing', isPlaying);
            }
        }
        if (masterTitle && curTrack) {
            masterTitle.textContent = `${curTrack.title} — ${curTrack.film}`;
        }
        if (masterArtist && curTrack) {
            masterArtist.textContent = curTrack.artist;
        }
        if (masterPlayBtn) {
            masterPlayBtn.textContent = isPlaying ? '⏸' : '▶';
        }

        // 4. Update Floating Lyrics Pill
        const lyricsPill = document.getElementById('floating-lyrics-pill');
        if (lyricsPill && curTrack) {
            if (!quizActive && isPlaying) {
                lyricsPill.innerHTML = `<span>🎵</span> <span>${curTrack.lyrics}</span>`;
                lyricsPill.classList.remove('hidden');
            } else {
                lyricsPill.classList.add('hidden');
            }
        }
    }

    // Live update for scrubbers and timestamps
    updateTrackProgress() {
        const cur = this.audio.currentTime || 0;
        const dur = this.audio.duration || 120;
        const pct = Math.min(100, (cur / dur) * 100);

        const curFormatted = this.formatTime(cur);
        const durFormatted = this.formatTime(dur);

        const currentInterlude = document.querySelector(`.music-interlude-section[data-song-index="${this.currentTrackIndex}"]`);
        if (currentInterlude) {
            const fill = currentInterlude.querySelector('.music-progress-bar-fill');
            const curTimeEl = currentInterlude.querySelector('.cur-time');
            const totalTimeEl = currentInterlude.querySelector('.total-time');

            if (fill) fill.style.width = `${pct}%`;
            if (curTimeEl) curTimeEl.textContent = curFormatted;
            if (totalTimeEl && dur > 1) totalTimeEl.textContent = durFormatted;
        }
    }

    // Duck volume for sound effects
    duckVolume() {
        if (this.duckTimer) {
            clearTimeout(this.duckTimer);
            this.duckTimer = null;
        }

        this.audio.volume = 0.70;

        this.duckTimer = setTimeout(() => {
            this.audio.volume = 1.0;
            this.duckTimer = null;
        }, 500);
    }

    // =========================================================================
    // SYNTHESIZED SOUND EFFECTS
    // =========================================================================
    playNote(freq, time = 0, duration = 1.6, type = 'sine', volume = 0.2) {
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const noteGain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + time);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1200, this.ctx.currentTime + time);

            const startTime = this.ctx.currentTime + time;
            noteGain.gain.setValueAtTime(0.0001, startTime);
            noteGain.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + 0.08);
            noteGain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

            osc.connect(filter);
            filter.connect(noteGain);
            noteGain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.1);
        } catch (e) { }
    }

    playPop() {
        this.init();
        this.duckVolume();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.09);

            this.playChime(now + 0.06);
        } catch (e) { }
    }

    playChime(offset = 0) {
        this.init();
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = this.ctx.currentTime + offset + (i * 0.07);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.001, t);
            gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 0.65);
        });
    }

    playBlowCandle() {
        this.init();
        this.duckVolume();
        if (!this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * 0.8;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(600, this.ctx.currentTime);
            filter.Q.setValueAtTime(3, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.7);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            noise.start();
        } catch (e) { }
    }

    playCelebrationFanfare() {
        this.init();
        this.duckVolume();
        if (!this.ctx) return;
        const melody = [
            { f: 293.66, d: 0.25, p: 0.0 },
            { f: 293.66, d: 0.25, p: 0.28 },
            { f: 329.63, d: 0.45, p: 0.55 },
            { f: 293.66, d: 0.45, p: 1.05 },
            { f: 392.00, d: 0.55, p: 1.55 },
            { f: 369.99, d: 0.85, p: 2.15 },
        ];

        melody.forEach(n => {
            this.playNote(n.f, n.p, n.d * 1.5, 'triangle', 0.25);
            this.playNote(n.f * 2, n.p + 0.02, n.d, 'sine', 0.1);
        });

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.playFireworkBurst();
            }, i * 600 + 400);
        }
    }

    playFireworkBurst() {
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.42);

            setTimeout(() => {
                this.playChime();
            }, 150);
        } catch (e) { }
    }

    playDodge() {
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(250, now);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.22);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.26);
        } catch (e) { }
    }
}

// Instantiate global audio manager
const audioManager = new AudioManager();
window.audioManager = audioManager;
