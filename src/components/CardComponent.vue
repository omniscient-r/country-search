<template>
  <div class="grid grid-cols-4 gap-3">
    <div v-for="(page, index) in content" :key="index" class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <img :src="page.flags.svg" :alt="page.flags.alt" width="400" height="400" class="object-cover" />
        <div>
            <h2 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {{ page.name.common }}
            </h2>
            <h3 class="text-black">
              {{ page.capital }}
            </h3>
        </div>
        <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">Go to this step by step guideline process on how to certify for your weekly benefits:</p>
        <a href="#" class="inline-flex font-medium items-center text-blue-600 hover:underline">
            See our guideline
            <svg class="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
            </svg>
        </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  content: {
    type: Array,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: false,
  },
  cardAnimation: {
    type: Boolean,
    default: false,
  }
});


const isMobileView = ref(false);
const cardReff = ref(props.cardRef);

const checkElementVisibility = (elementRef, animationRef) => {
  if (elementRef.value) {
    const elementRect = elementRef.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate the distance from the bottom of the element to the bottom of the viewport
    const distanceFromBottom = windowHeight - elementRect.bottom;

    // Calculate the distance from the top of the element to the top of the viewport
    const distanceFromTop = elementRect.top;

    // Adjust the threshold as needed --> using "&& distanceFromTop >= 0" will guarantee that the content gets the animation in both directions
    animationRef.value = distanceFromBottom >= 0;
  }
};

const handleScroll = () => {
  checkElementVisibility(cardReff, props.cardAnimation);
  isMobileView.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>