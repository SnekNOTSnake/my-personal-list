import React, { useEffect, useMemo } from 'react'
import { useState } from 'react'
import {
	MdOutlineFolder,
	MdOutlineMoreHoriz,
	MdOutlineEdit,
	MdOutlineExpandMore,
	MdOutlineImage,
	MdOutlineAdd,
} from 'react-icons/md'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Link } from 'react-router-dom'

import { seriesFilter, seriesState } from '@/store/series'
import { settingsState } from '@/store/settings'
import styles from './AnimeDetails.module.css'

type Props = { edit: () => any; data: Series }

const AnimeDetails: React.FC<Props> = ({ edit, data }) => {
	const setFilter = useSetRecoilState(seriesFilter)
	const setSeries = useSetRecoilState(seriesState)
	const { cwd } = useRecoilValue(settingsState)

	const [showRelated, setShowRelated] = useState(Boolean(data.related.length))
	const onShowRelatedToggle = () => setShowRelated((prevVal) => !prevVal)

	const [showAll, setShowAll] = useState(false)
	const onShowAllToggle = () => setShowAll((prevVal) => !prevVal)

	useEffect(() => {
		setShowRelated(Boolean(data.related.length))
	}, [data.related])

	const files = useMemo(() => {
		const items = data.files.map((file) => {
			const nameParts = file.split('.')
			if (nameParts.length < 2) return { episode: null, ext: '', full: file }

			let episode = null
			const ext = nameParts[nameParts.length - 1] as string
			if (!isNaN(Number(nameParts[0]))) episode = Number(nameParts[0])
			if (nameParts.length < 3) return { episode, ext, full: file }

			episode = Number(nameParts[0]?.replace(/[^0-9]/g, ''))
			return { episode, ext, full: file }
		})

		if (showAll) return items

		return items.filter((file) =>
			['mkv', 'mp4', 'avi', '3gp'].includes(file.ext),
		)
	}, [data.files, showAll])

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

	const onChangePoster = async () => {
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

	const posterPath = data.poster
		? `url(file://${[cwd, 'attachments', data.poster].join('/')})`
		: ''

	return (
		<div className={styles.root}>
			<div className={styles.container}>
				<div className={styles.poster} style={{ backgroundImage: posterPath }}>
					<button type='button' onClick={onChangePoster}>
						<MdOutlineImage />
					</button>
				</div>
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

					<h1>{data.title || data.path}</h1>
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

			<div className={styles.notes}>
				<p>{data.notes}</p>
			</div>

			<div
				className={[styles.related, ...[showRelated ? styles.active : '']].join(
					' ',
				)}
			>
				<div onClick={onShowRelatedToggle} className={styles.showToggler}>
					<MdOutlineExpandMore />
					Related anime
				</div>
				<div className={styles.titles}>
					<ul>
						{data.related.map((series, i) => (
							<li key={series.path || i}>
								<Link to={`/explore/${decodeURI(series.path)}`}>
									{series.type}: {series.path.replace(/-/gi, ' ')}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className={styles.episodes}>
				<button onClick={onShowAllToggle} className={styles.showAllToggler}>
					<MdOutlineFolder /> {showAll ? 'Show Videos Only' : 'Show All Files'}
				</button>

				<ul>
					{files.map((file) => {
						const fullPath = [data.fullPath, file.full].join('/')
						const isCurrentEps = file.episode === data.epsWatched + 1

						return (
							<li className={isCurrentEps ? styles.active : ''} key={file.full}>
								<div onClick={() => window.myAPI.openItem(fullPath)}>
									{file.full}
								</div>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

export default AnimeDetails
