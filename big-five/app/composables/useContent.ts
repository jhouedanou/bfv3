import contentFr from '~/data/content.fr.json'
import contentEn from '~/data/content.en.json'

const contentMap: Record<string, typeof contentFr> = {
  fr: contentFr,
  en: contentEn
}

export function useContent() {
  const { locale } = useI18n()
  return contentMap[locale.value] || contentFr
}
