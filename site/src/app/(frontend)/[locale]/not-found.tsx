import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="contenu" className="page page--text">
      <h1 className="h2">Page introuvable</h1>
      <p className="body-text">Cette page n’existe pas ou a été déplacée.</p>
      <p>
        <Link href="/" className="btn btn--primary">
          Retour à l’accueil
        </Link>
      </p>
    </main>
  )
}
