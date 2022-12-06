import React from 'react'
import styles from './TextField.module.css'

type Props = {
	label: string
} & JSX.IntrinsicElements['input']

const TextField: React.FC<Props> = ({ label, ...rest }) => (
	<div className={styles.textField}>
		<div className={styles.input}>
			<input type='text' {...rest} />
		</div>

		<fieldset>{label && <legend>{label}</legend>}</fieldset>
	</div>
)

export default TextField
