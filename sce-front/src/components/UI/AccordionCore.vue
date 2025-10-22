<script setup>
	import { ref, defineProps } from "vue";
	import AccordionItem from "./AccordionItem.vue";

	const props = defineProps({
		items: {
			type: Array,
			required: true,
		},
	});

	const activeIndex = ref(null);

	const toggleItem = (index) => {
		activeIndex.value = activeIndex.value === index ? null : index;
	};
</script>

<template>
	<div class="accordion-wrapper">
		<AccordionItem
			v-for="(item, index) in props.items"
			:key="index"
			:title="item.title"
			:content="item.content"
			:isOpen="activeIndex === index"
			@toggle="toggleItem(index)"
			:tipoId="item.tipoId" 
		/>
	</div>
</template>

<style scoped>
	.accordion-wrapper {
		margin-top: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		z-index: 10;
		min-width: 300px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
</style>