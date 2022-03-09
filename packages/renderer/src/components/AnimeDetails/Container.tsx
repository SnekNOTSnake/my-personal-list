import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import AnimeDetails from './Details'
import EditAnimeDetails from './Edit'
import styles from './Container.module.css'
import { seriesState } from '@/store/series'

const Container: React.FC = () => {
	const { seriesId } = useParams()
	const series = useRecoilValue(seriesState).find((el) => el.id === seriesId)

	const [isEditing, setIsEditing] = React.useState(false)
	useEffect(() => setIsEditing(false), [seriesId])

	if (!series) return <div>404 Series not found</div>

	const edit = () => setIsEditing(true)
	const closeEdit = () => setIsEditing(false)

	return (
		<div className={styles.root}>
			{isEditing ? (
				<EditAnimeDetails closeEdit={closeEdit} data={series} />
			) : (
				<AnimeDetails edit={edit} data={series} />
			)}
		</div>
	)
}

export default Container
