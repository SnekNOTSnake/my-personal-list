import React from 'react'
import {
	MdOutlineSettings,
	MdOutlineDelete,
	MdOutlineAdd,
} from 'react-icons/md'
import styles from './Schedule.module.css'

const Schedule: React.FC = () => (
	<div className={styles.root}>
		<div className={styles.addSeries}>
			<input type='text' />
			<div className={styles.suggestions}>
				<ul>
					<li>Kaifuku Jutsushi no Yarinaoshi</li>
					<li>Kara no Kyoukai</li>
					<li>Kill la Kill</li>
				</ul>
			</div>
		</div>

		<div className={styles.days}>
			{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
				<div key={day} className={styles.day}>
					<div
						className={[
							styles.container,
							day === 'Tue' ? styles.active : '',
						].join(' ')}
					>
						<div className={styles.header}>
							<h1>{day}</h1>
							<button type='button'>
								<MdOutlineAdd />
							</button>
						</div>
						{Array.from(new Array(3).keys()).map((el) => (
							<div key={el} className={styles.series}>
								<div
									className={styles.poster}
									style={{
										backgroundImage: `url(https://picsum.photos/50/75?key=${
											String(el) + day
										})`,
									}}
								></div>
								<div className={styles.details}>
									<h3>Strike Witches 2</h3>
									<div className={styles.episode}>EP 03/12</div>
									<div className={styles.actions}>
										<MdOutlineSettings />
										<MdOutlineDelete />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	</div>
)

export default Schedule
