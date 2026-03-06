<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visible = ref(true)
const fadeOut = ref(false)

onMounted(() => {
  setTimeout(() => {
    fadeOut.value = true
    setTimeout(() => {
      visible.value = false
    }, 800)
  }, 2500)
})
</script>

<template>
  <div v-if="visible" class="loader-screen" :class="{ 'loader-screen--fade': fadeOut }">
    <div class="loader-content">
      <img src="/images/logo.svg" alt="Big Five Solutions" class="loader-logo" />
      <p class="loader-tagline">Laissez votre empreinte</p>
      <div class="loader-bar">
        <div class="loader-bar__fill" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: 'Century Gothic';
  src: local('Century Gothic'), local('CenturyGothic');
  font-weight: 400;
  font-style: normal;
}

.loader-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0620;
  transition: opacity 0.8s ease, visibility 0.8s ease;
}

.loader-screen--fade {
  opacity: 0;
  visibility: hidden;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  animation: loaderAppear 0.8s ease forwards;
}

.loader-logo {
  width: 120px;
  height: auto;
  animation: logoPulse 2s ease-in-out infinite;
}

.loader-tagline {
  font-family: 'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-align: center;
}

.loader-bar {
  width: 180px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.loader-bar__fill {
  height: 100%;
  width: 0;
  border-radius: 2px;
  background: linear-gradient(to right, #29358b, #c23a8e);
  animation: loaderProgress 2.4s ease forwards;
}

@keyframes loaderAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes logoPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.85;
  }
}

@keyframes loaderProgress {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
