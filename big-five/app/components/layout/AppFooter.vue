<script setup lang="ts">
import { Mail } from 'lucide-vue-next'

const { footer } = useContent()
</script>

<template>
  <footer class="footer" id="contact">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        <!-- Logo -->
        <div class="flex flex-col items-center md:items-start">
          <svg class="footer-logo" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="5" y="22" font-family="Montserrat, sans-serif" font-weight="700" font-size="20" fill="white" letter-spacing="2">B</text>
            <text x="28" y="22" font-family="Montserrat, sans-serif" font-weight="700" font-size="20" fill="white" letter-spacing="2">G</text>
            <text x="5" y="48" font-family="Montserrat, sans-serif" font-weight="700" font-size="20" fill="white" letter-spacing="2">F</text>
            <text x="28" y="35" font-family="Montserrat, sans-serif" font-weight="300" font-size="12" fill="white" letter-spacing="1">VE</text>
          </svg>
        </div>

        <!-- Contact -->
        <div class="flex flex-col items-center text-center gap-2">
          <p class="text-sm text-gray-400 font-body">{{ footer.contactLabel }}</p>
          <a
            :href="`mailto:${footer.email}`"
            class="footer-email flex items-center gap-2"
          >
            <Mail :size="16" />
            {{ footer.email }}
          </a>
        </div>

        <!-- Social -->
        <div class="flex flex-col items-center md:items-end gap-3">
          <p class="text-sm text-gray-400 font-body">{{ footer.socialLabel }}</p>
          <UiSocialIcons :socials="footer.socials" />
        </div>
      </div>

      <div class="border-t border-white/10 mt-10 pt-6 text-center">
        <p class="text-xs text-gray-500 font-body">
          &copy; {{ new Date().getFullYear() }} {{ footer.copyright }}
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background-color: var(--color-footer-bg);
}
.footer-logo {
  width: 80px;
  height: 60px;
}
.footer-email {
  color: white;
  font-family: var(--font-body);
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s;
}
.footer-email:hover {
  color: var(--color-accent-magenta);
}
</style>
