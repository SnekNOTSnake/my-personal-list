import React, { useState } from 'react'
import TextField from '@/components/TextField'
import styles from './EditTags.module.css'

type Props = { setTags: (tags: string[]) => any; tagsI: string[] }

const EditTags: React.FC<Props> = ({ setTags, tagsI }) => {
	const [tagInput, setTagInput] = useState('')
	const onTagChange = (e: InputChange) => setTagInput(e.target.value)

	const onTagSubmit = (e: InputKeyPress) => {
		if (e.key === 'Enter') {
			e.preventDefault()

			const newTag = e.currentTarget.value
			if (['Untagged'].includes(newTag)) return
			if (tagsI.includes(newTag)) return

			setTags([...tagsI, newTag])
			setTagInput('')
		}
	}

	const onTagRemove = (tag: string) => {
		const index = tagsI.findIndex((el) => el === tag)
		if (index < 0) return

		const newTags = [...tagsI]
		newTags.splice(index, 1)

		setTags(newTags)
	}

	return (
		<div className={styles.editTags}>
			<ul>
				<li className={styles.addTag}>
					<TextField
						label='Add Tag'
						onKeyPress={onTagSubmit}
						value={tagInput}
						onChange={onTagChange}
					/>
				</li>
				{tagsI.map((tag) => (
					<li key={tag} onClick={() => onTagRemove(tag)}>
						{tag}
					</li>
				))}
			</ul>
		</div>
	)
}

export default EditTags
