<template>
  <div class="layout-wrapper relative min-h-screen overflow-hidden">
    <!-- Organic background shapes -->
    <div class="organic-shapes" aria-hidden="true">
      <svg class="shape shape-1" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <path d="M300,520C400,520 520,400 520,300C520,200 400,80 300,80C200,80 80,200 80,300C80,400 200,520 300,520Z" fill="rgba(194,58,142,0.08)" />
      </svg>
      <svg class="shape shape-2" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,200 Q200,50 400,200 T800,200 L800,400 L0,400 Z" fill="rgba(123,63,160,0.06)" />
      </svg>
      <svg class="shape shape-3" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="300" cy="300" rx="250" ry="180" fill="rgba(194,58,142,0.05)" />
      </svg>
    </div>

    <LayoutAppHeader />

    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout-wrapper {
  background: var(--gradient-hero);
}

.organic-shapes {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  mix-blend-mode: soft-light;
  opacity: 0.6;
}

.shape-1 {
  top: -100px;
  right: -150px;
  width: 600px;
  height: 600px;
  animation: float1 20s ease-in-out infinite;
}

.shape-2 {
  bottom: 20%;
  left: -200px;
  width: 800px;
  height: 400px;
  animation: float2 25s ease-in-out infinite;
}

.shape-3 {
  top: 50%;
  right: 10%;
  width: 500px;
  height: 500px;
  animation: float3 18s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-30px, 20px) rotate(5deg); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(40px, -15px) rotate(-3deg); }
}
@keyframes float3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, 30px) scale(1.05); }
}

main {
  position: relative;
  z-index: 1;
}
</style>
