// Third party dependencies
import {html, Component} from '../../web_modules/htm/preact/standalone.module.js'

export default class App extends Component {
	constructor() {
		super()
	}
	render({dungeon}) {
		const room = dungeon.rooms[dungeon.index]
		return html`
			<ol>
				${dungeon.rooms.map(
					(room, index) =>
						html`
							<li>Room ${index} ${index === dungeon.index ? '(X)' : ''}</li>
						`
				)}
			</ol>
		`
	}
}