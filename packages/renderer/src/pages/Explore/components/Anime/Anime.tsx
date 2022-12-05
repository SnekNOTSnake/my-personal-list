import React, { useEffect } from 'react'

import Details from '../AnimeDetails'
import Edit from '../AnimeEdit'
import styles from './Anime.module.css'

type Props = { anime: Series }

const Anime: React.FC<Props> = ({ anime }) => {
	const [isEditing, setIsEditing] = React.useState(false)
	useEffect(() => setIsEditing(false), [anime.path])

	const edit = () => setIsEditing(true)
	const close = () => setIsEditing(false)

	return (
		<div className={styles.anime}>
			{isEditing ? (
				<Edit closeEdit={close} data={anime} />
			) : (
				<Details edit={edit} data={anime} />
			)}
		</div>
	)
}

export default Anime
