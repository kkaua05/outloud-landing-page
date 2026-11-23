import type { CSSProperties } from 'react'
import { CircleBadge, Scribble, Sparkle } from '../ui/Decor'
import './BrandStatement.css'

export function BrandStatement() {
  return (
    <section className="statement" id="about" aria-labelledby="statement-title">
      <div className="container statement__grid">
        <p className="statement__index section-index micro" data-reveal>
          <span className="section-index__num">05</span> About
        </p>

        <h2 id="statement-title" className="statement__title display" data-reveal>
          Not made <br />
          to{' '}
          <span className="statement__strike">
            blend in.
            <Scribble className="statement__scribble" />
          </span>
        </h2>

        <div className="statement__aside" data-reveal style={{ '--reveal-delay': 160 } as CSSProperties}>
          <Sparkle className="statement__spark" />
          <p className="statement__text">
            Streetwear is more than what you wear. It’s how you express yourself.
          </p>
        </div>

        <CircleBadge
          className="statement__badge"
          words={['Not made to blend in', 'Own your style']}
        />
      </div>
    </section>
  )
}
