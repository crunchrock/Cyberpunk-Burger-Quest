import Phaser from '../lib/phaser.js'

import Burger from '../game/burger.js'

import Badguy from '../game/burger.js'



export default class Level2 extends Phaser.Scene
{
	/** @type {Phaser.Physics.Arcade.StaticGroup} */
	platforms

	/** @type {Phaser.Physics.Arcade.Sprite} */
	player

	/** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
	cursors

	/** @type {Phaser.Physics.Arcade.Group} */
	burgers

	burgersCollected = 0

	/** @type {Phaser.GameObjects.Text} */
	burgersCollectedText

	constructor()
	{
		super('level2')
	}

	init()
	{
		this.burgersCollected = 0
	}

	preload()
	{
		this.load.image('background2', 'assets/bglevel2.jpg')
		this.load.image('platform', 'assets/ground_grass.png')
		this.load.image('brunner-stand', 'assets/burger_runner_stand.png')
		this.load.image('brunner-jump', 'assets/burger_runner_jump.png')
		this.load.image('burger', 'assets/burger.png')
		this.load.audio('cityrunnerII', 'assets/sfx/cityrunnerii.mp3')
		this.load.audio('jump', 'assets/sfx/phaseJump1.wav')
		this.load.image('badguy', 'assets/badguy.png')

		this.cursors = this.input.keyboard.createCursorKeys()
	}

	create()
	{	this.sound.play('cityrunnerII')
		this.add.image(240, 400, 'background2')
			.setScrollFactor(1, 0)

		var leve2Text = this.add.text(160, 200, 'YOU DID IT! \n Level 2! \n KEEP COLLECTING BURGERS \n CyberTown Needs You', { fontFamily: 'monospace', fontSize: 32, color: '#00ff00' });

		this.platforms = this.physics.add.staticGroup()
		// then create 5 platforms from the group
		for (let i = 0; i < 6; ++i)
		{
			const x = Phaser.Math.Between(80, 400)
			const y = 150 * i
	
			/** @type {Phaser.Physics.Arcade.Sprite} */
			const platform = this.platforms.create(x, y, 'platform')
			platform.scale = 0.3
	
			/** @type {Phaser.Physics.Arcade.StaticBody} */
			const body = platform.body
			body.updateFromGameObject()
		}

		this.player = this.physics.add.sprite(240, 320, 'brunner-stand')
			.setScale(0.7)

		this.physics.add.collider(this.platforms, this.player)
		
		this.player.body.checkCollision.up = false
		this.player.body.checkCollision.left = false
		this.player.body.checkCollision.right = false

		this.cameras.main.startFollow(this.player)
		this.cameras.main.setDeadzone(this.scale.width * 1.5)

		this.burgers = this.physics.add.group({
			classType: Burger
		})

		this.physics.add.collider(this.platforms, this.burgers)
		this.physics.add.overlap(this.player, this.burgers, this.handleCollectBurger, undefined, this)

		this.burgersCollectedText = this.add.text(240, 10, 'Collect Cheeseburgers \n to Save CyberTown', { color: '#000', fontSize: 24 })
			.setScrollFactor(0)
			.setOrigin(0.5, 0)
		
		
		this.badguys = this.physics.add.group({
			classType: Badguy
		})
		//badguy physics!
		const gotGot = () => {
			this.game.sound.stopAll()
			this.scene.start('game-over');
		}
		this.physics.add.collider(this.badguys, this.player, gotGot)
	
		}

