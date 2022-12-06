import React from 'react'

type Props = {
	metadata: Metadata
	onInputChange: (e: InputChange | TextAreaChange) => any
}

const EditMetadata: React.FC<Props> = ({
	metadata: { audio, duration, encoder, quality, res, source, subtitle, video },
	onInputChange,
}) => (
	<div>
		<table>
			<tbody>
				<tr>
					<th>Encoder</th>
					<td>
						<input
							type='text'
							name='encoder'
							onChange={onInputChange}
							value={encoder}
						/>
					</td>
					<th>Source</th>
					<td>
						<input
							type='text'
							name='source'
							onChange={onInputChange}
							value={source}
						/>
					</td>
				</tr>
				<tr>
					<th>Quality</th>
					<td>
						<input
							type='text'
							name='quality'
							onChange={onInputChange}
							value={quality}
						/>
					</td>
					<th>Resolution</th>
					<td>
						<input
							type='number'
							name='res'
							onChange={onInputChange}
							value={res}
						/>
					</td>
				</tr>
				<tr>
					<th>Video</th>
					<td>
						<input
							type='text'
							name='video'
							onChange={onInputChange}
							value={video}
						/>
					</td>
					<th>Audio</th>
					<td>
						<input
							type='text'
							name='audio'
							onChange={onInputChange}
							value={audio}
						/>
					</td>
				</tr>
				<tr>
					<th>Duration</th>
					<td>
						<input
							type='number'
							name='duration'
							onChange={onInputChange}
							value={duration}
						/>
					</td>
					<th>Subtitle</th>
					<td>
						<input
							type='text'
							name='subtitle'
							onChange={onInputChange}
							value={subtitle}
						/>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
)

export default EditMetadata
