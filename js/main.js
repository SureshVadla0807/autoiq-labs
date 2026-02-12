// Three.js Animation Variables
let scene, camera, renderer, nodeStructure, time = 0;

// Initialize Three.js 3D Animation
// Initialize Three.js 3D Animation
function initThree() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = ''; // Clear existing
    container.appendChild(renderer.domElement);

    // Create Neural Network Mesh
    const particleCount = 100;
    const group = new THREE.Group();
    scene.add(group);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 400 - 200;
        const y = Math.random() * 400 - 200;
        const z = Math.random() * 400 - 200;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        particleData.push({
            velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2),
            numConnections: 0
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material for dots
    const pMaterial = new THREE.PointsMaterial({
        color: 0x00C2FF,
        size: 3,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
    });

    const particles = new THREE.Points(geometry, pMaterial);
    group.add(particles);

    // Lines geometry
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xB026FF,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.5;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.5;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // Animation variables
    const r = 400;
    const rHalf = r / 2;

    function animate() {
        requestAnimationFrame(animate);

        group.rotation.y += 0.002;
        group.rotation.x += 0.001;

        // Mouse interaction tilt
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Update positions
        const positions = particles.geometry.attributes.position.array;
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        // Reset line positions
        const linePositions = [];
        // const lineColors = [];

        for (let i = 0; i < particleCount; i++) {
            particleData[i].numConnections = 0;

            // Get particle position
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];

            // Update position
            particleData[i].velocity.x;
            particleData[i].velocity.y;
            particleData[i].velocity.z;

            // We keep them static relative to each other for this specific visual style 
            // to maintain the "brain/cloud" shape, just rotating the group involves motion.
            // If we wanted individual motion we'd update positions here.

            // Check connections
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 90) { // Connection distance
                    particleData[i].numConnections++;
                    particleData[j].numConnections++;

                    // Add line
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }

        lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

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

caseObserver.observe(document.querySelector('.case-study'));

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

// Spotlight Effect
document.querySelectorAll('.service-card, .industry-card').forEach(card => {
    // Add spotlight element
    const spotlight = document.createElement('div');
    spotlight.classList.add('spotlight');
    card.appendChild(spotlight);

    // Track mouse movement
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Particle Background System
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Mouse tracking
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Resize handler
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        update() {
            // Mouse interaction
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = mouse.radius;
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * this.density;
                    const directionY = forceDirectionY * force * this.density;

                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }
            }

            // Normal movement
            this.x += this.vx;
            this.y += this.vy;

            // Screen wrap
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 194, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();

            // Connect particles
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 194, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });

            // Connect to mouse
            if (mouse.x != null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 194, 255, ${0.2 * (1 - distance / mouse.radius)})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize Three.js animation
initThree();
initParticles();

// Advanced Visual Effects

// 1. Typing Animation
function typeWriterEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;

    const text = heroTitle.innerHTML; // Keep HTML like <br>
    heroTitle.innerHTML = '';
    heroTitle.classList.add('typing-cursor');

    let i = 0;
    // We need to handle HTML tags differently to not break them
    // Simple approach: Strip tags for typing, or use a library.
    // Manual approach:
    const originalText = "Enterprise Automation.<br>Engineered for Scale.";
    heroTitle.innerHTML = "";

    // Split by <br> to handle line break
    const lines = originalText.split('<br>');
    let lineIndex = 0;
    let charIndex = 0;

    function type() {
        if (lineIndex < lines.length) {
            if (charIndex < lines[lineIndex].length) {
                heroTitle.innerHTML += lines[lineIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, 50);
            } else {
                if (lineIndex < lines.length - 1) {
                    heroTitle.innerHTML += "<br>";
                }
                lineIndex++;
                charIndex = 0;
                setTimeout(type, 50);
            }
        } else {
            heroTitle.classList.remove('typing-cursor');
        }
    }

    // Clear initial content then type
    setTimeout(type, 500);
}

// 2. Magnetic Buttons
document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// 3. Scroll Reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal-on-scroll');
    revealObserver.observe(section);
});

// Initialize Effects
document.addEventListener('DOMContentLoaded', () => {
    typeWriterEffect();
});
