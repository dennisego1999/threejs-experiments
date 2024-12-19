import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { Clock, PCFSoftShadowMap, PerspectiveCamera, ReinhardToneMapping, Scene, WebGLRenderer } from 'three';

export default class ThreeManager {
	constructor() {
		this.fps = 1000 / 60;
		this.then = null;
		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.canvas = null;
		this.controls = null;
		this.renderAction = null;
		this.clock = new Clock();
		this.gltfLoader = new GLTFLoader();
		this.dracoLoader = new DRACOLoader();
		this.gltfLoader.setDRACOLoader(this.dracoLoader);
	}

	init(canvasId) {
		// Get canvas
		this.canvas = document.getElementById(canvasId);

		// Setup scene
		this.scene = new Scene();

		// Setup renderer
		this.renderer = new WebGLRenderer({
			antialias: true,
			powerPreference: 'high-performance',
			canvas: this.canvas
		});

		// Set size & aspect ratio
		this.renderer.toneMapping = ReinhardToneMapping;
		this.renderer.physicallyCorrectLights = true;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = PCFSoftShadowMap;

		// Setup camera
		this.setupCamera();

		// Set scene size
		this.setSceneSize();
	}

	animate() {
		// Animate request frame loop
		const now = Date.now();
		const frameRateDelta = now - this.then;

		if (frameRateDelta > this.fps) {
			this.then = now - (frameRateDelta % this.fps);

			// Render the frame
			this.render();
		}

		// Request a new frame
		this.animateFrameId = requestAnimationFrame(this.animate.bind(this));
	}

	setRenderAction(callback) {
		if (callback) {
			// Set render action
			this.renderAction = callback;
		}
	}

	render() {
		const delta = this.clock.getDelta();
		const elapsedTime = this.clock.getElapsedTime();
		this.oldElapsedTime = elapsedTime;

		if (this.renderAction) {
			// Call render action
			this.renderAction(delta);
		}

		// Render
		this.renderer.render(this.scene, this.camera);
	}

	setupCamera() {
		// Set perspective camera
		this.camera = new PerspectiveCamera(35, this.canvas.offsetWidth / this.canvas.offsetHeight, 0.1, 1000);

		// Set camera position
		this.camera.position.set(0, 4, 10);

		// Update camera projection matrix
		this.camera.updateProjectionMatrix();

		// Add camera to scene
		this.scene.add(this.camera);
	}

	setSceneSize() {
		// Get canvas parent dimensions
		const canvasParentDimensions = this.canvas.parentNode.getBoundingClientRect();

		// Set correct aspect
		this.camera.aspect = canvasParentDimensions.width / canvasParentDimensions.height;
		this.camera.updateProjectionMatrix();

		// Set canvas size again
		this.renderer.setSize(canvasParentDimensions.width, canvasParentDimensions.height);
	}

	destroy() {
		// Cancel the animation frame
		if (this.animateFrameId) {
			cancelAnimationFrame(this.animateFrameId);
		}

		// Dispose of geometries, materials, and textures
		this.scene.traverse((object) => {
			if (!object.isMesh) return;

			// Dispose geometry
			if (object.geometry) {
				object.geometry.dispose();
			}

			// Dispose material
			if (object.material) {
				// Check if material is an array (e.g., multi-materials)
				if (Array.isArray(object.material)) {
					object.material.forEach((mat) => {
						if (mat.map) mat.map.dispose();
						if (mat.lightMap) mat.lightMap.dispose();
						if (mat.bumpMap) mat.bumpMap.dispose();
						if (mat.normalMap) mat.normalMap.dispose();
						if (mat.specularMap) mat.specularMap.dispose();
						if (mat.envMap) mat.envMap.dispose();
						if (mat.alphaMap) mat.alphaMap.dispose();
						mat.dispose();
					});
				} else {
					if (object.material.map) object.material.map.dispose();
					if (object.material.lightMap) object.material.lightMap.dispose();
					if (object.material.bumpMap) object.material.bumpMap.dispose();
					if (object.material.normalMap) object.material.normalMap.dispose();
					if (object.material.specularMap) object.material.specularMap.dispose();
					if (object.material.envMap) object.material.envMap.dispose();
					if (object.material.alphaMap) object.material.alphaMap.dispose();
					object.material.dispose();
				}
			}
		});

		// Clear the scene
		while (this.scene.children.length > 0) {
			this.scene.remove(this.scene.children[0]);
		}

		// Dispose of renderer
		if (this.renderer) {
			this.renderer.dispose();
		}
	}

	setupControls() {
		// Set controls
	}
}
