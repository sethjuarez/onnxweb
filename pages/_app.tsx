import '~/styles/globals.css'
import type { AppProps /*, AppContext */ } from 'next/app'

const SiteApp = ({ Component, pageProps }: AppProps) =>
  <Component {...pageProps} />

export default SiteApp