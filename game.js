let scene, camera, renderer, ball, platforms, stars, clock, scoreElement;
const platformCount = 5;
const platformSpeed = 0.05;
const ballSpeed = 2;
const gravity = 4.9; // Reduced gravity for slower falling
const bounceVelocity = Math.sqrt(2 * gravity * (window.innerHeight / 3 / 100)); // Velocity for a third of the screen height
const starCount = 50;

let moveLeft = false;
let moveRight = false;
let ballVelocityY = 0; // Vertical velocity of the ball
let score = 0;
let gameStarted = false;

function startGame() {
    document.getElementById('splash-screen').style.display = 'none';
    gameStarted = true;
    init();
    animate();
}

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create ball
    const geometry = new THREE.SphereGeometry(0.2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    ball = new THREE.Mesh(geometry, material);
    ball.position.y = 5.0;
    scene.add(ball);

    // Create platforms
    platforms = [];
    for (let i = 0; i < platformCount; i++) {
        const platformGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.x = (Math.random() - 0.5) * 10;
        platform.position.y = (i + 1) * -1.5;
        platform.dx = (Math.random() - 0.5) * platformSpeed;
        scene.add(platform);
        platforms.push(platform);
    }

    // Create stars
    stars = [];
    for (let i = 0; i < starCount; i++) {
        const starGeometry = new THREE.SphereGeometry(0.05, 12, 12);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.x = (Math.random() - 0.5) * 20;
        star.position.y = (Math.random() - 0.5) * 20;
        star.position.z = (Math.random() - 0.5) * 20;
        scene.add(star);
        stars.push(star);
    }

    // Create clock for animation
    clock = new THREE.Clock();

    // Get score element
    scoreElement = document.getElementById('score');

    // Add event listeners for keyboard controls
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    // Debugging logs
    console.log('Scene:', scene);
    console.log('Camera:', camera);
    console.log('Renderer:', renderer);
    console.log('Ball:', ball);
    console.log('Platforms:', platforms);
    console.log('Stars:', stars);
}

function onKeyDown(event) {
    if (event.key === 'ArrowLeft') moveLeft = true;
    if (event.key === 'ArrowRight') moveRight = true;
}

function onKeyUp(event) {
    if (event.key === 'ArrowLeft') moveLeft = false;
    if (event.key === 'ArrowRight') moveRight = false;
}

function animate() {
    if (!gameStarted) return;
    
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Apply gravity to the ball
    ballVelocityY -= gravity * delta;

    // Move ball
    if (moveLeft) ball.position.x -= ballSpeed * delta;
    if (moveRight) ball.position.x += ballSpeed * delta;
    ball.position.y += ballVelocityY * delta;

    // Move platforms
    platforms.forEach(platform => {
        platform.position.x += platform.dx;
        if (platform.position.x > 5 || platform.position.x < -5) {
            platform.dx = -platform.dx;
        }

        // Check for collision with the ball
        if (
            ball.position.x > platform.position.x - 0.5 &&
            ball.position.x < platform.position.x + 0.5 &&
            ball.position.y < platform.position.y + 0.1 &&
            ball.position.y > platform.position.y - 0.1 &&
            ballVelocityY <= 0 // Ensure the ball is falling downwards when checking for collision
        ) {
            ballVelocityY = bounceVelocity;
            ball.position.y = platform.position.y + 0.2; // Prevent clipping through the platform
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }
    });

    // Check if the ball has fallen off the screen
    if (ball.position.y < -5) {
        alert('Game Over!');
        resetGame();
    }

    renderer.render(scene, camera);
}

function resetGame() {
    ball.position.set(0, 1.5, 0);
    ballVelocityY = 0; // Reset ball velocity
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    platforms.forEach(platform => {
        platform.position.x = (Math.random() - 0.5) * 10;
        platform.position.y = (Math.random() - 0.5) * -5;
        platform.dx = (Math.random() - 0.5) * platformSpeed;
    });
}
