import { useRef } from 'react'
import { navItems } from '../../config/navigation'
import { siteConfig } from '../../config/site'
import { useFitText } from '../../hooks/useFitText'
import { ButtonLink } from '../ui/Button'
import { MaskLine } from '../ui/MaskLine'
import { Sparkle } from '../ui/Decor'
import { ArrowRightIcon, ArrowUpIcon, ArrowUpRightIcon, InstagramIcon, MailIcon } from '../ui/Icons'
import './Footer.css'

const { brand, contact, credit, legal } = siteConfig
const YEAR = new Date().getFullYear()

export function Footer() {
  const wordmarkRef = useRef<HTMLSpanElement>(null)
  useFitText(wordmarkRef)

  return (
    <footer className="footer" id="contact" aria-labelledby="footer-title">
      <div className="container footer__inner">
        <div className="footer__cta">
          <h2 id="footer-title" className="footer__title display" data-reveal="mask">
            <MaskLine index={0}>Ready to</MaskLine>
            <MaskLine index={1}>make your move?</MaskLine>
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

        <div className="footer__credit">
          <span className="footer__credit-label micro">Design &amp; development</span>
          <a
            className="studio-credit"
            href={credit.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Design and development by ${credit.name} ${credit.descriptor} (opens in a new tab)`}
          >
            <img
              className="studio-credit__logo"
              src="/images/zynk-logo-96.webp"
              srcSet="/images/zynk-logo-96.webp 1x, /images/zynk-logo-192.webp 2x"
              alt=""
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
            />
            <span className="studio-credit__text">
              <span className="studio-credit__name">{credit.name}</span>
              <span className="studio-credit__descriptor micro">{credit.descriptor}</span>
            </span>
            <span className="studio-credit__handle micro">{credit.handle}</span>
            <ArrowUpRightIcon size={16} className="studio-credit__arrow" />
          </a>
        </div>

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
