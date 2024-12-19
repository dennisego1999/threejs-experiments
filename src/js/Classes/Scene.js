import { AmbientLight, BoxGeometry, Color, Mesh, MeshStandardMaterial, SpotLight } from 'three';
import ThreeManager from '@/Classes/ThreeManager.js';

class Scene extends ThreeManager {
	constructor() {
		super();

		this.object = null;
		this.objectMaterial = null;
	}

	init(canvasId) {
		// Initiate three.js
		this.initThree(canvasId);

		// Set render action
		this.setRenderAction(() => {
			/**
			 * TODO:
			 * Define render actions in this callback
			 */
		});

		// Setup scene
		this.setupScene();

		// Start render loop
		this.animate();
	}

	setupScene() {
		// Add box to scene
		const geometry = new BoxGeometry(1, 1, 1);
		this.objectMaterial = new MeshStandardMaterial({ color: 0xa63744, roughness: 0.5 });
		this.object = new Mesh(geometry, this.objectMaterial);
		this.object.castShadow = true;
		this.object.receiveShadow = true;
		this.scene.add(this.object);

		// Add ambient light
		const ambientLight = new AmbientLight(0xffffff, 1); // Soft white light
		this.scene.add(ambientLight);

		// Add spotlight
		const spotLight = new SpotLight(0xffffff, 100); // Bright white light
		spotLight.position.set(5, 10, 5);
		spotLight.castShadow = true;
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;
		spotLight.shadow.camera.near = 0.5;
		spotLight.shadow.camera.far = 50;
		spotLight.target = this.object;
		this.scene.add(spotLight);

		// Set scene background color
		this.scene.background = new Color(0x333333);
	}

	changeObjectColor(color) {
		// Update color of object material
		this.objectMaterial.color = new Color(color);
	}
}

export default new Scene();
