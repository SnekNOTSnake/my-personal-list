import React, { useEffect, useState } from 'react'
import { MdOutlineExpandMore } from 'react-icons/md'
import { Link } from 'react-router-dom'
import styles from './AnimeDetails.module.css'

type Props = { data: Series }

const Related: React.FC<Props> = ({ data }) => {
	const [show, setShow] = useState(Boolean(data.related.length))
	const onShowRelatedToggle = () => setShow((prevVal) => !prevVal)

	useEffect(() => {
		setShow(Boolean(data.related.length))
	}, [data.related])

	return (
		<div className={[styles.related, show ? styles.active : ''].join(' ')}>
			<div onClick={onShowRelatedToggle} className={styles.showToggler}>
				<MdOutlineExpandMore />
				Related anime
			</div>

			<div className={styles.titles}>
				<ul>
					{data.related.map((series, i) => (
						<li key={series.path || i}>
							<Link to={`/explore/${decodeURI(series.path)}`}>
								{series.type}: {series.path}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default Related
