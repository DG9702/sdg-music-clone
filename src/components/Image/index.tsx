import { FC, useEffect, useState } from 'react'
import styles from './Image.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles);
interface ImageLazyProps {
  src?: string
  alt?: string
  colorRaw?: string
}

const ImageLazy: FC<ImageLazyProps> = (props) => {
  const { src = '', alt = '', colorRaw = '' } = props

  return (
    <div className={cx("img-wrapper")}>
      <div>

          <div
            style={{ backgroundColor: colorRaw ? colorRaw : undefined, display: "none" }}
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
