import React from 'react'

type Props = {
	notesI: string
	onInputChange: (e: InputChange | TextAreaChange) => any
}

const EditNotes: React.FC<Props> = ({ notesI, onInputChange }) => (
	<div>
		<textarea name='notes' value={notesI} onChange={onInputChange} />
	</div>
)

export default EditNotes
