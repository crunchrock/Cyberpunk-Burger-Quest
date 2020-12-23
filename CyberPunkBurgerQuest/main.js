import Phaser from './lib/phaser.js'
import Game from './scenes/Game.js'
import GameOver from './scenes/GameOver.js'
import Title from './scenes/Title.js'
import Level2 from './scenes/Level2.js'
import Level3 from './scenes/Level3.js'
import Congratulations from './scenes/Congratulations.js'
export default new Phaser.Game({
	type: Phaser.WEBGL,
	width: 480,
	height: 800,
	scene: [Title, Game, Level2, Level3, Congratulations, GameOver],
	canvas: document.querySelector('canvas'),
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 200
			},
			debug: false
		}
	}
	 
})