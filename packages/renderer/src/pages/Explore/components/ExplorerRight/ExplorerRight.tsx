import React, { useEffect } from 'react'
import { MdSearch, MdOutlineExpandMore } from 'react-icons/md'
import { useRecoilState, useRecoilValue } from 'recoil'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

import { filteredSeries, seriesFilter } from '@/store/series'
import styles from './ExplorerRight.module.css'

const getPath = (path: string) => `/explore/${path}`

const ExplorerRight: React.FC = () => {
	const navigate = useNavigate()
	const { '*': path } = useParams()
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const titlesRef = React.useRef<HTMLDivElement | null>(null)

	const filtered = useRecoilValue(filteredSeries)
	const [filter, setFilter] = useRecoilState(seriesFilter)

	// Auto select first occurrence
	useEffect(() => {
		if (filtered.length && !filtered.some((el) => el.path === path))
			navigate(getPath(filtered[0].path))
	}, [filter])

	// Shortcuts
	useEffect(() => {
		const index = filtered.findIndex((el) => el.path === path)

		const listener = (e: KeyboardEvent) => {
			const iFocused = document.querySelector(`.${styles.search}:focus`)
			const focused = document.querySelector(`.${styles.root}:focus-within`)
			if (!titlesRef.current || !inputRef.current) return
			if (!focused && !['f', 'Escape'].includes(e.key)) return

			const scrollAccordingly = () => {
				if (!titlesRef.current) return

				const pth = filtered[index - (e.key === 'ArrowUp' ? 1 : -1)].path
				const next = document.querySelector(
					`[data-path="${pth}"]`,
				) as HTMLElement

				const pastBottom =
					next.offsetTop - 35 >=
					titlesRef.current.scrollTop + titlesRef.current.offsetHeight
				const pastTop = next.offsetTop - 70 <= titlesRef.current.scrollTop

				if (pastTop) {
					titlesRef.current.scrollTo({ top: next.offsetTop - 70 })
				} else if (pastBottom) {
					titlesRef.current.scrollTo({
						top: next.offsetTop - 35 - titlesRef.current.offsetHeight,
					})
				}
			}

			switch (e.key) {
				case 'ArrowUp':
					e.preventDefault()
					if (!filtered[index - 1]) return

					scrollAccordingly()
					navigate(getPath(filtered[index - 1].path))
					break

				case 'ArrowDown':
					e.preventDefault()
					if (!filtered[index + 1]) return

					scrollAccordingly()
					navigate(getPath(filtered[index + 1].path))
					break

				case 'Home':
					if (!filtered.length || iFocused) return
					navigate(getPath(filtered[0].path))
					break

				case 'End':
					if (!filtered.length || iFocused) return
					navigate(getPath(filtered[filtered.length - 1].path))
					break

				case 'f':
					if (!e.ctrlKey) return
					inputRef.current.focus()
					inputRef.current.select()
					break

				case 'Escape':
					inputRef.current.blur()
					setFilter((prevVal) => ({ ...prevVal, query: '' }))
					break

				default:
					break
			}
		}

		window.addEventListener('keydown', listener)
		return () => window.removeEventListener('keydown', listener)
	}, [path, filtered])

	const onSearchChange = (e: InputChange) => {
		setFilter((prevVal) => ({ ...prevVal, query: e.target.value }))
	}

	const onOrderByChange = (e: SelectChange) => {
		setFilter((prevVal) => ({
			...prevVal,
			order: { ...prevVal.order, by: e.target.value as any },
		}))
	}

	const onAscDescClick = () =>
		setFilter((prevVal) => ({
			...prevVal,
			order: { ...prevVal.order, descending: !prevVal.order.descending },
		}))

	return (
		<div className={styles.root} tabIndex={0}>
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
					<MdSearch className={styles.icon} />
				</div>
			</div>
			<div className={styles.toolBar}>
				<div>
					<select value={filter.order.by} onChange={onOrderByChange}>
						<option value='relevance'>Relevance</option>
						<option value='title'>Title</option>
						<option value='duration'>Duration</option>
						<option value='resolution'>Resolution</option>
						<option value='epsNum'>Number of Episodes</option>
					</select>
				</div>
				<div>
					<MdOutlineExpandMore
						onClick={onAscDescClick}
						className={[
							styles.icon,
							...[filter.order.descending ? styles.descending : ''],
						].join(' ')}
					/>
				</div>
			</div>
			<div ref={titlesRef} className={styles.titles}>
				<ul>
					{filtered.map((el) => (
						<li key={el.path} data-path={el.path}>
							<NavLink
								className={({ isActive }) => (isActive ? styles.active : '')}
								to={`/explore/${encodeURI(el.path)}`}
							>
								<span>{el.title || el.path}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</div>
			<div className={styles.matches}>{filtered.length} Items</div>
		</div>
	)
}

export default ExplorerRight
