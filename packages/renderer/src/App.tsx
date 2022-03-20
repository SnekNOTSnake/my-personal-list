import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

import Layout from '@/components/Layout'
import { settingsState } from '@/store/settings'
import { seriesState } from '@/store/series'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Schedule from './pages/Schedule'

const App: React.FC = () => {
	const setSettings = useSetRecoilState(settingsState)
	const setSeries = useSetRecoilState(seriesState)

	useEffect(() => {
		window.addEventListener('focus', async () => {
			const newSeries = await window.myAPI.getSeries()
			setSeries(newSeries)
		})

		window.myAPI.onUpdateSettings(async (newSettings) => {
			setSettings(newSettings)
			const newSeries = await window.myAPI.getSeries()
			setSeries(newSeries)
		})
	}, [])

	return (
		<Layout>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/explore/*' element={<Explore />} />
				<Route path='/schedule' element={<Schedule />} />
			</Routes>
		</Layout>
	)
}

export default App
