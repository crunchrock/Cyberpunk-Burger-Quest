import Phaser from '../lib/phaser.js'
export default class GameOver extends Phaser.Scene
{
	constructor()
	{
		super('game-over');
	}

	preload()
	{
        this.load.image('gameover', 'assets/gameover.png');
        this.load.audio('ohno', 'assets/sfx/ohno.mp3');
	}

	create()
	{
        this.add.image(240, 400, 'gameover');
        this.sound.play('ohno');
		this.input.keyboard.once('keydown', () => {
			this.scene.start('title');
		})
	}
}