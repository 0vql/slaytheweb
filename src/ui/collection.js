import {html, render} from '../main.js'
import cards from '../content/cards.js'
import {Card} from './cards.js'

const CollectionPage = (props) => html`
	<article class="Splash">
		<p><a href="/" class="Button">Back</a></p>
		<h2>${cards.length} Card Collection</h2>
		<div class="Cards Cards--grid">${cards.map((card) => Card(card))}</div>
	</article>
`

render(html`<${CollectionPage} cards=${cards} />`, document.querySelector('#Cards'))
