import React, { useMemo, useState } from 'react'
import { MdOutlineFolder } from 'react-icons/md'
import styles from './AnimeDetails.module.css'

type Props = { data: Series }

const Episodes: React.FC<Props> = ({ data }) => {
	const [showAll, setShowAll] = useState(false)
	const onShowAllToggle = () => setShowAll((prevVal) => !prevVal)

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

	return (
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
	)
}

export default Episodes
