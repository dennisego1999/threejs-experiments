<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ColorPicker from '@/Components/ColorPicker.vue';
import Scene from '@/Classes/Scene.js';

// Set variables
const color = ref('#00FFFF');

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

// Watch the color
watch(
	color,
	async (value) => {
		if (!value) {
			return;
		}

		// Wait for next tick
		await nextTick();

		// Update color of object
		Scene.changeObjectColor(value);
	},
	{ immediate: true }
);
</script>

<template>
	<div class="flex h-[100dvh] w-screen items-stretch justify-center">
		<div class="relative flex-1">
			<canvas id="scene-canvas" class="relative z-0 w-full flex-1" />
		</div>

		<div class="flex flex-1 flex-col gap-2 p-4">
			<h2 class="text-2xl font-bold">Color configuration</h2>

			<p>Choose your color</p>

			<ColorPicker v-model="color" />
		</div>
	</div>
</template>
