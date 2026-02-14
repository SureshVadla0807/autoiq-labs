// Three.js Animation Variables
let scene, camera, renderer, nodeStructure, time = 0;

// Initialize Three.js 3D Animation
// Initialize Three.js 3D Animation
// Initialize Three.js 3D Animation
// Initialize Three.js 3D Animation
// Initialize Three.js 3D Animation
// Initialize Three.js 3D Animation
// Initialize Three.js 3D Animation
function initThree() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.z = 600;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Hex Shield (Wireframe Sphere) - Scaled UP
    const geometry = new THREE.IcosahedronGeometry(180, 2); // Increased Radius
    const material = new THREE.MeshBasicMaterial({
        color: 0x00C2FF,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    const shield = new THREE.Mesh(geometry, material);
    group.add(shield);

    // 1b. Vertex Particles (New Layer)
    // Add glowing dots at every vertex of the shield for extra density
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00C2FF,
        size: 3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const shieldParticles = new THREE.Points(geometry, particleMaterial);
    group.add(shieldParticles);

    // 2. Inner Reactor Core - Scaled UP
    const coreGeometry = new THREE.IcosahedronGeometry(100, 4); // Increased Radius
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xB026FF,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // Solid Core Glow - Scaled UP
    const glowGeometry = new THREE.SphereGeometry(80, 32, 32); // Increased Radius
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00C2FF,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);

    // 3. Orbiting Satellites - Increased Count
    const satGeometry = new THREE.BoxGeometry(8, 8, 8); // Slightly smaller for swarm look
    const satMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const satellites = [];

    // Increased from 6 to 20
    for (let i = 0; i < 20; i++) {
        const sat = new THREE.Mesh(satGeometry, satMaterial);
        const satGroup = new THREE.Group(); // Pivot for orbit
        satGroup.add(sat);

        // Push them further out due to larger shield
        sat.position.x = 220 + Math.random() * 60;
        satGroup.rotation.x = Math.random() * Math.PI;
        satGroup.rotation.y = Math.random() * Math.PI;

        group.add(satGroup);
        satellites.push({ mesh: sat, pivot: satGroup, speed: 0.005 + Math.random() * 0.015 });
    }

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    });

    // Use ResizeObserver for accurate sizing
    const resizeObserver = new ResizeObserver(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    function animate() {
        requestAnimationFrame(animate);

        // Rotate Shield & Particles
        shield.rotation.y += 0.002;
        shield.rotation.x -= 0.001;
        shieldParticles.rotation.copy(shield.rotation); // Sync particles with shield

        // Rotate Core (Faster)
        core.rotation.y -= 0.01;
        core.rotation.z += 0.01;

        // Orbit Satellites
        satellites.forEach(sat => {
            sat.pivot.rotation.y += sat.speed;
            sat.mesh.rotation.x += 0.02; // Spin the satellite itself
        });

        // Mouse tilt
        group.rotation.x += (mouseY - group.rotation.x) * 0.05;
        group.rotation.y += (mouseX - group.rotation.y) * 0.05;

        // Pulse Core
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
        core.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }

    animate();
}

// Page transition navigation
function navigateToPage(e, url) {
    e.preventDefault();
    const transition = document.getElementById('pageTransition');
    transition.classList.add('active');
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Case study animation observer
const caseObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelector('.comparison-fill.before').style.width = '100%';
            document.querySelector('.comparison-fill.after').style.width = '28%';
            caseObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const caseStudyElement = document.querySelector('.case-study');
if (caseStudyElement) {
    caseObserver.observe(caseStudyElement);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
    });
});

// Timeline scroll animation
function animateTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const timelineSteps = document.querySelectorAll('.timeline-step');
    const totalSteps = timelineSteps.length;

    // Get timeline position
    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top;
    const timelineHeight = timelineRect.height;
    const windowHeight = window.innerHeight;

    // Calculate scroll progress through timeline
    // Extended range for slower, more gradual animation
    const scrollStart = windowHeight * 0.85; // Start when 85% down viewport
    const scrollEnd = -timelineHeight * 0.5; // End when timeline is halfway past top

    let progress = 0;

    if (timelineTop < scrollStart && timelineTop > scrollEnd) {
        // Timeline is in the active scroll zone
        progress = (scrollStart - timelineTop) / (scrollStart - scrollEnd);
        progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
    } else if (timelineTop <= scrollEnd) {
        // Timeline has scrolled past, show all steps
        progress = 1;
    }

    // Calculate which steps should be active
    const activeStepCount = Math.ceil(progress * totalSteps);

    // Update each step
    timelineSteps.forEach((step, index) => {
        if (index < activeStepCount) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update progress bar width
    // Progress bar goes from 5% to 95% (matching timeline::before left/right)
    const progressBarWidth = progress * 90; // 90% is the total width (95% - 5%)
    timeline.style.setProperty('--progress-width', `${progressBarWidth}%`);

    // Apply the progress bar width using ::after pseudo-element
    const style = document.createElement('style');
    style.textContent = `.timeline::after { width: ${progressBarWidth}% !important; }`;

    // Remove old style if exists
    const oldStyle = document.getElementById('timeline-progress-style');
    if (oldStyle) oldStyle.remove();

    style.id = 'timeline-progress-style';
    document.head.appendChild(style);
}

// Parallax Scroll Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const hero3d = document.querySelector('.hero-3d');

    if (hero && heroContent && hero3d) {
        heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
        hero3d.style.transform = `translateY(${scrolled * 0.2}px)`;
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});

