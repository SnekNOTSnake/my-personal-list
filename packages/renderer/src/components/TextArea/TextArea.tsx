import React from 'react'
import styles from './TextArea.module.css'

type Props = {
	label: string
} & JSX.IntrinsicElements['textarea']

const TextArea: React.FC<Props> = ({ label, ...rest }) => (
	<div className={styles.textArea}>
		<div className={styles.input}>
			<textarea {...rest} />
		</div>

		<fieldset>{label && <legend>{label}</legend>}</fieldset>
	</div>
)

export default TextArea
