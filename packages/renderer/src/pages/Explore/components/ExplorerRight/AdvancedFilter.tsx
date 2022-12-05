import React, { useState, MouseEvent } from 'react'
import { useRecoilState } from 'recoil'

import { seriesFilterState } from '@/store/series'
import styles from './ExplorerRight.module.css'

type Props = { isFilterOpen: boolean; closeFilter: any }

const emptyInputs: AdvFilter = {
	regular: 'any',
	epsNum: { value: 0, operator: 'gte' },
	epsWatched: { value: 0, operator: 'gte' },
	rewatchCount: { value: 0, operator: 'gte' },
	encoder: { value: '', operator: 'normal' },
	source: { value: '', operator: 'normal' },
	quality: { value: '', operator: 'normal' },
	res: { value: 0, operator: 'gte' },
	video: { value: '', operator: 'normal' },
	audio: { value: '', operator: 'normal' },
	subtitle: { value: '', operator: 'normal' },
	notes: { value: '', operator: 'normal' },
	order: { value: 'title', operator: 'asc' },
}

const AdvancedFilter: React.FC<Props> = ({ isFilterOpen, closeFilter }) => {
	const [filter, setFilter] = useRecoilState(seriesFilterState)
	const [input, setInput] = useState(
		filter.advFilter.length ? filter.advFilter[0] : emptyInputs,
	)

	const onValueChange = (e: InputChange | SelectChange) => {
		setInput((initVal) => {
			const type = e.target.getAttribute('type')

			let value: any = e.target.value
			if (type === 'checkbox') value = !initVal.regular
			if (type === 'number') value = Number(e.target.value)

			return {
				...initVal,
				[e.target.name]: {
					...(initVal[e.target.name as keyof AdvFilter] as any),
					value,
				},
			}
		})
	}

	const onOperatorChange = (e: SelectChange) => {
		setInput((initVal) => {
			const value = e.target.value

			return {
				...initVal,
				[e.target.name]: {
					...(initVal[e.target.name as keyof AdvFilter] as any),
					operator: value,
				},
			}
		})
	}

	const onInputChange = (e: InputChange | SelectChange) => {
		setInput((initVal) => {
			const type = e.target.getAttribute('type')

			let value: any = e.target.value
			if (type === 'checkbox') value = !initVal.regular
			if (type === 'number') value = Number(e.target.value)

			return {
				...initVal,
				[e.target.name]: value,
			}
		})
	}

	const onSubmit = (e: FormSubmit) => {
		e.preventDefault()
		setFilter((prevVal) => ({ ...prevVal, advFilter: [input] }))
		closeFilter()
	}

	const onRemove = (e: MouseEvent<HTMLButtonElement>) => {
		setInput(emptyInputs)
		setFilter((prevVal) => ({ ...prevVal, advFilter: [] }))
		closeFilter()
	}

	return (
		<div
			className={[styles.advancedFilter, isFilterOpen ? styles.open : ''].join(
				' ',
			)}
		>
			<form onSubmit={onSubmit}>
				<div className={styles.inputGroup}>
					<div>Regular Series</div>
					<div>
						<select
							name='regular'
							value={input.regular}
							onChange={onInputChange}
						>
							<option value='any'>Any</option>
							<option value='regular'>Regular</option>
							<option value='irregular'>Irregular</option>
						</select>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Number of Eps</div>
					<div>
						<select
							value={input.epsNum.operator}
							name='epsNum'
							onChange={onOperatorChange}
							title={
								input.epsNum.operator === 'gte'
									? 'Greater Than or Equal'
									: 'Lesser Than or Equal'
							}
						>
							<option value='gte'>GTE</option>
							<option value='lte'>LTE</option>
						</select>
						<input
							type='number'
							name='epsNum'
							value={input.epsNum.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Watched Eps</div>
					<div>
						<select
							value={input.epsWatched.operator}
							name='epsWatched'
							onChange={onOperatorChange}
							title={
								input.epsWatched.operator === 'gte'
									? 'Greater Than or Equal'
									: 'Lesser Than or Equal'
							}
						>
							<option value='gte'>GTE</option>
							<option value='lte'>LTE</option>
						</select>
						<input
							type='number'
							name='epsWatched'
							value={input.epsWatched.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Rewatch Count</div>
					<div>
						<select
							value={input.rewatchCount.operator}
							name='rewatchCount'
							onChange={onOperatorChange}
							title={
								input.rewatchCount.operator === 'gte'
									? 'Greater Than or Equal'
									: 'Lesser Than or Equal'
							}
						>
							<option value='gte'>GTE</option>
							<option value='lte'>LTE</option>
						</select>
						<input
							type='number'
							name='rewatchCount'
							value={input.rewatchCount.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Encoder</div>
					<div>
						<select
							name='encoder'
							value={input.encoder.operator}
							onChange={onOperatorChange}
							title={
								input.encoder.operator === 'normal'
									? 'Normal Search'
									: 'Regular Expression Search'
							}
						>
							<option value='normal'>NOR</option>
							<option value='regexp'>REG</option>
						</select>
						<input
							type='text'
							name='encoder'
							value={input.encoder.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Source</div>
					<div>
						<select
							name='source'
							value={input.source.operator}
							onChange={onOperatorChange}
							title={
								input.source.operator === 'normal'
									? 'Normal Search'
									: 'Regular Expression Search'
							}
						>
							<option value='normal'>NOR</option>
							<option value='regexp'>REG</option>
						</select>
						<input
							type='text'
							name='source'
							value={input.source.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Quality</div>
					<div>
						<select
							name='quality'
							value={input.quality.operator}
							onChange={onOperatorChange}
							title={
								input.quality.operator === 'normal'
									? 'Normal Search'
									: 'Regular Expression Search'
							}
						>
							<option value='normal'>NOR</option>
							<option value='regexp'>REG</option>
						</select>
						<input
							type='text'
							name='quality'
							value={input.quality.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Resolution</div>
					<div>
						<select
							value={input.res.operator}
							name='res'
							onChange={onOperatorChange}
							title={
								input.res.operator === 'gte'
									? 'Greater Than or Equal'
									: 'Lesser Than or Equal'
							}
						>
							<option value='gte'>GTE</option>
							<option value='lte'>LTE</option>
						</select>
						<input
							type='number'
							name='res'
							value={input.res.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Video</div>
					<div>
						<select
							name='video'
							value={input.video.operator}
							onChange={onOperatorChange}
							title={
								input.video.operator === 'normal'
									? 'Normal Search'
									: 'Regular Expression Search'
							}
						>
							<option value='normal'>NOR</option>
							<option value='regexp'>REG</option>
						</select>
						<input
							type='text'
							name='video'
							value={input.video.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Audio</div>
					<div>
						<select
							name='audio'
							value={input.audio.operator}
							onChange={onOperatorChange}
							title={
								input.audio.operator === 'normal'
									? 'Normal Search'
									: 'Regular Expression Search'
							}
						>
							<option value='normal'>NOR</option>
							<option value='regexp'>REG</option>
						</select>
						<input
							type='text'
							name='audio'
							value={input.audio.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Subtitle</div>
					<div>
						<select
							name='subtitle'
							value={input.subtitle.operator}
							onChange={onOperatorChange}
							title={
								input.subtitle.operator === 'normal'
									? 'Normal Search'
									: 'Regular Expression Search'
							}
						>
							<option value='normal'>NOR</option>
							<option value='regexp'>REG</option>
						</select>
						<input
							type='text'
							name='subtitle'
							value={input.subtitle.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Description</div>
					<div>
						<select
							name='notes'
							value={input.notes.operator}
							onChange={onOperatorChange}
							title={
								input.notes.operator === 'normal'
									? 'Normal Search'
									: 'Regular Expression Search'
							}
						>
							<option value='normal'>NOR</option>
							<option value='regexp'>REG</option>
						</select>
						<input
							type='text'
							name='notes'
							value={input.notes.value}
							onChange={onValueChange}
						/>
					</div>
				</div>
				<div className={styles.inputGroup}>
					<div>Order By</div>
					<div>
						<select
							name='order'
							value={input.order.operator}
							onChange={onOperatorChange}
							title={
								input.order.operator === 'asc'
									? 'Ascending Order'
									: 'Descending Order'
							}
						>
							<option value='asc'>ASC</option>
							<option value='desc'>DESC</option>
						</select>
						<select
							name='order'
							value={input.order.value}
							onChange={onValueChange}
						>
							<option value='title'>Title</option>
							<option value='epsNum'>Eps Num</option>
							<option value='resolution'>Resolution</option>
						</select>
					</div>
				</div>
				<div className={styles.actions}>
					<button type='submit' className={styles.apply} title='Apply Filters'>
						Apply
					</button>
					<button
						type='button'
						onClick={onRemove}
						className={styles.remove}
						title='Remove Filters'
					>
						Remove
					</button>
					<button
						type='button'
						onClick={closeFilter}
						title='Close Advanced Filters'
					>
						Close
					</button>
				</div>
			</form>
		</div>
	)
}

export default AdvancedFilter
