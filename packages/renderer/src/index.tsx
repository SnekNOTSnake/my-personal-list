import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { HashRouter as Router } from 'react-router-dom'

import App from './App'
import '@fontsource/roboto'
import './index.css'

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<Router>
				<App />
			</Router>
		</RecoilRoot>
	</React.StrictMode>,
	document.querySelector('#root'),
)
