import React, { useEffect, MouseEvent } from 'react'
import { MdFilterAlt, MdOutlinePermMedia } from 'react-icons/md'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
	filteredSeries,
	seriesFilterState,
	selectedSeriesState,
} from '@/store/series'
import styles from './ExplorerRight.module.css'
import AdvancedFilter from './AdvancedFilter'
import Button from '@/components/Button/Button'

const ExplorerRight: React.FC = () => {
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const titlesRef = React.useRef<HTMLDivElement | null>(null)

	const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false)
	const closeFilter = () => setIsFilterOpen(false)
	const toggleFilter = () => setIsFilterOpen((prevVal) => !prevVal)

	const filtered = useRecoilValue(filteredSeries)
	const [filter, setFilter] = useRecoilState(seriesFilterState)
	const [selectedSeries, setSelectedSeries] =
		useRecoilState(selectedSeriesState)

	const filteredPaths = filtered.map((s) => s.path)
	const cIndex = filteredPaths.indexOf(selectedSeries[0])

	const select = (e: MouseEvent<HTMLLIElement>, path: string) => {
		if (e.shiftKey) {
			const tIndex = filteredPaths.indexOf(path)
			if (cIndex < 0 || tIndex < 0) return
			const newSelections =
				cIndex > tIndex
					? [selectedSeries[0], ...filteredPaths.slice(tIndex, cIndex)]
					: [...filteredPaths.slice(cIndex, tIndex), path]
			setSelectedSeries(newSelections)
			return
		}

		if (e.ctrlKey) {
			const newSelections = [...selectedSeries]
			if (selectedSeries.includes(path)) {
				const indexToDelete = newSelections.findIndex((el) => el === path)
				newSelections.splice(indexToDelete, 1)
				setSelectedSeries(newSelections)
				return
			}
			newSelections.push(path)
			setSelectedSeries(newSelections)
			return
		}

		setSelectedSeries([path])
	}

	// Select the first filtered if selection is empty
	useEffect(() => {
		if (!selectedSeries.length) setSelectedSeries([filtered[0].path])
	}, [selectedSeries.length])

	// Shortcuts
	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			const focused = document.querySelector(`.${styles.right}:focus-within`)
			if (!titlesRef.current || !inputRef.current) return
			if (!focused && !['f', 'Escape'].includes(e.key)) return

			const scrollAccordingly = () => {
				if (!titlesRef.current) return

				const pth = filteredPaths[cIndex - (e.key === 'ArrowUp' ? 1 : -1)]
				const next = document.querySelector(
					`[data-path="${pth}"]`,
				) as HTMLElement

				const pastBottom =
					next.offsetTop >=
					titlesRef.current.scrollTop + titlesRef.current.offsetHeight
				const pastTop = next.offsetTop - 35 <= titlesRef.current.scrollTop

				if (pastTop) {
					titlesRef.current.scrollTo({ top: next.offsetTop - 35 })
				} else if (pastBottom) {
					titlesRef.current.scrollTo({
						top: next.offsetTop - titlesRef.current.offsetHeight,
					})
				}
			}

			switch (e.key) {
				case 'ArrowUp':
					e.preventDefault()
					if (!filteredPaths[cIndex - 1]) return

					scrollAccordingly()
					setSelectedSeries([filteredPaths[cIndex - 1]])
					break

				case 'ArrowDown':
					e.preventDefault()
					if (!filteredPaths[cIndex + 1]) return

					scrollAccordingly()
					setSelectedSeries([filteredPaths[cIndex + 1]])
					break

				case 'f':
					if (!e.ctrlKey) return
					inputRef.current.focus()
					inputRef.current.select()
					break

				case 'Escape':
					setFilter((prevVal) => ({ ...prevVal, query: '' }))
					break

				default:
					break
			}
		}

		window.addEventListener('keydown', listener)
		return () => window.removeEventListener('keydown', listener)
	}, [cIndex, filtered])

	const onSearchChange = (e: InputChange) => {
		setFilter((prevVal) => ({ ...prevVal, query: e.target.value }))
	}

	return (
		<div className={styles.right} tabIndex={0}>
			<div className={styles.toolBar}>
				<div>
					<input
						ref={inputRef}
						type='search'
						placeholder='Search'
						value={filter.query}
						onChange={onSearchChange}
						className={styles.search}
					/>
				</div>
				<div>
					<Button
						Icon={MdFilterAlt}
						title='Advanced Filters'
						onClick={toggleFilter}
						className={[
							styles.icon,
							filter.advFilter.length ? styles.active : '',
						].join(' ')}
					/>
				</div>
			</div>
			<div ref={titlesRef} className={styles.titles}>
				<ul>
					{filtered.map((el, i) => (
						<li
							className={[
								selectedSeries.includes(el.path) ? styles.active : '',
								selectedSeries.includes(el.path) &&
								(!filtered[i + 1] ||
									!selectedSeries.includes(filtered[i + 1].path))
									? styles.last
									: '',
							].join(' ')}
							key={el.path}
							data-path={el.path}
							onClick={(e) => select(e, el.path)}
						>
							<span>{el.path}</span>
						</li>
					))}
				</ul>
			</div>
			<AdvancedFilter isFilterOpen={isFilterOpen} closeFilter={closeFilter} />
			<div className={styles.matches}>
				<MdOutlinePermMedia /> {filtered.length} Items
			</div>
		</div>
	)
}

export default ExplorerRight