// Listen for scroll events
window.addEventListener('scroll', animateTimeline);
window.addEventListener('resize', animateTimeline);

// Initial check
animateTimeline();

// Holographic Code Moved to DOMContentLoaded

// Particle Background System
// Particle Background System
function initParticles() {
    // Create canvas if it doesn't exist
    let canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    let particles = [];

    // Mouse tracking
    let mouse = {
        x: null,
        y: null,
        radius: 150
    }

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Resize
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        init();
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.dx = (Math.random() - 0.5) * 0.2; // Slower speed
            this.dy = (Math.random() - 0.5) * 0.2;
            this.size = (Math.random() * 2) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(100, 200, 255, 0.3)'; // Subtle cyan/white
            ctx.fill();
        }

        update() {
            if (this.x > width || this.x < 0) {
                this.dx = -this.dx;
            }
            if (this.y > height || this.y < 0) {
                this.dy = -this.dy;
            }

            // Mouse interaction (Gentle repel)
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    if (mouse.x < this.x && this.x < width - 10) {
                        this.x += 2;
                    }
                    if (mouse.x > this.x && this.x > 10) {
                        this.x -= 2;
                    }
                    if (mouse.y < this.y && this.y < height - 10) {
                        this.y += 2;
                    }
                    if (mouse.y > this.y && this.y > 10) {
                        this.y -= 2;
                    }
                }
            }

            this.x += this.dx;
            this.y += this.dy;
            this.draw();
        }
    }

    function init() {
        particles = [];
        let numberOfParticles = (width * height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }

        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                    + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

                if (distance < (width / 7) * (height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(100, 200, 255,' + (opacityValue * 0.1) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    init();
    animate();
}

// Initialize everything on load
// Contact Form Submission Handler
async function initContactForm() {
    const form = document.getElementById('consultationForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Collect form data
        const formData = new FormData(form);

        // Add Web3Forms access key
        formData.append('access_key', 'caddfb3d-ee23-40f0-9cf3-a9d841b8ddc9');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert('Thank you! Your message has been sent successfully.');
                form.reset();
            } else {
                console.error('Form submission error:', result);
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error.message);
            alert('Something went wrong. Please try again later.');
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
    // 5. Contact Form
    initContactForm();

    // 1. Three.js Animation
    try {
        if (typeof THREE !== 'undefined' && typeof initThree === 'function') {
            initThree();
        } else {
            console.warn('Three.js not loaded or initThree not defined');
        }
    } catch (e) {
        console.error('Three.js init failed:', e);
    }

    // 2. Particles
    try {
        if (typeof initParticles === 'function') {
            initParticles();
        }
    } catch (e) {
        console.error('Particles init failed:', e);
    }

    // 3. UI Effects
    try {
        if (typeof typeWriterEffect === 'function') typeWriterEffect();

        // 4. Floating HUD Navbar
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (nav) {
                if (window.scrollY > 50) {
                    nav.classList.add('nav-floating');
                } else {
                    nav.classList.remove('nav-floating');
                }
            }
        });

        // Holographic cards
        document.querySelectorAll('.service-card, .industry-card').forEach(card => {
            const spotlight = document.createElement('div');
            spotlight.classList.add('spotlight');
            card.appendChild(spotlight);

            const scanLine = document.createElement('div');
            scanLine.classList.add('scan-line');
            card.appendChild(scanLine);

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });

        // Terminal Footer
        if (typeof initTerminalFooter === 'function') initTerminalFooter();
        else {
            // Inline fallback if function definition was lost in refactor
            const timeDisplay = document.getElementById('utc-time');
            if (timeDisplay) {
                setInterval(() => {
                    const now = new Date();
                    timeDisplay.textContent = now.toISOString().split('T')[1].split('.')[0];
                }, 1000);
            }
        }

        // Custom Cursor
        if (typeof initCustomCursor === 'function') initCustomCursor();
        else {
            // Inline fallback
            const cursorDot = document.querySelector('.cursor-dot');
            const cursorReticle = document.querySelector('.cursor-reticle');

            if (cursorDot && cursorReticle) {
                let mouseX = 0, mouseY = 0, reticleX = 0, reticleY = 0;
                document.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    cursorDot.style.left = `${mouseX}px`;
                    cursorDot.style.top = `${mouseY}px`;
                });

                function animateReticle() {
                    reticleX += (mouseX - reticleX) * 0.15;
                    reticleY += (mouseY - reticleY) * 0.15;
                    cursorReticle.style.left = `${reticleX}px`;
                    cursorReticle.style.top = `${reticleY}px`;
                    requestAnimationFrame(animateReticle);
                }
                animateReticle();

                // Interactive elements hover
                document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
                    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
                });

                document.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
                document.addEventListener('mouseup', () => document.body.classList.remove('cursor-active'));
            }
        }

    } catch (e) {
        console.error('UI Effects init failed:', e);
    }
});
