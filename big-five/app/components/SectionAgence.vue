<template>
  <section class="section-agence">
    <div class="section-agence__bg">
      <img src="/images/11-grand.webp" alt="Big Five Agence" />
    </div>
    <div class="section-agence__overlay"></div>
    <div class="section-agence__content">
      <span class="section-agence__tag">01 &mdash; L'AGENCE</span>
      <h1 class="section-agence__title">
        Créateurs de<br />
        <span class="section-agence__highlight">stratégies digitales</span>
      </h1>
      <p class="section-agence__text">
        Big Five est une agence de communication digitale spécialisée dans
        la création de solutions innovantes. Nous accompagnons les entreprises
        dans leur transformation numérique avec passion et expertise.
      </p>
      <div class="section-agence__stats">
        <div class="section-agence__stat">
          <span class="section-agence__stat-number">150+</span>
          <span class="section-agence__stat-label">Projets réalisés</span>
        </div>
        <div class="section-agence__stat">
          <span class="section-agence__stat-number">12</span>
          <span class="section-agence__stat-label">Années d'expérience</span>
        </div>
        <div class="section-agence__stat">
          <span class="section-agence__stat-number">98%</span>
          <span class="section-agence__stat-label">Clients satisfaits</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-agence {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.section-agence__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.section-agence__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-agence__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(17, 17, 17, 0.92) 0%,
    rgba(17, 17, 17, 0.6) 50%,
    rgba(17, 17, 17, 0.4) 100%
  );
  z-index: 1;
}

.section-agence__content {
  position: relative;
  z-index: 2;
  padding: 0 80px;
  max-width: 800px;
}

.section-agence__tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  margin-bottom: 24px;
  text-transform: uppercase;
}

.section-agence__title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-white);
  margin-bottom: 24px;
}

.section-agence__highlight {
  color: var(--color-accent);
}

.section-agence__text {
  font-size: 1.05rem;
  font-weight: 300;
  line-height: 1.8;
  color: var(--color-gray-light);
  margin-bottom: 48px;
  max-width: 560px;
}

.section-agence__stats {
  display: flex;
  gap: 48px;
}

.section-agence__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-agence__stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-accent);
}

.section-agence__stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-gray);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .section-agence__content {
    padding: 0 24px;
  }

  .section-agence__title {
    font-size: 2.2rem;
  }

  .section-agence__stats {
    flex-direction: column;
    gap: 24px;
  }
}
</style>
