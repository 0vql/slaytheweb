import test from 'ava'

import {createTestDungeon} from '../public/content/dungeon-encounters'
import actions from '../public/game/actions'
import Dungeon from '../public/game/dungeon'
import {MonsterRoom, Monster} from '../public/game/dungeon-rooms'
import {getCurrRoom, isCurrentRoomCompleted, isDungeonCompleted} from '../public/game/utils'

const a = actions

test('can create rooms with many monsters', (t) => {
	const room = new MonsterRoom(new Monster(), new Monster())
	t.is(room.monsters.length, 2)
})

test('can create a dungeon', (t) => {
	const d = Dungeon({rows: 5, columns: 1})
	t.is(d.graph.length, 5 + 2) // +2 because start+end
})

test('can set a dungeon', (t) => {
	const dungeon = Dungeon()
	let state = a.createNewGame()
	state = a.setDungeon(state, dungeon)
	t.deepEqual(state.dungeon.id, dungeon.id, 'setting dungeon works')
})

test('we know when a monster room is won', (t) => {
	let state = a.createNewGame()
	state = a.setDungeon(state, createTestDungeon())
	state.dungeon.y = 1
	t.false(isCurrentRoomCompleted(state))
	getCurrRoom(state).monsters[0].currentHealth = 0
	t.true(isCurrentRoomCompleted(state))
})

test('we know when a monster room with many monsters is won', (t) => {
	let state = a.createNewGame()
	state = a.setDungeon(state, Dungeon({rows: 1, columns: 1}))
	state.dungeon.graph[1][0].room = new MonsterRoom(new Monster(), new Monster())
	state.dungeon.y = 1

	t.false(isCurrentRoomCompleted(state))
	t.false(isDungeonCompleted(state))

	getCurrRoom(state).monsters[0].currentHealth = 0
	t.false(isCurrentRoomCompleted(state), 'one more to kill')

	getCurrRoom(state).monsters[1].currentHealth = 0
	t.true(isCurrentRoomCompleted(state))
	t.true(isDungeonCompleted(state))
})

test.todo('we know when a campfire has been used')

test('we can navigate a dungeon', (t) => {
	let state = a.createNewGame()
	state = a.setDungeon(state, Dungeon())
	t.is(state.dungeon.x, 0)
	t.is(state.dungeon.y, 0)
	// Go through the next room.
	const nextState = a.move(state, {move: {x: 0, y: 1}})
	t.is(nextState.dungeon.x, 0)
	t.is(nextState.dungeon.y, 1)
})
