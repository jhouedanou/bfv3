<script setup lang="ts">
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-vue-next'
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  socials?: { name: string; label: string; url: string }[]
}>(), {
  socials: () => []
})

const iconMap: Record<string, Component> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
}
</script>

<template>
  <div class="flex items-center gap-3">
    <a
      v-for="social in socials"
      :key="social.name"
      :href="social.url"
      :aria-label="social.label"
      class="social-icon"
      target="_blank"
      rel="noopener noreferrer"
    >
      <component :is="iconMap[social.name]" :size="18" />
    </a>
  </div>
</template>

<style scoped>
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  color: var(--color-primary-deep);
  transition: all 0.3s ease;
}
.social-icon:hover {
  background: var(--color-accent-magenta);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(194, 58, 142, 0.4);
}
</style>
