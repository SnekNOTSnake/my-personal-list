import React, { useState } from 'react'
import styles from './AnimeBatchEdit.module.css'

type Props = { selectedAnime: Series[] }

const defaultInputs = {
	encoder: '',
	source: '',
	quality: '',
	res: 0,
	video: '',
	audio: '',
	duration: 0,
	subtitle: '',
	addTags: [] as string[],
	removeTags: [] as string[],
	regular: false,
}

const AnimeBatchEdit: React.FC<Props> = ({ selectedAnime }) => {
	const [input, setInput] = useState(defaultInputs)
	const [addTag, setAddTag] = useState('')
	const [removeTag, setRemoveTag] = useState('')

	const onInputChange = (e: InputChange) => {
		setInput((initVal) => {
			const type = e.target.getAttribute('type')

			let value: any = e.target.value
			if (type === 'checkbox') value = !initVal.regular
			if (type === 'number') value = Number(e.target.value)

			return {
				...initVal,
				[e.target.name]: value,
			}
		})
	}

	const onTagChange = (e: InputChange, type: 'add' | 'remove') => {
		const value = e.target.value
		if (type === 'add') return setAddTag(value)
		setRemoveTag(value)
	}

	const onTagSubmit = (e: InputKeyPress, type: 'add' | 'remove') => {
		const tagTarget = e.currentTarget.value

		if (e.key !== 'Enter') return
		if (['Untagged'].includes(tagTarget)) return

		if (type === 'add') {
			if (input.addTags.includes(tagTarget)) return
			setInput((prevVal) => ({
				...prevVal,
				addTags: [...prevVal.addTags, tagTarget],
			}))
			setAddTag('')
			return
		}

		if (input.removeTags.includes(tagTarget)) return
		setInput((prevVal) => ({
			...prevVal,
			removeTags: [...prevVal.removeTags, tagTarget],
		}))
		setRemoveTag('')
	}

	const onTagRemove = (tag: string, type: 'add' | 'remove') => {
		if (type === 'add') {
			if (!input.addTags.includes(tag)) return
			setInput((prevVal) => {
				const newAddTags = [...prevVal.addTags]
				const index = newAddTags.indexOf(tag)
				newAddTags.splice(index, 1)
				return { ...prevVal, addTags: newAddTags }
			})
			return
		}

		if (!input.removeTags.includes(tag)) return
		setInput((prevVal) => {
			const newRemoveTags = [...prevVal.removeTags]
			const index = newRemoveTags.indexOf(tag)
			newRemoveTags.splice(index, 1)
			return { ...prevVal, removeTags: newRemoveTags }
		})
	}

	const selectAllRemovableTags = () =>
		setInput((prevVal) => {
			const set = new Set<string>()
			selectedAnime.forEach((anime) => {
				anime.tags.forEach((tag) => set.add(tag))
			})

			return { ...prevVal, removeTags: Array.from(set) }
		})

	const onSubmit = (field: keyof typeof defaultInputs) => {
		let editedSeries: Series[] = []
		let message: string = ''

		if (field === 'addTags') {
			if (!input.addTags.length) return
			editedSeries = selectedAnime.map((s) => {
				const tagSet = new Set<string>(s.tags)
				input.addTags.forEach((tag) => tagSet.add(tag))
				message = `Add tags "${input.addTags.join(', ')}" to ${
					selectedAnime.length
				} series?`
				return { ...s, tags: Array.from(tagSet) }
			})
		} else if (field === 'removeTags') {
			if (!input.removeTags.length) return
			editedSeries = selectedAnime.map((s) => {
				const tagSet = new Set<string>(s.tags)
				input.removeTags.forEach((tag) => tagSet.delete(tag))
				message = `Remove tags "${input.removeTags.join(', ')}" from ${
					selectedAnime.length
				} series?`
				return { ...s, tags: Array.from(tagSet) }
			})
		} else {
			if (!input[field] && field !== 'regular') return
			editedSeries = selectedAnime.map((s) => ({ ...s, [field]: input[field] }))
			message = `Set "${field}" to "${input[field]}" in ${selectedAnime.length} series?`
		}

		if (confirm(message)) {
			editedSeries.forEach((s) => window.myAPI.editSeries(s))
		}
	}

	return (
		<div className={styles.batchEdit}>
			<div className={styles.center}>
				<h1>Selected {selectedAnime.length} Series</h1>

				<table>
					<tbody>
						<tr>
							<th>Encoder</th>
							<td>
								<input
									type='text'
									name='encoder'
									value={input.encoder}
									onChange={onInputChange}
								/>
								<button type='button' onClick={() => onSubmit('encoder')}>
									OK
								</button>
							</td>
							<th>Source</th>
							<td>
								<input
									type='text'
									name='source'
									value={input.source}
									onChange={onInputChange}
								/>
								<button type='button' onClick={() => onSubmit('source')}>
									OK
								</button>
							</td>
						</tr>
						<tr>
							<th>Quality</th>
							<td>
								<input
									type='text'
									name='quality'
									value={input.quality}
									onChange={onInputChange}
								/>
								<button type='button' onClick={() => onSubmit('quality')}>
									OK
								</button>
							</td>
							<th>Resolution</th>
							<td>
								<input
									type='number'
									name='res'
									value={input.res}
									onChange={onInputChange}
								/>
								<button type='button' onClick={() => onSubmit('res')}>
									OK
								</button>
							</td>
						</tr>
						<tr>
							<th>Video</th>
							<td>
								<input
									type='text'
									name='video'
									value={input.video}
									onChange={onInputChange}
								/>
								<button type='button' onClick={() => onSubmit('video')}>
									OK
								</button>
							</td>
							<th>Audio</th>
							<td>
								<input
									type='text'
									name='audio'
									value={input.audio}
									onChange={onInputChange}
								/>
								<button type='button' onClick={() => onSubmit('audio')}>
									OK
								</button>
							</td>
						</tr>
						<tr>
							<th>Duration</th>
							<td>
								<input
									type='number'
									name='duration'
									value={input.duration}
									onChange={onInputChange}
								/>
								<button type='button' onClick={() => onSubmit('duration')}>
									OK
								</button>
							</td>
							<th>Subtitle</th>
							<td>
								<input
									type='text'
									name='subtitle'
									value={input.subtitle}
									onChange={onInputChange}
								/>
								<button type='button' onClick={() => onSubmit('subtitle')}>
									OK
								</button>
							</td>
						</tr>
					</tbody>
				</table>

				<div className={styles.inputsGroup}>
					<div className={styles.labeledInput}>
						<div className={styles.label}>Add Tag</div>
						<div className={styles.inputGroup}>
							<input
								type='text'
								name='addTag'
								value={addTag}
								onChange={(e) => onTagChange(e, 'add')}
								onKeyPress={(e) => onTagSubmit(e, 'add')}
							/>
							<button type='button' onClick={() => onSubmit('addTags')}>
								OK
							</button>
						</div>
						<div>
							<ul>
								{input.addTags.map((tag) => (
									<li onClick={() => onTagRemove(tag, 'add')} key={tag}>
										{tag}
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className={styles.labeledInput}>
						<div className={styles.label}>Remove Tag</div>
						<div className={styles.inputGroup}>
							<input
								type='text'
								name='removeTag'
								value={removeTag}
								onChange={(e) => onTagChange(e, 'remove')}
								onKeyPress={(e) => onTagSubmit(e, 'remove')}
							/>
							<button
								type='button'
								className={styles.all}
								onClick={selectAllRemovableTags}
							>
								All
							</button>
							<button type='button' onClick={() => onSubmit('removeTags')}>
								OK
							</button>
						</div>
						<div>
							<ul>
								{input.removeTags.map((tag) => (
									<li onClick={() => onTagRemove(tag, 'remove')} key={tag}>
										{tag}
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className={styles.labeledInput}>
						<div className={styles.label}>Regular Series</div>
						<div className={styles.inputGroup}>
							<input
								type='checkbox'
								name='regular'
								checked={input.regular}
								onChange={onInputChange}
							/>
							<button type='button' onClick={() => onSubmit('regular')}>
								OK
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AnimeBatchEdit
