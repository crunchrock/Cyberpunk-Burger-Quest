
import Phaser from '../lib/phaser.js'

export default class Burger extends Phaser.Physics.Arcade.Sprite
{
	/**
	 * @param {Phaser.Scene} scene 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {string} texture 
	 */
	constructor(scene, x, y, texture = 'burger')
	{
		super(scene, x, y, texture)

		this.setScale(.7)
	}
}


export class Badguy extends Phaser.Physics.Arcade.Sprite
{
	/**
	 * @param {Phaser.Scene} scene 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {string} texture 
	 */
	constructor(scene, x, y, texture = 'badguy')
	{
		super(scene, x, y, texture)

		this.setScale(5)
	}
}					
