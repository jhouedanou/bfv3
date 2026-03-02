<template>
  <section class="section-contact">
    <div class="section-contact__bg">
      <img src="/images/sans-titre9-grand.webp" alt="Big Five Contact" />
    </div>
    <div class="section-contact__overlay"></div>
    <div class="section-contact__content">
      <div class="section-contact__left">
        <span class="section-contact__tag">04 &mdash; NOUS CONTACTER</span>
        <h2 class="section-contact__title">
          Parlons de votre<br />
          <span class="section-contact__highlight">projet</span>
        </h2>
        <div class="section-contact__info">
          <div class="section-contact__info-item">
            <span class="section-contact__info-label">Email</span>
            <span class="section-contact__info-value">contact@bigfive.fr</span>
          </div>
          <div class="section-contact__info-item">
            <span class="section-contact__info-label">Téléphone</span>
            <span class="section-contact__info-value">+33 1 23 45 67 89</span>
          </div>
          <div class="section-contact__info-item">
            <span class="section-contact__info-label">Adresse</span>
            <span class="section-contact__info-value">12 rue de l'Innovation, 75001 Paris</span>
          </div>
        </div>
      </div>
      <div class="section-contact__right">
        <form class="section-contact__form" @submit.prevent>
          <div class="section-contact__form-row">
            <div class="section-contact__form-group">
              <label class="section-contact__form-label" for="name">Nom</label>
              <input
                id="name"
                class="section-contact__form-input"
                type="text"
                placeholder="Votre nom"
              />
            </div>
            <div class="section-contact__form-group">
              <label class="section-contact__form-label" for="email">Email</label>
              <input
                id="email"
                class="section-contact__form-input"
                type="email"
                placeholder="Votre email"
              />
            </div>
          </div>
          <div class="section-contact__form-group">
            <label class="section-contact__form-label" for="subject">Sujet</label>
            <input
              id="subject"
              class="section-contact__form-input"
              type="text"
              placeholder="Sujet de votre message"
            />
          </div>
          <div class="section-contact__form-group">
            <label class="section-contact__form-label" for="message">Message</label>
            <textarea
              id="message"
              class="section-contact__form-input section-contact__form-textarea"
              rows="4"
              placeholder="Votre message"
            ></textarea>
          </div>
          <button class="section-contact__form-btn" type="submit">
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-contact {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.section-contact__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.section-contact__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-contact__overlay {
  position: absolute;
  inset: 0;
  background: rgba(17, 17, 17, 0.93);
  z-index: 1;
}

.section-contact__content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.section-contact__tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  margin-bottom: 24px;
  text-transform: uppercase;
}

.section-contact__title {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-white);
  margin-bottom: 40px;
}

.section-contact__highlight {
  color: var(--color-accent);
}

.section-contact__info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-contact__info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-contact__info-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  text-transform: uppercase;
}

.section-contact__info-value {
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-gray-light);
}

.section-contact__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-contact__form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.section-contact__form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-contact__form-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-gray);
  text-transform: uppercase;
}

.section-contact__form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 14px 16px;
  font-family: var(--font-main);
  font-size: 0.9rem;
  color: var(--color-white);
  outline: none;
  transition: border-color 0.3s ease;
}

.section-contact__form-input::placeholder {
  color: var(--color-gray);
}

.section-contact__form-input:focus {
  border-color: var(--color-accent);
}

.section-contact__form-textarea {
  resize: none;
}

.section-contact__form-btn {
  align-self: flex-start;
  background: var(--color-accent);
  color: var(--color-darker);
  border: none;
  border-radius: 8px;
  padding: 14px 36px;
  font-family: var(--font-main);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.section-contact__form-btn:hover {
  background: var(--color-accent-light);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .section-contact__content {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0 24px;
  }

  .section-contact__title {
    font-size: 2rem;
    margin-bottom: 24px;
  }

  .section-contact__form-row {
    grid-template-columns: 1fr;
  }
}
</style>
