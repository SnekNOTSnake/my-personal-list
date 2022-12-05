import React from 'react'
import Episodes from './Episodes'
import Generals from './Generals'
import Notes from './Notes'
import Related from './Related'
import styles from './AnimeDetails.module.css'

type Props = { edit: () => any; data: Series }

const AnimeDetails: React.FC<Props> = ({ edit, data }) => (
	<div className={styles.details}>
		<Generals data={data} edit={edit} />
		{data.notes.length > 0 && <Notes data={data} />}
		<Related data={data} />
		<Episodes data={data} />
	</div>
)

export default AnimeDetails
