<template>
  <section class="section-obs">
    <div class="section-obs__bg">
      <img src="/images/13-grand.webp" alt="Big Five Observatoire" />
    </div>
    <div class="section-obs__overlay"></div>
    <div class="section-obs__content">
      <div class="section-obs__left">
        <span class="section-obs__tag">03 &mdash; OBSERVATOIRE</span>
        <h2 class="section-obs__title">
          Veille &<br />
          <span class="section-obs__highlight">tendances digitales</span>
        </h2>
        <p class="section-obs__text">
          Notre observatoire analyse en continu les évolutions du marché digital
          pour anticiper les tendances et vous offrir un avantage stratégique.
        </p>
      </div>
      <div class="section-obs__right">
        <div class="section-obs__card">
          <div class="section-obs__card-img">
            <img src="/images/sans-titre9-grand.webp" alt="Analyse data" />
          </div>
          <div class="section-obs__card-content">
            <h3 class="section-obs__card-title">Analyse de données</h3>
            <p class="section-obs__card-text">
              Traitement et visualisation de données pour des décisions éclairées et mesurables.
            </p>
          </div>
        </div>
        <div class="section-obs__card">
          <div class="section-obs__card-img">
            <img src="/images/sans-titre5-grand.webp" alt="Veille concurrentielle" />
          </div>
          <div class="section-obs__card-content">
            <h3 class="section-obs__card-title">Veille concurrentielle</h3>
            <p class="section-obs__card-text">
              Surveillance des acteurs clés de votre marché et détection d'opportunités.
            </p>
          </div>
        </div>
        <div class="section-obs__card">
          <div class="section-obs__card-img">
            <img src="/images/sans-titre6-grand.webp" alt="Rapport tendances" />
          </div>
          <div class="section-obs__card-content">
            <h3 class="section-obs__card-title">Rapports de tendances</h3>
            <p class="section-obs__card-text">
              Publications régulières sur les innovations et les meilleures pratiques du secteur.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-obs {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.section-obs__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.section-obs__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-obs__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(17, 17, 17, 0.95) 0%,
    rgba(17, 17, 17, 0.85) 50%,
    rgba(17, 17, 17, 0.7) 100%
  );
  z-index: 1;
}

.section-obs__content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.section-obs__tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  margin-bottom: 24px;
  text-transform: uppercase;
}

.section-obs__title {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-white);
  margin-bottom: 24px;
}

.section-obs__highlight {
  color: var(--color-accent);
}

.section-obs__text {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.8;
  color: var(--color-gray-light);
  max-width: 440px;
}

.section-obs__right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-obs__card {
  display: flex;
  gap: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.4s ease;
}

.section-obs__card:hover {
  background: rgba(200, 168, 78, 0.08);
  border-color: rgba(200, 168, 78, 0.3);
}

.section-obs__card-img {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.section-obs__card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-obs__card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 6px;
}

.section-obs__card-text {
  font-size: 0.82rem;
  font-weight: 300;
  line-height: 1.6;
  color: var(--color-gray);
}

@media (max-width: 768px) {
  .section-obs__content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 0 24px;
  }

  .section-obs__title {
    font-size: 2rem;
  }
}
</style>
