import * as THREE from 'three';

const SEPARATION = 40, AMOUNTX = 130, AMOUNTY = 35;

let container;
let camera, scene, renderer;

let particles, count = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);
	if (container) {
		container.className += container.className ? ' waves' : 'waves';
	}

	camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 2000);
	camera.position.y = 350; //changes how far back you can see i.e the particles towards horizon
	camera.position.z = 50; //This is how close or far the particles are seen

	camera.rotation.x = 0.35;

	scene = new THREE.Scene();

	//

	const numParticles = AMOUNTX * AMOUNTY;

	const positions = new Float32Array(numParticles * 3);
	const scales = new Float32Array(numParticles);

	let i = 0, j = 0;

	for (let ix = 0; ix < AMOUNTX; ix++) {

		for (let iy = 0; iy < AMOUNTY; iy++) {

			positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
			positions[i + 1] = 0; // y
			positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) - 10); // z

			// scales[j] = 1;

			i += 3;
			// j++;

		}

	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

	const material = new THREE.ShaderMaterial({

		uniforms: {
			color: { value: new THREE.Color(0xc4c4c4) },
		},
		vertexShader: document.getElementById('vertexshader').textContent,
		fragmentShader: document.getElementById('fragmentshader').textContent

	});

	//

	particles = new THREE.Points(geometry, material);
	scene.add(particles);

	//

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(4);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	container.style.touchAction = 'none';


	//

	window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

	requestAnimationFrame(animate);

	render();

}

function render() {




	const positions = particles.geometry.attributes.position.array;
	const scales = particles.geometry.attributes.scale.array;

	let i = 0, j = 0;

	for (let ix = 0; ix < AMOUNTX; ix++) {

		for (let iy = 0; iy < AMOUNTY; iy++) {

			positions[i + 1] = (Math.sin((ix + count) * 0.5) * 20) +
				(Math.sin((iy + count) * 0.5) * 20);

			scales[j] = (Math.sin((ix + count) * 0.3) + 2) * 4 +
				(Math.sin((iy + count) * 0.5) + 1) * 4;

			i += 3;
			j++;

		}

	}

	particles.geometry.attributes.position.needsUpdate = true;
	particles.geometry.attributes.scale.needsUpdate = true;

	renderer.render(scene, camera);

	// This increases or decreases speed
	count += 0.2;

}