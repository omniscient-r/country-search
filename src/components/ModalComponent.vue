<template>
  <transition name="modal-animation">
    <div v-show="modalActive" class="flex justify-center h-screen md:w-screen w-full fixed top-0 left-0 bg-brand-transparent items-center z-50 mx-auto">
    <div
      
      class="modal flex justify-center h-screen md:w-screen w-11/12 fixed bg-brand-transparent items-center z-50"
      :class="{
        'justify-end': positionModal === 'right',
        'justify-center': positionModal === 'center',
        'justify-start': positionModal === 'left',
        '!justify-center': isMobile,
      }"
      @click="handleModal"
      data-type="modal"
    >
      <transition :name="isMobile ? 'bottom_mobile' : animationType">
        <div
          v-show="modalActive"
          class="modal-inner shadow-xl p-7 relative bg-white dark:bg-gray-700 w-[720px] overflow-auto rounded-lg"
          :class="[
            modalCustomClass,
            {
              '!w-full !h-fit !absolute !left-0 rounded-md':
                isMobile,
            },
          ]"
        >
          <CloseIcon @click="close" class="absolute right-0 top-0 p-3 text-white text-4xl" />
          <!-- Modal Content -->
          <slot />
        </div>
      </transition>
    </div></div>
  </transition>
</template>

<script setup>
import { onMounted, watch, nextTick, ref, computed } from "vue";
import CloseIcon from "@/icons/CloseIcon.vue";

const props = defineProps({
  // State for modal
  modalActive: Boolean,
  // Animation Type is the type of animation that you want
  // Have 5 options:
  // center: animation in center with scale
  // right: Animation translate in right side
  // left: Animation translate in left side
  // top: Animation translate from top
  // bottom: Animation translate from bottom
  animationType: String,

  // Position of Modal Dialog, 3 option:
  // Center - Right - Left
  positionModal: String,

  // Custom clases for modal
  modalCustomClass: String,
});

const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => (windowWidth.value > 768 ? false : true));
// We leave emit close open for the parent to read.
const emit = defineEmits(["close"]);

// Function that executes the emit
const close = () => emit("close");

// Function to see when the modal layout is clicked and close it
const handleModal = (e) => (e.target.dataset.type == "modal" ? close() : false);

onMounted(() => {
  // Listener to close the modal if we click ESC
  window.addEventListener("keyup", function (event) {
    if (props.modalActive) {
      event.key === "Escape" ? close() : false;
    }
  });
  window.addEventListener("resize", () => {
    watchSize();
  });
});

const watchSize = async () => {
  await nextTick();
  windowWidth.value = window.innerWidth;
};
watch(
  () => props.modalActive,
  () => document.body.classList.toggle("overflow-hidden")
);
</script>

<style lang="scss" scoped>
// MODAL & Animation
.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.15s linear;
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

// Animations
// Center:
.center-enter-active {
  transition: all 0.15s linear;
}

.center-leave-active {
  transition: all 0.15s linear;
}

.center-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.center-leave-to {
  transform: scale(0.8);
}
// Right:
.right-enter-active {
  transition: all 0.15s linear;
}

.right-leave-active {
  transition: all 0.15s linear;
}

.right-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.right-leave-to {
  transform: translateX(100%);
}

// Left
.left-enter-active {
  transition: all 0.15s linear;
}

.left-leave-active {
  transition: all 0.15s linear;
}

.left-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.left-leave-to {
  transform: translateX(-100%);
}

// From Top
.top-enter-active {
  transition: all 0.3s linear;
}

.top-leave-active {
  transition: all 0.3s linear;
}

.top-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.top-leave-to {
  transform: translateY(-100%);
}

// From Bottom
.bottom-enter-active {
  transition: all 0.3s linear;
}

.bottom-leave-active {
  transition: all 0.3s linear;
}

.bottom-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.bottom-leave-to {
  transform: translateY(100%);
}

// From Bottom
.bottom-enter-active {
  transition: all 0.3s linear;
}

.bottom-leave-active {
  transition: all 0.3s linear;
}

.bottom-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.bottom-leave-to {
  transform: translateY(100%);
}

// From Bottom Mobile
.bottom_mobile-enter-active {
  transition: all 0.5s ease;
}

.bottom_mobile-leave-active {
  transition: all 0.5s ease;
}

.bottom_mobile-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.bottom_mobile-leave-to {
  transform: translateY(100%);
}
</style>
