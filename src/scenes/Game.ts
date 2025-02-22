import Phaser from 'phaser'
import { debugDraw } from '../utils/debug'
import { createLizardAnims } from '../anims/EnemyAnims'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createChestAnims } from '../anims/TreasureAnims'

import Lizard from '../enemies/Lizard'
import '../characters/Faune'
import { Faune } from '../characters/Faune'

import { sceneEvents } from '../events/EventsCenter'

import Chest from '../items/Chest'

export default class Game extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private player!: Faune
    private knives!: Phaser.Physics.Arcade.Group
    private lizards!: Phaser.Physics.Arcade.Group

    private playerLizardsCollider?: Phaser.Physics.Arcade.Collider

    constructor() {
        super('game')
    }

    preload(): void {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(): void {
        this.scene.run('game-ui')

        createCharacterAnims(this.anims)
        createLizardAnims(this.anims)
        createChestAnims(this.anims)
        
        const map = this.make.tilemap({ key: 'dungeon' })
        const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)

        map.createLayer('Ground', tileset)

        this.knives = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 3
        })

        // * HERO CHARACTER

        this.player = this.add.faune(40, 45, 'fauna')

        this.player.setKnife(this.knives)

        const wallsLayer = map.createLayer('Walls', tileset)

        
        wallsLayer.setCollisionByProperty({ collides: true })
        

        const chests = this.physics.add.staticGroup({
            classType: Chest
        })
        const chestsLayer = map.getObjectLayer('Chests')
        chestsLayer.objects.forEach((chestObject) => {
            chests.get(chestObject.x! + chestObject.width! * 0.5, chestObject.y! - chestObject.height! * 0.5, 'treasure')
        })

        // I set the limits of the camera to match the size
        // of the map in pixels so that the camera moves within the limits of the map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.startFollow(this.player, true)

        // Lizard enemy
        this.lizards = this.physics.add.group({
            classType: Lizard,
            createCallback: (go) => {
                const lizGO = go as Lizard
                lizGO.body.onCollide = true
            }
        })

        const lizardsLayer = map.getObjectLayer('Lizards')
        lizardsLayer.objects.forEach((lizardObject) => {
            this.lizards.get(lizardObject.x! + lizardObject.width! * 0.5, lizardObject.y! - lizardObject.height! * 0.5, 'lizard')
        })

        // * Collision

        // Player collision
        this.physics.add.collider(this.player, wallsLayer)

        // Lizard collision
        this.physics.add.collider(this.lizards, wallsLayer)

        // Chest collision
        this.physics.add.collider(this.player, chests, this.handlePlayerChestCollision, undefined, this)
        this.physics.add.collider(this.lizards, chests)

        // Knife collision
        this.physics.add.collider(this.knives, wallsLayer, this.handleKnifeWallCollision, undefined, this)
        this.physics.add.collider(this.knives, this.lizards, this.handleKnifeLizardCollision, undefined, this)

        this.playerLizardsCollider = this.physics.add.collider(this.lizards, this.player, this.handlePlayerLizardCollision, undefined, this)
    }

    private handlePlayerChestCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const chest = obj2 as Chest
        this.player.setChest(chest)
    }

    private handleKnifeWallCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        
        this.knives.kill(obj1);
        
        this.knives.setVisible(true); 
        
        setTimeout(() => {
            this.knives.setVisible(false); 
            this.knives.remove(obj1);
        }, 2000);
    }

    private handleKnifeLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        // Delete knive and hide
        this.knives.killAndHide(obj1);
        this.knives.remove(obj1); // <- I remove the knife from the group to prevent it from continuing to have physical

        // Delete lizard
        const lizard = this.lizards.killAndHide(obj2);
        
        // Verify if the lizard was deleted
        if (lizard === null || lizard === undefined) {            
            this.lizards.remove(obj2); // <- I remove the lizard from the group of lizards to prevent it from continuing to have physics 
        }
    }

    private handlePlayerLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const lizard = obj2 as Lizard

        const directionX = this.player.x - lizard.x
        const directionY = this.player.y - lizard.y

        const direction = new Phaser.Math.Vector2(directionX, directionY).normalize().scale(200)

        this.player.handleDamage(direction)

        sceneEvents.emit('player-health-changed', this.player.health)

        if (this.player.health <= 0) {
            this.playerLizardsCollider.destroy()
        }
    }

    update(time: number, delta: number): void {

        if (this.player) {
            this.player.update(this.cursors)
        }

    }
}