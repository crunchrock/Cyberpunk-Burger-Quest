import Phaser from '../lib/phaser.js'
export default class Congratulations extends Phaser.Scene
{
	constructor()
	{
		super('congratulations')
	}

	preload()
	{
       this.load.image('congratulations', '/assets/congratulations.jpg')
       
	}

	create()
	{
		const width = this.scale.width
		const height = this.scale.height

        this.add.image(240, 400, 'congratulations')
        

		this.input.keyboard.once('keydown-' + 'Enter', () => {
			this.game.sound.stopAll()
			this.scene.start('game')
		})
	}
}