import { useRef } from 'react'
import { navItems } from '../../config/navigation'
import { siteConfig } from '../../config/site'
import { useFitText } from '../../hooks/useFitText'
import { ButtonLink } from '../ui/Button'
import { Sparkle } from '../ui/Decor'
import { ArrowRightIcon, ArrowUpIcon, InstagramIcon, MailIcon } from '../ui/Icons'
import './Footer.css'

const { brand, contact, legal } = siteConfig
const YEAR = new Date().getFullYear()

export function Footer() {
  const wordmarkRef = useRef<HTMLSpanElement>(null)
  useFitText(wordmarkRef)

  return (
    <footer className="footer" id="contact" aria-labelledby="footer-title">
      <div className="container footer__inner">
        <div className="footer__cta" data-reveal>
          <h2 id="footer-title" className="footer__title display">
            Ready to <br />
            make your move?
          </h2>
          <ButtonLink variant="cream" href="#shop" icon={<ArrowRightIcon size={18} />}>
            Shop the drop
          </ButtonLink>
        </div>

        <div className="footer__columns">
          <nav className="footer__col" aria-labelledby="footer-nav-title">
            <h3 id="footer-nav-title" className="footer__label micro">
              Navigate
            </h3>
            <ul className="footer__list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a className="footer__link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h3 className="footer__label micro">Contact</h3>
            <ul className="footer__list">
              <li>
                {contact.instagramUrl ? (
                  <a className="footer__link" href={contact.instagramUrl} target="_blank" rel="noopener noreferrer">
                    <InstagramIcon size={18} />
                    {contact.instagramHandle || 'Instagram'}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="footer__pending">
                    <InstagramIcon size={18} /> Instagram — coming soon
                  </span>
                )}
              </li>
              <li>
                {contact.email ? (
                  <a className="footer__link" href={`mailto:${contact.email}`}>
                    <MailIcon size={18} />
                    {contact.email}
                  </a>
                ) : (
                  <span className="footer__pending">
                    <MailIcon size={18} /> Email — coming soon
                  </span>
                )}
              </li>
            </ul>
          </div>

          <div className="footer__col footer__col--about">
            <h3 className="footer__label micro">{brand.name}</h3>
            <p className="footer__about">
              <Sparkle className="footer__about-spark" />
              {brand.tagline} The Nike Dunk High “Game Royal” drop, presented by {brand.name}.
            </p>
          </div>
        </div>

        <p className="footer__wordmark" aria-hidden="true">
          <span ref={wordmarkRef} className="footer__wordmark-text">
            {brand.name}
          </span>
        </p>

        <div className="footer__bottom">
          <p>
            © {YEAR} {brand.name}. All rights reserved.
          </p>
          <p>{legal.trademarkNotice}</p>
          <a className="footer__top" href="#top">
            Back to top
            <ArrowUpIcon size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}
