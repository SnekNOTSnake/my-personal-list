import React from 'react'
import { IconType } from 'react-icons/lib'
import styles from './Button.module.css'

type Props = {
	children?: React.ReactNode
	color?: 'primary' | 'red' | 'normal' | 'green'
	text?: string
	Icon: IconType
} & JSX.IntrinsicElements['button']

const Button: React.FC<Props> = ({
	children,
	color = 'normal',
	Icon,
	text,
	...rest
}) => {
	const classNames = [styles.button]
	if (!children) classNames.push(styles.square)

	switch (color) {
		case 'primary':
			classNames.push(styles.primary)
			break

		case 'red':
			classNames.push(styles.red)
			break

		case 'green':
			classNames.push(styles.green)
			break

		default:
			break
	}

	classNames.push(rest.className)

	return (
		<button {...rest} className={classNames.join(' ')}>
			<Icon />
			{children && <span>{children}</span>}
		</button>
	)
}

export default Button