	update(t, dt)
	{
		if (!this.player)
		{
			return
		}

		this.platforms.children.iterate(child => {
			/** @type {Phaser.Physics.Arcade.Sprite} */
			const platform = child

			const scrollY = this.cameras.main.scrollY
			if (platform.y >= scrollY + 820)
			{
				platform.y = scrollY - Phaser.Math.Between(60, 75)
				platform.body.updateFromGameObject()
				this.addBurgerAbove(platform)
				
				let spawnchance = Math.floor(Math.random() * 11)
				if(spawnchance >= 3){
					this.addBadguyAbove(platform)	
					}
				
			}
		})
		
		const touchingDown = this.player.body.touching.down

		if (touchingDown)
		{
			this.player.setVelocityY(-400)
			this.player.setTexture('brunner-jump')

			this.sound.play('jump')
		}
		//ADDING my own attempt to make sprite face left sometimes
		const facingLeft = this.player.body.velocity.x < 0
		
		if (facingLeft)
		{
			this.player.setFlipX(true)
		}

		const facingRight = this.player.body.velocity.x > 0

		if (facingRight)
		{
			this.player.setFlipX(false)
		}

		//ADDING my own cheeseburger level target at 10, 15 & 20 burgers per level
	
		if (this.burgersCollected >= 15 ) {
			this.game.sound.stopAll()
			this.scene.start('level3')
		
		}

		const vy = this.player.body.velocity.y
		if (vy > 0 && this.player.texture.key !== 'brunner-stand')
		{
			this.player.setTexture('brunner-stand')
		}

		if (this.cursors.left.isDown && !touchingDown)
		{
            this.player.setVelocityX(-200)
    
		}
		else if (this.cursors.right.isDown && !touchingDown)
		{
			this.player.setVelocityX(200)
		}
		else
		{
			this.player.setVelocityX(0)
		}
        

		this.horizontalWrap(this.player)

		const bottomPlatform = this.findBottomMostPlatform()
		if (this.player.y > bottomPlatform.y + 200)
		{
			this.game.sound.stopAll()
			this.scene.start('game-over')
		}
	}

	/**
	 * 
	 * @param {Phaser.GameObjects.Sprite} sprite 
	 */
	horizontalWrap(sprite)
	{
		const halfWidth = sprite.displayWidth * 0.5
		const gameWidth = this.scale.width
		if (sprite.x < -halfWidth)
		{
			sprite.x = gameWidth + halfWidth
		}
		else if (sprite.x > gameWidth + halfWidth)
		{
			sprite.x = -halfWidth
		}
	}
	/**
	 * 
	 * @param {Phaser.GameObjects.Sprite} sprite 
	 */
	addBadguyAbove(sprite)
	{
		const y = sprite.y - sprite.displayHeight

		/** @type {Phaser.Physics.Arcade.Sprite} */
		const badguy = this.badguys.get(sprite.x, y, 'badguy')

		badguy.setActive(true)
		badguy.setVisible(true)

		this.add.existing(badguy)

		badguy.body.setSize(badguy.width, badguy.height)

		this.physics.world.enable(badguy)

		return badguy
	}					

	/**
	 * 
	 * @param {Phaser.GameObjects.Sprite} sprite 
	 */
	addBurgerAbove(sprite)
	{
		const y = sprite.y - sprite.displayHeight

		/** @type {Phaser.Physics.Arcade.Sprite} */
		const burger = this.burgers.get(sprite.x, y, 'burger')

		burger.setActive(true)
		burger.setVisible(true)

		this.add.existing(burger)

		burger.body.setSize(burger.width, burger.height)

		this.physics.world.enable(burger)

		return burger
	}


	/**
	 * 
	 * @param {Phaser.Physics.Arcade.Sprite} player 
	 * @param {Burger} burger 
	 */
	handleCollectBurger(player, burger)
	{
		this.burgers.killAndHide(burger)

		this.physics.world.disableBody(burger.body)

		this.burgersCollected++

		this.burgersCollectedText.text = `Cheeseburgers: ${this.burgersCollected}`
	}

	findBottomMostPlatform()
	{
		const platforms = this.platforms.getChildren()
		let bottomPlatform = platforms[0]

		for (let i = 1; i < platforms.length; ++i)
		{
			const platform = platforms[i]

			// discard any platforms that are above current
			if (platform.y < bottomPlatform.y)
			{
				continue
			}

			bottomPlatform = platform
		}

		return bottomPlatform
	}
}