import React, { useState } from 'react'

const App: React.FC = () => {
	const [count, setCount] = useState(0)
	const onIncrease = () => setCount((prevVal) => prevVal + 1)

	return (
		<div className="App">
			<h2>Hello world!</h2>
			<button type="button" onClick={onIncrease}>
				{count}
			</button>
		</div>
	)
}

export default App
