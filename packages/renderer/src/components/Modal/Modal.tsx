import React, { useEffect, useRef } from 'react'
import styles from './Modal.module.css'

type Props = { open: boolean; onClose: Function }
const Modal: React.FC<Props> = ({ open, onClose, children }) => {
	const rootRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const clickListener = (e: MouseEvent) => {
			if (e.target === rootRef.current) onClose()
		}

		const keydownListener = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}

		window.addEventListener('click', clickListener)
		window.addEventListener('keydown', keydownListener)

		return () => {
			window.removeEventListener('click', clickListener)
			window.removeEventListener('keydown', keydownListener)
		}
	}, [])

	return (
		<div
			ref={rootRef}
			className={[styles.root, open ? styles.active : ''].join(' ')}
		>
			<div className={styles.content}>{children}</div>
		</div>
	)
}

export default Modal
