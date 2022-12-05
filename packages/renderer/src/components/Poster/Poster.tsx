import React from 'react'
import { useRecoilValue } from 'recoil'
import { settingsState } from '@/store/settings'
import styles from './Poster.module.css'

type Props = { anime: Series } & JSX.IntrinsicElements['div']

const Poster: React.FC<Props> = ({ anime, children, ...rest }) => {
	const { userDataDir } = useRecoilValue(settingsState)
	const posterPath = anime.poster
		? `file://${[userDataDir, 'attachments', anime.poster].join('/')}`
		: ''

	return (
		<div {...rest} className={[styles.poster, rest.className].join(' ')}>
			<img
				src={posterPath}
				alt='Test'
				onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
				onLoad={(e) => (e.currentTarget.style.visibility = 'visible')}
			/>
			{children}
		</div>
	)
}

export default Poster
