import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from '../../components/Layout'
import Home from '../Home'
import Explore from '../Explore'

const App: React.FC = () => (
	<Layout>
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/explore/*' element={<Explore />} />
		</Routes>
	</Layout>
)

export default App
