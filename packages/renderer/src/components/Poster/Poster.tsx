import React from 'react'
import { settingsState } from '@/store/settings'
import { useRecoilValue } from 'recoil'

import styles from './Poster.module.css'

type Props = { anime: Series } & JSX.IntrinsicElements['div']

const Poster: React.FC<Props> = ({ anime, children, ...rest }) => {
	const { cwd } = useRecoilValue(settingsState)

	const posterPath = anime.poster
		? `url(file://${[cwd, 'attachments', anime.poster].join('/')})`
		: ''

	return (
		<div
			{...rest}
			className={[styles.root, rest.className].join(' ')}
			style={{ backgroundImage: posterPath, ...rest.style }}
		>
			{children}
		</div>
	)
}

export default Poster
