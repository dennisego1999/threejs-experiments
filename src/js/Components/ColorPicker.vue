<script setup>
import { ref, watch } from 'vue';

// Define emits
const emit = defineEmits(['update:modelValue']);

// Define props
const props = defineProps({
	modelValue: String
});

// Set variables
const color = ref(props.modelValue);

// Define functions
function updateColor() {
	emit('update:modelValue', color.value);
}

// Watch
watch(
	() => props.modelValue,
	(value) => {
		color.value = value;
	}
);
</script>

<template>
	<div class="flex items-center gap-2">
		<input
			type="color"
			v-model="color"
			@input="updateColor"
			class="h-12 w-12 cursor-pointer rounded-md border-none p-0"
		/>

		<input type="text" v-model="color" @input="updateColor" class="w-28 rounded-md border border-gray-300 p-2" />
	</div>
</template>
