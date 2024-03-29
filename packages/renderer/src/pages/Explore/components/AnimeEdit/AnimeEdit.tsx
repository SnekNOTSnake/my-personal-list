import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { MdOutlineCheck, MdOutlineDelete, MdOutlineClose } from 'react-icons/md'

import { seriesState, seriesFilterState, seriesStats } from '@/store/series'
import Button from '@/components/Button/Button'
import styles from './AnimeEdit.module.css'
import EditGenerals from './EditGenerals'
import EditRelations from './EditRelations'
import EditTags from './EditTags'
import EditNotes from './EditNotes'
import EditMetadata from './EditMetadata'

type Props = { closeEdit: () => any; data: Series }

const EditAnimeDetails: React.FC<Props> = ({ closeEdit, data }) => {
	const defaultInputs = {
		jpTitle: data.jpTitle,
		romanjiTitle: '',
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

	const stats = useRecoilValue(seriesStats)
	const setFilters = useSetRecoilState(seriesFilterState)
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
		const newSeries = await window.myAPI.getSeries()
		setSeries(newSeries)

		// Remove active single tags about to delete
		setFilters((prevVal) => {
			const tagsToDelete = data.tags.filter((tag) => !input.tags.includes(tag))
			const lonelyTagsToDelete = stats.tags.filter(
				(tag) => tag.count === 1 && tagsToDelete.includes(tag.name),
			)

			const active = [...prevVal.tags.active]
			const deactive = [...prevVal.tags.deactive]

			lonelyTagsToDelete.forEach((tag) => {
				const aIndex = active.findIndex((el) => el === tag.name)
				const dIndex = deactive.findIndex((el) => el === tag.name)

				if (aIndex >= 0) active.splice(aIndex, 1)
				if (dIndex >= 0) deactive.splice(dIndex, 1)
			})

			return { ...prevVal, tags: { active, deactive } }
		})

		closeEdit()
	}

	const onResetForm = () => setInput(defaultInputs)

	return (
		<div className={styles.edit}>
			<h2>Edit Details</h2>

			<form onSubmit={onSubmit}>
				<EditGenerals generalInfo={input} onInputChange={onInputChange} />
				<EditMetadata metadata={input} onInputChange={onInputChange} />
				<div className={styles.group}>
					<EditRelations
						data={data}
						relatedI={input.related}
						setRelatedI={setRelated}
					/>
					<EditTags tagsI={input.tags} setTags={setTags} />
				</div>
				<EditNotes notesI={input.notes} onInputChange={onInputChange} />

				<div>
					<Button
						color='primary'
						Icon={MdOutlineCheck}
						type='submit'
						title='Save Changes'
					>
						Save
					</Button>
					<Button
						color='red'
						Icon={MdOutlineDelete}
						type='button'
						onClick={onResetForm}
						title='Reset Changes'
					>
						Reset
					</Button>
					<Button
						type='button'
						Icon={MdOutlineClose}
						onClick={closeEdit}
						title='Cancel Changes'
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	)
}

export default EditAnimeDetails
