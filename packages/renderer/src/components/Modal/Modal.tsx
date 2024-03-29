import React, { useEffect, useRef } from 'react'
import s from './Modal.module.css'

type Props = { open: boolean; onClose: Function } & JSX.IntrinsicElements['div']

const Modal: React.FC<Props> = ({ open, onClose, children, ...rest }) => {
	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const clickListener = (e: MouseEvent) => {
			if (e.target === modalRef.current) onClose()
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
			ref={modalRef}
			className={[s.modal, open ? s.active : '', rest.className].join(' ')}
			{...rest}
		>
			<div className={s.content}>{children}</div>
		</div>
	)
}

export default Modal
