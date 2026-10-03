import despia from 'despia-native'

const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : ''
const isDespia = userAgent.includes('despia')
const isDespiaIOS = isDespia && (userAgent.includes('iphone') || userAgent.includes('ipad'))
const isDespiaAndroid = isDespia && userAgent.includes('android')

export function useDespia() {
  return { despia, isDespia, isDespiaIOS, isDespiaAndroid }
}
