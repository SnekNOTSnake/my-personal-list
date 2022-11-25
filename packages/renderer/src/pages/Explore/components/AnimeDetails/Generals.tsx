import React, { useState, MouseEvent } from 'react'
import {
	MdOutlineFolder,
	MdOutlineMoreHoriz,
	MdOutlineEdit,
	MdOutlineImage,
	MdOutlineAdd,
} from 'react-icons/md'
import { useSetRecoilState } from 'recoil'

import { seriesFilter, seriesState } from '@/store/series'
import Poster from '@/components/Poster'
import Modal from '@/components/Modal'
import styles from './AnimeDetails.module.css'

type Props = { edit: () => any; data: Series }

const Generals: React.FC<Props> = ({ data, edit }) => {
	const setFilter = useSetRecoilState(seriesFilter)
	const setSeries = useSetRecoilState(seriesState)
	const [open, setOpen] = useState(false)

	const onCloseModal = () => setOpen(false)
	const onOpenModal = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		e.nativeEvent.stopImmediatePropagation()

		setOpen(true)
	}

	const onActivateTag = (tag: string) =>
		setFilter((prevVal) => {
			if (prevVal.tags.active.includes(tag)) return prevVal

			const newTags = {
				active: [...prevVal.tags.active],
				deactive: [...prevVal.tags.deactive],
			}
			newTags.active.push(tag)

			// Delete from deactive if exists
			const dIndex = newTags.deactive.findIndex((el) => el === tag)
			newTags.deactive.splice(dIndex, 1)

			return {
				...prevVal,
				tags: newTags,
			}
		})

	const onChangePoster = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		e.stopPropagation()
		e.nativeEvent.stopImmediatePropagation()

		const result = await window.myAPI.changePoster(data)
		setSeries((prevVal) => {
			const newSeries = [...prevVal]
			const index = newSeries.findIndex((el) => el.path === data.path)
			newSeries.splice(index, 1, result)
			return newSeries
		})
	}

	const onIncreaseEpsWatched = async () => {
		const newData = {
			...data,
			epsWatched: data.epsWatched + 1,
		}

		await window.myAPI.editSeries(newData)

		setSeries((prevVal) => {
			const newSeries = [...prevVal]
			const index = newSeries.findIndex((el) => el.path === data.path)
			newSeries.splice(index, 1, newData)
			return newSeries
		})
	}

	return (
		<div className={styles.container}>
			<Modal open={open} onClose={onCloseModal}>
				<Poster anime={data} className={styles.modalPoster} />
			</Modal>

			<Poster onClick={onOpenModal} anime={data} className={styles.poster}>
				<button type='button' onClick={onChangePoster}>
					<MdOutlineImage />
				</button>
			</Poster>

			<div className={styles.detail}>
				<div className={styles.actions}>
					<button
						onClick={() => window.myAPI.openItem(data.fullPath)}
						style={{ backgroundColor: '#2f80ed' }}
						type='button'
					>
						<MdOutlineFolder />
					</button>
					<button
						onClick={edit}
						style={{ backgroundColor: '#219653' }}
						type='button'
					>
						<MdOutlineEdit />
					</button>
					<button style={{ backgroundColor: '#3b3e42' }} type='button'>
						<MdOutlineMoreHoriz />
					</button>
				</div>

				<h1>{data.path}</h1>
				<div className={styles.watchInfo}>
					<button onClick={onIncreaseEpsWatched} type='button'>
						<MdOutlineAdd />
					</button>
					<div className={styles.watchedInfo}>
						{data.epsWatched} of {data.epsNum} episodes
					</div>
					<div className={styles.rewatchInfo}>
						Re-watch count: {data.rewatchCount}
					</div>
				</div>
				<div className={styles.tags}>
					<ul>
						{data.tags.map((tag) => (
							<li onClick={() => onActivateTag(tag)} key={tag}>
								{tag.replace(/-/, ' ')}
							</li>
						))}
					</ul>
				</div>

				<div className={styles.additionalInfo}>
					<ul>
						<li>Encoder: {data.encoder}</li>
						<li>Source: {data.source}</li>
						<li>Quality: {data.quality}</li>
						<li>Resolution: {data.res}p</li>
						<li>Video: {data.video}</li>
						<li>Audio: {data.audio}</li>
						<li>Duration: {data.duration} mins</li>
						<li>Subtitle: {data.subtitle}</li>
						{data.regular || (
							<li className={styles.irregular}>Type: Irregular</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default Generals
