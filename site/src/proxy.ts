import { NextResponse, type NextRequest } from 'next/server'

import { ROUTES } from '@/lib/site'

// FR à la racine, EN sous /en. Les routes internes vivent sous app/(frontend)/[locale] :
//   /x        → réécrit en /fr/x
//   /fr/x     → 301 vers /x (pas de doublon d'URL)
//   /en/x     → servi tel quel
// Rubriques traduites (ROUTES) : /en/barometers/x est réécrit vers le dossier « barometres »,
// et /en/barometres/x part en 301 vers l'adresse anglaise (une seule adresse par page).
// La langue choisie est mémorisée dans le cookie NEXT_LOCALE (stockage technique, cf. politique § 08).
const under = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`)

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname === '/fr' || pathname.startsWith('/fr/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 301)
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const rest = pathname.slice(3)
    for (const { fr, en } of Object.values(ROUTES)) {
      if (under(rest, en)) {
        const url = request.nextUrl.clone()
        url.pathname = `/en${fr}${rest.slice(en.length)}`
        return NextResponse.rewrite(url)
      }
      if (under(rest, fr)) {
        const url = request.nextUrl.clone()
        url.pathname = `/en${en}${rest.slice(fr.length)}`
        return NextResponse.redirect(url, 301)
      }
    }
    return NextResponse.next()
  }

  if (pathname === '/' && request.cookies.get('NEXT_LOCALE')?.value === 'en') {
    const url = request.nextUrl.clone()
    url.pathname = '/en'
    return NextResponse.redirect(url, 307)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/fr${pathname === '/' ? '' : pathname}`
  url.search = search
  return NextResponse.rewrite(url)
}

export const config = {
  // Exclut l'admin Payload, l'API, les fichiers Next, les fichiers statiques et les routes de métadonnées.
  matcher: ['/((?!admin|api|_next|images|favicon|sitemap\\.xml|robots\\.txt|.*\\.[a-zA-Z0-9]+$).*)'],
}
