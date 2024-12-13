import {Draggable} from 'gsap/Draggable.js'
import {cardHasValidTarget} from '../game/utils-state.js'
import gsap from './animations.js'
import sounds from './sounds.js'

/** Class to add to the element we are dragging over */
const overClass = 'is-dragOver'

/** Makes the card fly back into the hand */
function animateCardToHand(draggable) {
	return gsap.to(draggable.target, {x: draggable.startX, y: draggable.startY, zIndex: 0})
}

/**
 * @param {HTMLElement} el
 * @returns {string}
 */
function getTargetStringFromElement(el) {
	const targetIndex = Array.from(el.parentNode.children).indexOf(el)
	return el.dataset.type + targetIndex
}

/**
 *
 * @param {Element} container
 * @param {Function} afterRelease
 */
export default function enableDragDrop(container, afterRelease) {
	const targets = container.querySelectorAll('.Target')
	const cards = container.querySelectorAll('.Hand .Card')

	cards.forEach((card) => {
		Draggable.create(card, {
			onDragStart() {
				sounds.selectCard()
			},
			// While dragging, highlight any targets we are dragging over.
			onDrag() {
				// this.target is the card's DOM element
				if (this.target.attributes.disabled) {
					this.endDrag()
				}
				let i = targets.length
				while (--i > -1) {
					const targetEl = targets[i]
					if (this.hitTest(targetEl, '40%')) {
						const hasValidTarget = cardHasValidTarget(
							this.target.getAttribute('data-card-target'),
							getTargetStringFromElement(targetEl),
						)
						const targetIsDead = targetEl.classList.contains('Target--isDead')
						console.log({hasValidTarget, targetIsDead}, targetEl)
						if (hasValidTarget && !targetIsDead) {
							targetEl.classList.add(overClass)
						}
					} else {
						targetEl.classList.remove(overClass)
					}
				}
			},
			onRelease() {
				const cardEl = this.target

				// Which element are we dropping on?
				let targetEl
				let i = targets.length
				while (--i > -1) {
					if (this.hitTest(targets[i], '40%')) {
						targetEl = targets[i]
						break
					}
				}

				if (!targetEl) return animateCardToHand(this)

				// If card is allowed here, trigger the callback with target, else animate back.
				const targetString = getTargetStringFromElement(targetEl)
				const targetIsDead = targetEl.classList.contains('Target--isDead')
				if (cardHasValidTarget(cardEl.getAttribute('data-card-target'), targetString) && !targetIsDead) {
					afterRelease(cardEl.dataset.id, targetString, cardEl)
				} else {
					animateCardToHand(this)
					sounds.cardToHand()
				}

				// Remove active class from any other targets.
				targets.forEach((t) => t.classList.remove(overClass))
			},
		})
	})
}
