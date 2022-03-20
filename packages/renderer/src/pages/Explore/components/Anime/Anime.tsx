import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { seriesState } from '@/store/series'
import Details from '../AnimeDetails'
import Edit from '../AnimeEdit'
import styles from './Anime.module.css'

const Anime: React.FC = () => {
	const params = useParams()
	const path = decodeURI(params.path || '')
	const ani = useRecoilValue(seriesState).find((el) => el.path === path)

	const [isEditing, setIsEditing] = React.useState(false)
	useEffect(() => setIsEditing(false), [path])

	if (!ani) return <div />

	const edit = () => setIsEditing(true)
	const close = () => setIsEditing(false)

	return (
		<div className={styles.root}>
			{isEditing ? (
				<Edit closeEdit={close} data={ani} />
			) : (
				<Details edit={edit} data={ani} />
			)}
		</div>
	)
}

export default Anime
