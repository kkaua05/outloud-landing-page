import type { CSSProperties } from 'react'
import { productImage } from '../../lib/productImage'

interface ProductImageProps {
  /** `sizes` attribute describing the rendered width. */
  sizes: string
  className?: string
  style?: CSSProperties
  /** First-fold image: eager + high priority. Everything else is lazy. */
  priority?: boolean
  /** Pass an empty string when the image is decorative next to a captioned copy. */
  alt?: string
}

export function ProductImage({
  sizes,
  className,
  style,
  priority = false,
  alt = productImage.alt,
}: ProductImageProps) {
  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={productImage.avifSrcSet} sizes={sizes} />
      <img
        src={productImage.src}
        srcSet={productImage.webpSrcSet}
        sizes={sizes}
        width={productImage.width}
        height={productImage.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
      />
    </picture>
  )
}
