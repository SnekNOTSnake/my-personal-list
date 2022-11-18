import React from 'react'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { HashRouter as Router } from 'react-router-dom'

import App from './App'
import '@fontsource/roboto'
import './index.css'

createRoot(document.querySelector('#root')!).render(
	<React.StrictMode>
		<RecoilRoot>
			<Router>
				<App />
			</Router>
		</RecoilRoot>
	</React.StrictMode>,
)
