import React from 'react'
import { settingsState } from '@/store/settings'
import { useRecoilValue } from 'recoil'

import styles from './Poster.module.css'

type Props = { anime: Series } & JSX.IntrinsicElements['div']

const Poster: React.FC<Props> = ({ anime, children, ...rest }) => {
	const { cwd } = useRecoilValue(settingsState)

	const posterPath = anime.poster
		? `file://${[cwd, 'attachments', anime.poster].join('/')}`
		: ''

	return (
		<div {...rest} className={[styles.root, rest.className].join(' ')}>
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
