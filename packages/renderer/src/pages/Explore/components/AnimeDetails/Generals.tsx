import React, { useState, MouseEvent } from 'react'
import {
	MdOutlineFolder,
	MdOutlineMoreHoriz,
	MdOutlineEdit,
	MdOutlineImage,
	MdOutlineAdd,
} from 'react-icons/md'
import { useSetRecoilState } from 'recoil'

import { seriesFilterState, seriesState } from '@/store/series'
import Poster from '@/components/Poster'
import Modal from '@/components/Modal'
import styles from './AnimeDetails.module.css'
import Button from '@/components/Button/Button'

type Props = { edit: () => any; data: Series }

const Generals: React.FC<Props> = ({ data, edit }) => {
	const setFilter = useSetRecoilState(seriesFilterState)
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
				<Button
					color='primary'
					Icon={MdOutlineImage}
					type='button'
					onClick={onChangePoster}
					title='Change Poster'
				/>
			</Poster>

			<div className={styles.detail}>
				<div className={styles.actions}>
					<Button
						Icon={MdOutlineFolder}
						color='primary'
						onClick={() => window.myAPI.openItem(data.fullPath)}
						type='button'
						title='Open In File Explorer'
					/>
					<Button
						Icon={MdOutlineEdit}
						color='green'
						onClick={edit}
						type='button'
						title='Edit Series'
					/>
					<Button
						className={styles.more}
						Icon={MdOutlineMoreHoriz}
						type='button'
						title='Others (Unusable, for now)'
					/>
				</div>

				<h1>{data.path}</h1>
				<div className={styles.watchInfo}>
					<Button
						Icon={MdOutlineAdd}
						color='green'
						onClick={onIncreaseEpsWatched}
						type='button'
						title='Increase Watched Episode'
					/>
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
