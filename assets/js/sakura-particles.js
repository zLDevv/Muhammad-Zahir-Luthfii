// Global sakura instance - persists across page loads
let globalSakuraInstance = null;
let animationFrameId = null;

class SakuraParticle {
  constructor() {
    this.particles = [];
    
    // Check if canvas already exists
    let existingCanvas = document.getElementById('sakura-canvas');
    if (existingCanvas) {
      this.canvas = existingCanvas;
      this.ctx = this.canvas.getContext('2d');
      this.isActive = true;
      this.continueAnimation();
      return;
    }

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'sakura-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.isActive = true;
    
    this.setupCanvas();
    this.startAnimation();
    this.setupPageLeaveListener();
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '2';
    document.body.appendChild(this.canvas);

    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setupPageLeaveListener() {
    window.addEventListener('beforeunload', () => {
      this.isActive = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });

    document.addEventListener('visibilitychange', () => {
      this.isActive = !document.hidden;
    });
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: -10,
      size: Math.random() * 15 + 10,
      speedY: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.08,
      opacity: Math.random() * 0.6 + 0.4,
      color: `hsl(${340 + Math.random() * 20}, 100%, ${60 + Math.random() * 20}%)`,
      life: 1,
      maxLife: 1
    };
  }

  drawParticle(particle) {
    this.ctx.save();
    this.ctx.globalAlpha = particle.opacity * particle.life;
    this.ctx.fillStyle = particle.color;
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation);
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, -particle.size / 2);
    this.ctx.quadraticCurveTo(-particle.size / 2, 0, 0, particle.size / 2);
    this.ctx.quadraticCurveTo(particle.size / 2, 0, 0, -particle.size / 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;
      p.life -= 0.001;

      if (p.y > this.canvas.height || p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.isActive && this.particles.length < 150) {
      this.particles.push(this.createParticle());
    }

    this.updateParticles();
    this.particles.forEach(p => this.drawParticle(p));

    animationFrameId = requestAnimationFrame(() => this.animate());
  }

  startAnimation() {
    this.animate();
  }

  continueAnimation() {
    this.animate();
  }
}

function initSakura() {
  if (!globalSakuraInstance) {
    globalSakuraInstance = new SakuraParticle();
  } else {
    globalSakuraInstance = new SakuraParticle();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSakura);
} else {
  initSakura();
}