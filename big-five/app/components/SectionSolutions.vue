<template>
  <section class="section-solutions">
    <div class="section-solutions__bg">
      <img src="/images/12-grand.webp" alt="Big Five" />
    </div>
    <div class="section-solutions__overlay"></div>
    <div class="section-solutions__content">
      <span class="section-solutions__tag">02 &mdash; SOLUTIONS</span>
      <h2 class="section-solutions__title">Nos expertises</h2>
      <div class="section-solutions__grid">
        <div class="section-solutions__card">
          <div class="section-solutions__card-icon">
            <img src="/images/sans-titre5-grand.webp" alt="Stratégie digitale" />
          </div>
          <h3 class="section-solutions__card-title">Stratégie digitale</h3>
          <p class="section-solutions__card-text">
            Audit, conseil et accompagnement pour une présence en ligne performante et cohérente.
          </p>
        </div>
        <div class="section-solutions__card">
          <div class="section-solutions__card-icon">
            <img src="/images/sans-titre6-grand.webp" alt="Création web" />
          </div>
          <h3 class="section-solutions__card-title">Création web</h3>
          <p class="section-solutions__card-text">
            Sites vitrines, e-commerce et applications web sur mesure avec les dernières technologies.
          </p>
        </div>
        <div class="section-solutions__card">
          <div class="section-solutions__card-icon">
            <img src="/images/sans-titre7-grand.webp" alt="Social media" />
          </div>
          <h3 class="section-solutions__card-title">Social media</h3>
          <p class="section-solutions__card-text">
            Community management, création de contenu et campagnes publicitaires ciblées.
          </p>
        </div>
        <div class="section-solutions__card">
          <div class="section-solutions__card-icon">
            <img src="/images/sans-titre8-grand.webp" alt="Branding" />
          </div>
          <h3 class="section-solutions__card-title">Branding</h3>
          <p class="section-solutions__card-text">
            Identité visuelle, charte graphique et direction artistique pour marquer les esprits.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-solutions {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.section-solutions__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.section-solutions__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-solutions__overlay {
  position: absolute;
  inset: 0;
  background: rgba(17, 17, 17, 0.88);
  z-index: 1;
}

.section-solutions__content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1100px;
  padding: 0 40px;
  text-align: center;
}

.section-solutions__tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  margin-bottom: 16px;
  text-transform: uppercase;
}

.section-solutions__title {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--color-white);
  margin-bottom: 56px;
}

.section-solutions__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.section-solutions__card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 32px 24px;
  transition: all 0.4s ease;
  text-align: left;
}

.section-solutions__card:hover {
  background: rgba(200, 168, 78, 0.08);
  border-color: rgba(200, 168, 78, 0.3);
  transform: translateY(-4px);
}

.section-solutions__card-icon {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.section-solutions__card-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-solutions__card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 12px;
}

.section-solutions__card-text {
  font-size: 0.85rem;
  font-weight: 300;
  line-height: 1.7;
  color: var(--color-gray);
}

@media (max-width: 1024px) {
  .section-solutions__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section-solutions__content {
    padding: 0 24px;
  }

  .section-solutions__title {
    font-size: 2rem;
    margin-bottom: 32px;
  }

  .section-solutions__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .section-solutions__card {
    padding: 24px 20px;
  }
}
</style>
