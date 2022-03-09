import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './pages/App'
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
