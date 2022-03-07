import React from 'react'

import styles from './TodayAnime.module.css'

const TodayAnime: React.FC = () => (
	<div className={styles.root}>
		<h2>TodayAnime</h2>
		<div className={styles.posters}>
			{Array.from(new Array(3).keys()).map((el) => (
				<div
					key={el}
					className={styles.poster}
					style={{
						backgroundImage: `url(https://picsum.photos/450/630?key=${el})`,
					}}
				/>
			))}
		</div>
	</div>
)

export default TodayAnime
