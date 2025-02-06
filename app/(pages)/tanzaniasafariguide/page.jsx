import dynamic from 'next/dynamic'

const SafariGuidesList = dynamic(
  () => import('./SafariGuidesList'),
  { ssr: false }
)

export default SafariGuidesList;