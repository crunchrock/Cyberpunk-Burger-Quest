import Phaser from '../lib/phaser.js'
export default class Title extends Phaser.Scene
{
	constructor()
	{
		super('title')
	}

    preload()
	{
        this.load.image('titlescreen', 'assets/titlescreen.jpg')
		this.load.audio('rain', 'assets/sfx/rain.mp3')
	}

	create()
	{
		const width = this.scale.width
		const height = this.scale.height

        this.add.image(240, 400, 'titlescreen')
        this.sound.play('rain')

		this.input.keyboard.once('keydown', () => {
			this.game.sound.stopAll()
			this.scene.start('game')
		})
	}
}