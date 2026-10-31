export function SiteFooter({ locale = 'fr' }: { locale?: 'fr' | 'en' }) {
  const french = locale === 'fr'
  return <footer className="site-footer" id="aide">
    <div className="site-footer-inner">
      <span>© Copyright ITYC. {french ? 'Tous droits réservés' : 'All Rights Reserved'}</span>
      <span>{french ? 'Conçu par Skipper Du Mad' : 'Designed by Skipper Du Mad'}</span>
      <button aria-label={french ? 'Remonter en haut de la page' : 'Back to top'} className="back-to-top" onClick={() => window.scrollTo({ behavior: 'smooth', top: 0 })} type="button">↑</button>
    </div>
  </footer>
}
