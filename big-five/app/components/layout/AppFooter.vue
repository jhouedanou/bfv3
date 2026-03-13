<script setup lang="ts">
import { Mail } from 'lucide-vue-next'

const { footer } = useContent()
</script>

<template>
  <footer class="footer" id="contact">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <div class="flex flex-col md:flex-row gap-10 items-center justify-between">
        <!-- Logo -->
        <div class="flex flex-col items-center md:items-start">
          <img src="/images/logo.svg" alt="Big Five Logo" class="footer-logo mb-4" />
        </div>

        <!-- Contact -->
        <div class="flex flex-col items-center text-center gap-2">
          <!-- <p class="text-sm text-gray-400 font-body">{{ footer.contactLabel }}</p>
           --><a
            :href="`mailto:${footer.email}`"
            class="footer-email flex items-center gap-2"
          >
            <Mail :size="16" />
            {{ footer.email }}
          </a>
        </div>

        <!-- Social -->
        <div class="flex flex-col items-center md:items-end gap-3">
          <p id="social-label" class="text-sm text-gray-400 font-body">{{ footer.socialLabel }}</p>
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
  flex-shrink: 0;
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
#social-label{
   font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  font-family: var(--font-display);
}
@media (max-width: 768px) {
  
  .footer-logo {
    //display: none !important;
  }
  }
</style>
