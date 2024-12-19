<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import Scene from '@/Classes/Scene.js';

// Life cycles
onMounted(() => {
	// Initiate scene
	Scene.init('scene-canvas');

	// Add event listeners
	window.addEventListener('resize', Scene.resize.bind(Scene));
});

onBeforeUnmount(() => {
	// Destroy scene
	Scene.destroy();

	// Remove event listeners
	window.removeEventListener('resize', Scene.resize.bind(Scene));
});
</script>

<template>
	<canvas id="scene-canvas" class="h-[100dvh] w-screen" />
</template>
