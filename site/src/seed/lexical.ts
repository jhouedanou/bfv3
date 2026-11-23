import type { Bloc } from './data/offres/types'

// Intertitres, paragraphes et listes → état Lexical (champ richText de Payload).
const base = { direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 }
const text = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })

const node = (b: Bloc) => {
  if ('h2' in b) return { ...base, type: 'heading', tag: 'h2', children: [text(b.h2)] }
  if ('ul' in b)
    return {
      ...base,
      type: 'list',
      listType: 'bullet',
      tag: 'ul',
      start: 1,
      children: b.ul.map((it, i) => ({ ...base, type: 'listitem', value: i + 1, children: [text(it)] })),
    }
  return { ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(b.p)] }
}

export const toLexical = (blocs: Bloc[]) => ({ root: { ...base, type: 'root', children: blocs.map(node) } })
