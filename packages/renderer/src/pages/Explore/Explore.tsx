import React, { useEffect } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { useLocation } from 'react-router-dom'

import { selectedSeriesState, populatedSelectedSeries } from '@/store/series'
import LeftExplorer from './components/ExplorerLeft'
import RightExplorer from './components/ExplorerRight'
import Anime from './components/Anime'
import styles from './Explore.module.css'

const Explore: React.FC = () => {
	const setSelectedSeries = useSetRecoilState(selectedSeriesState)
	const selectedPopulatedSeries = useRecoilValue(populatedSelectedSeries)

	const { search } = useLocation()
	const query = new URLSearchParams(search)
	const selectPath = query.get('select')

	useEffect(() => {
		if (selectPath) setSelectedSeries([selectPath])
	}, [selectPath])

	return (
		<div className={styles.root}>
			<div className={styles.explorer}>
				<LeftExplorer />
				<RightExplorer />
			</div>

			<div className={styles.selected}>
				{selectedPopulatedSeries.length === 1 && (
					<Anime anime={selectedPopulatedSeries[0]!} />
				)}
				{selectedPopulatedSeries.length > 1 && <div>Multiple Selected</div>}
			</div>
		</div>
	)
}

export default Explore
