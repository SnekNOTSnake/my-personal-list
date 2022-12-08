import React from 'react'
import TextArea from '@/components/TextArea'
import styles from './EditNotes.module.css'

type Props = { notesI: string; onInputChange: (e: TextAreaChange) => any }

const EditNotes: React.FC<Props> = ({ notesI, onInputChange }) => (
	<div className={styles.editNotes}>
		<TextArea
			value={notesI}
			onChange={onInputChange}
			label='Notes'
			name='notes'
		/>
	</div>
)

export default EditNotes
