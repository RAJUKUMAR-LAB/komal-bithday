// Canvas particle engine for floating hearts, confetti cannon, fireworks, and starry night
class ParticleEngine {
    constructor() {
        this.bgCanvas = null;
        this.bgCtx = null;
        this.fxCanvas = null;
        this.fxCtx = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.ambientHearts = [];
        this.stars = [];
        this.confetti = [];
        this.fireworks = [];
        this.shootingStars = [];
        this.cursorParticles = [];

        this.mousePos = { x: -100, y: -100 };
        this.isHovering = false;

        this.init();
    }

    init() {
        // Create Background Canvas
        this.bgCanvas = document.createElement('canvas');
        this.bgCanvas.id = 'bg-particles-canvas';
        this.bgCanvas.style.position = 'fixed';
        this.bgCanvas.style.top = '0';
        this.bgCanvas.style.left = '0';
        this.bgCanvas.style.width = '100vw';
        this.bgCanvas.style.height = '100vh';
        this.bgCanvas.style.pointerEvents = 'none';
        this.bgCanvas.style.zIndex = '0';
        document.body.prepend(this.bgCanvas);
        this.bgCtx = this.bgCanvas.getContext('2d');

        // Create FX Canvas (for confetti & fireworks on top of content)
        this.fxCanvas = document.createElement('canvas');
        this.fxCanvas.id = 'fx-particles-canvas';
        this.fxCanvas.style.position = 'fixed';
        this.fxCanvas.style.top = '0';
        this.fxCanvas.style.left = '0';
        this.fxCanvas.style.width = '100vw';
        this.fxCanvas.style.height = '100vh';
        this.fxCanvas.style.pointerEvents = 'none';
        this.fxCanvas.style.zIndex = '9999';
        document.body.appendChild(this.fxCanvas);
        this.fxCtx = this.fxCanvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse trail
        window.addEventListener('mousemove', (e) => {
            this.mousePos = { x: e.clientX, y: e.clientY };
            if (Math.random() < 0.35) {
                this.addCursorParticle(e.clientX, e.clientY);
            }
        });

        // Touch support
        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                const touch = e.touches[0];
                if (Math.random() < 0.4) {
                    this.addCursorParticle(touch.clientX, touch.clientY);
                }
            }
        }, { passive: true });

        this.createStars(70);
        this.createAmbientHearts(30);
        this.createRosePetals(22);
        this.createFloatingEmojis(10);
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        this.bgCanvas.width = this.width * dpr;
        this.bgCanvas.height = this.height * dpr;
        this.bgCtx.scale(dpr, dpr);

        this.fxCanvas.width = this.width * dpr;
        this.fxCanvas.height = this.height * dpr;
        this.fxCtx.scale(dpr, dpr);
    }

    createStars(count) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 1.8 + 0.6,
                alpha: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                color: ['#ffffff', '#ffeaa7', '#ffd1dc', '#a29bfe'][Math.floor(Math.random() * 4)]
            });
        }
    }

    createAmbientHearts(count) {
        this.ambientHearts = [];
        for (let i = 0; i < count; i++) {
            this.ambientHearts.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 15 + 10,
                speedY: -(Math.random() * 0.7 + 0.3),
                speedX: (Math.random() - 0.5) * 0.6,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.03 + 0.01,
                alpha: Math.random() * 0.5 + 0.25,
                color: ['#ff4d79', '#ff758c', '#ff8fa3', '#e056fd', '#ffb86c', '#ff2a70'][Math.floor(Math.random() * 6)]
            });
        }
    }

    createRosePetals(count) {
        this.rosePetals = [];
        for (let i = 0; i < count; i++) {
            this.rosePetals.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 12 + 8,
                speedY: Math.random() * 1.2 + 0.6,
                speedX: (Math.random() - 0.5) * 1.2,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 3,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.02 + 0.01,
                alpha: Math.random() * 0.45 + 0.35,
                color: ['#ff1e56', '#ff4d79', '#c0392b', '#e84393', '#d63031'][Math.floor(Math.random() * 5)]
            });
        }
    }

    createFloatingEmojis(count) {
        this.floatingEmojis = [];
        const emojiList = ['💋', '😘', '💖', '🍬', '💕', '🥰', '🌸', '✨', '🎂', '🥺'];
        for (let i = 0; i < count; i++) {
            this.floatingEmojis.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
                size: Math.random() * 8 + 14,
                speedY: -(Math.random() * 0.75 + 0.35),
                speedX: (Math.random() - 0.5) * 0.6,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.03 + 0.015,
                alpha: Math.random() * 0.18 + 0.12
            });
        }
    }

    drawRosePetal(ctx, x, y, size, rotation, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.bezierCurveTo(size * 0.8, -size * 0.6, size * 0.8, size * 0.6, 0, size);
        ctx.bezierCurveTo(-size * 0.8, size * 0.6, -size * 0.8, -size * 0.6, 0, -size);
        ctx.fill();
        ctx.restore();
    }


    addCursorParticle(x, y) {
        this.cursorParticles.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            size: Math.random() * 8 + 6,
            life: 1.0,
            decay: Math.random() * 0.03 + 0.02,
            speedY: -(Math.random() * 1.2 + 0.5),
            speedX: (Math.random() - 0.5) * 1.5,
            color: ['#ff4d79', '#ff9a9e', '#fecfef', '#a1c4fd'][Math.floor(Math.random() * 4)],
            isHeart: Math.random() > 0.5
        });
    }

    // Launch celebratory confetti cannon
    launchConfetti(originX = this.width / 2, originY = this.height * 0.6, count = 120) {
        const colors = ['#ff3366', '#ff758c', '#ffd166', '#06d6a0', '#118ab2', '#e056fd', '#ffffff', '#ff9f43'];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI / 180) * (Math.random() * 140 - 160); // upward fan
            const speed = Math.random() * 14 + 6;
            this.confetti.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 5,
                vy: Math.sin(angle) * speed,
                gravity: 0.28,
                drag: 0.985,
                size: Math.random() * 9 + 6,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 14,
                wobble: Math.random() * Math.PI * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1.0,
                isHeart: Math.random() > 0.6
            });
        }
    }

    // Launch Fireworks
    launchFirework(targetX, targetY) {
        const startX = targetX + (Math.random() - 0.5) * 100;
        const startY = this.height + 20;
        this.fireworks.push({
            x: startX,
            y: startY,
            targetX: targetX,
            targetY: targetY,
            speed: 12,
            angle: Math.atan2(targetY - startY, targetX - startX),
            color: ['#ff4d79', '#f368e0', '#ffd32a', '#0be881', '#4bcffa'][Math.floor(Math.random() * 5)],
            trail: [],
            exploded: false
        });
    }

    explodeFirework(x, y, baseColor) {
        const particleCount = 70;
        const colors = [baseColor, '#ffffff', '#ffd166', '#ff9ff3'];
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            this.confetti.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 0.12,
                drag: 0.96,
                size: Math.random() * 4 + 2,
                rotation: 0,
                rotSpeed: 0,
                wobble: 0,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1.0,
                decay: Math.random() * 0.02 + 0.015,
                isSpark: true
            });
        }
    }

    // Launch Shooting Star for Wish
    launchShootingStar() {
        const startX = Math.random() * (this.width * 0.6);
        const startY = Math.random() * (this.height * 0.3);
        const length = Math.random() * 300 + 250;
        this.shootingStars.push({
            x: startX,
            y: startY,
            vx: 18,
            vy: 8,
            len: length,
            alpha: 1.0,
            trail: []
        });
    }

    // Helper: Draw heart shape on canvas
    drawHeart(ctx, x, y, size, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        // bottom left curve
        ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size * 0.9, 0, size);
        // bottom right curve
        ctx.bezierCurveTo(0, size * 0.9, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
        // top right curve
        ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 1. Draw Background Canvas (Stars & Ambient Floating Hearts)
        this.bgCtx.clearRect(0, 0, this.width, this.height);

        // Render Stars
        this.stars.forEach(star => {
            star.alpha += Math.sin(Date.now() * star.twinkleSpeed) * 0.015;
            const a = Math.max(0.1, Math.min(0.9, star.alpha));
            this.bgCtx.save();
            this.bgCtx.globalAlpha = a;
            this.bgCtx.fillStyle = star.color;
            this.bgCtx.beginPath();
            this.bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.bgCtx.fill();
            this.bgCtx.restore();
        });

        // Render Shooting Stars
        for (let i = this.shootingStars.length - 1; i >= 0; i--) {
            const ss = this.shootingStars[i];
            ss.x += ss.vx;
            ss.y += ss.vy;
            ss.alpha -= 0.016;

            if (ss.alpha <= 0) {
                this.shootingStars.splice(i, 1);
                continue;
            }

            this.bgCtx.save();
            this.bgCtx.globalAlpha = ss.alpha;
            const grad = this.bgCtx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 12, ss.y - ss.vy * 12);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#ffeaa7');
            grad.addColorStop(1, 'transparent');
            this.bgCtx.strokeStyle = grad;
            this.bgCtx.lineWidth = 3;
            this.bgCtx.beginPath();
            this.bgCtx.moveTo(ss.x, ss.y);
            this.bgCtx.lineTo(ss.x - ss.vx * 12, ss.y - ss.vy * 12);
            this.bgCtx.stroke();
            this.bgCtx.restore();
        }

        // Render Ambient Hearts
        this.ambientHearts.forEach(heart => {
            heart.y += heart.speedY;
            heart.wobble += heart.wobbleSpeed;
            heart.x += Math.sin(heart.wobble) * 0.8 + heart.speedX;

            if (heart.y < -30) {
                heart.y = this.height + 20;
                heart.x = Math.random() * this.width;
            }
            this.drawHeart(this.bgCtx, heart.x, heart.y, heart.size, heart.color, heart.alpha);
        });

        // Render Falling Rose Petals
        if (this.rosePetals) {
            this.rosePetals.forEach(petal => {
                petal.y += petal.speedY;
                petal.wobble += petal.wobbleSpeed;
                petal.x += Math.sin(petal.wobble) * 0.9 + petal.speedX;
                petal.rotation += petal.rotSpeed;

                if (petal.y > this.height + 30) {
                    petal.y = -20;
                    petal.x = Math.random() * this.width;
                }
                this.drawRosePetal(this.bgCtx, petal.x, petal.y, petal.size, petal.rotation, petal.color, petal.alpha);
            });
        }

        // Render Floating Kiss and Love Emojis (Empty Space Fillers)
        if (this.floatingEmojis) {
            this.floatingEmojis.forEach(item => {
                item.y += item.speedY;
                item.wobble += item.wobbleSpeed;
                item.x += Math.sin(item.wobble) * 0.8 + item.speedX;

                if (item.y < -40) {
                    item.y = this.height + 30;
                    item.x = Math.random() * this.width;
                }

                this.bgCtx.save();
                this.bgCtx.globalAlpha = item.alpha;
                this.bgCtx.font = `${item.size}px sans-serif`;
                this.bgCtx.textAlign = 'center';
                this.bgCtx.textBaseline = 'middle';
                this.bgCtx.fillText(item.emoji, item.x, item.y);
                this.bgCtx.restore();
            });
        }



        // 2. Draw FX Canvas (Cursor particles, Fireworks, Confetti)
        this.fxCtx.clearRect(0, 0, this.width, this.height);

        // Cursor particles
        for (let i = this.cursorParticles.length - 1; i >= 0; i--) {
            const p = this.cursorParticles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.decay;

            if (p.life <= 0) {
                this.cursorParticles.splice(i, 1);
                continue;
            }

            if (p.isHeart) {
                this.drawHeart(this.fxCtx, p.x, p.y, p.size * p.life, p.color, p.life);
            } else {
                this.fxCtx.save();
                this.fxCtx.globalAlpha = p.life;
                this.fxCtx.fillStyle = p.color;
                this.fxCtx.beginPath();
                this.fxCtx.arc(p.x, p.y, p.size * 0.4 * p.life, 0, Math.PI * 2);
                this.fxCtx.fill();
                this.fxCtx.restore();
            }
        }

        // Fireworks rockets
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const fw = this.fireworks[i];
            const dist = Math.hypot(fw.targetX - fw.x, fw.targetY - fw.y);

            if (dist < 15 || fw.y <= fw.targetY) {
                this.explodeFirework(fw.x, fw.y, fw.color);
                this.fireworks.splice(i, 1);
                continue;
            }

            fw.x += Math.cos(fw.angle) * fw.speed;
            fw.y += Math.sin(fw.angle) * fw.speed;

            this.fxCtx.save();
            this.fxCtx.fillStyle = fw.color;
            this.fxCtx.beginPath();
            this.fxCtx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
            this.fxCtx.fill();
            this.fxCtx.restore();
        }

        // Confetti & Sparks
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            const c = this.confetti[i];
            c.vx *= c.drag;
            c.vy = c.vy * c.drag + c.gravity;
            c.x += c.vx;
            c.y += c.vy;
            c.rotation += c.rotSpeed;

            if (c.decay) {
                c.alpha -= c.decay;
            } else if (c.y > this.height - 30) {
                c.alpha -= 0.02;
            }

            if (c.alpha <= 0 || c.y > this.height + 40) {
                this.confetti.splice(i, 1);
                continue;
            }

            this.fxCtx.save();
            this.fxCtx.translate(c.x, c.y);
            this.fxCtx.rotate((c.rotation * Math.PI) / 180);
            this.fxCtx.globalAlpha = Math.max(0, c.alpha);
            this.fxCtx.fillStyle = c.color;

            if (c.isSpark) {
                this.fxCtx.beginPath();
                this.fxCtx.arc(0, 0, c.size, 0, Math.PI * 2);
                this.fxCtx.fill();
            } else if (c.isHeart) {
                this.drawHeart(this.fxCtx, -c.size / 2, -c.size / 2, c.size, c.color, c.alpha);
            } else {
                this.fxCtx.fillRect(-c.size / 2, -c.size / 3, c.size, c.size * 0.6);
            }
            this.fxCtx.restore();
        }
    }
}

// Global particle instance
let particleEngine = null;
window.addEventListener('DOMContentLoaded', () => {
    particleEngine = new ParticleEngine();
});
