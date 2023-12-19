import { FC, useEffect, useState } from 'react'
import styles from './Image.module.scss'

interface ImageLazyProps {
  src?: string
  alt?: string
  colorRaw?: string
}

const ImageLazy: FC<ImageLazyProps> = (props) => {
  const { src = '', alt = '', colorRaw = '' } = props

  return (
    <div className={styles.wrapper}>
      <div>

          <div
            style={{ backgroundColor: colorRaw ? colorRaw : undefined }}
            className={styles.overlay}
          ></div>
      </div>
      <img
        src={src}
        alt={alt}
      />
    </div>
  )
}

export default ImageLazy
