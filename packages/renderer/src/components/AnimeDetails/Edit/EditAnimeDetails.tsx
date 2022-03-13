import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { seriesState } from '@/store/series'

import EditMetadata from './EditMetadata'
import EditNotes from './EditNotes'
import EditRelations from './EditRelations'
import EditTags from './EditTags'
import styles from './EditAnimeDetails.module.css'
import EditGenerals from './EditGenerals'

type Props = { closeEdit: () => any; data: Series }

const EditAnimeDetails: React.FC<Props> = ({ closeEdit, data }) => {
	const defaultInputs = {
		title: data.title,
		epsNum: data.epsNum,
		epsWatched: data.epsWatched,
		rewatchCount: data.rewatchCount,
		encoder: data.encoder,
		source: data.source,
		quality: data.quality,
		res: data.res,
		duration: data.duration,
		video: data.video,
		audio: data.audio,
		subtitle: data.subtitle,
		notes: data.notes,
		tags: data.tags,
		related: data.related,
		regular: data.regular,
	}

	const setSeries = useSetRecoilState(seriesState)
	const [input, setInput] = useState(defaultInputs)

	const setRelated = (relations: Relation[]) =>
		setInput((prevVal) => ({
			...prevVal,
			related: relations,
		}))

	const setTags = (tags: string[]) =>
		setInput((prevVal) => ({
			...prevVal,
			tags,
		}))

	const onInputChange = (e: InputChange | TextAreaChange) => {
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

	const onSubmit = async (e: FormSubmit) => {
		e.preventDefault()

		await window.myAPI.editSeries({ ...data, ...input })

		setSeries((prevVal) => {
			const index = prevVal.findIndex((el) => el.path === data.path)
			const newSeries = [...prevVal]
			newSeries.splice(index, 1, { ...prevVal[index], ...input })
			return newSeries
		})

		closeEdit()
	}

	const onResetForm = () => setInput(defaultInputs)

	return (
		<div className={styles.root}>
			<h2>Edit Details</h2>

			<form onSubmit={onSubmit}>
				<EditGenerals generalInfo={input} onInputChange={onInputChange} />
				<EditMetadata metadata={input} onInputChange={onInputChange} />
				<EditTags tagsI={input.tags} setTags={setTags} />
				<EditNotes notesI={input.notes} onInputChange={onInputChange} />
				<EditRelations
					data={data}
					relatedI={input.related}
					setRelatedI={setRelated}
				/>

				<div>
					<button className={styles.save} type='submit'>
						Save
					</button>
					<button type='button' onClick={onResetForm}>
						Reset
					</button>
					<button type='button' onClick={closeEdit}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	)
}

export default EditAnimeDetails
