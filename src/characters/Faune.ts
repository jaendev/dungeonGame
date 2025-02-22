import Phaser from "phaser";
import Chest from "../items/Chest";

import { sceneEvents } from "../events/EventsCenter";

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            faune(x: number, y: number, texture: string, frame?: string | number): Faune
        }
    }
}

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD
}

export class Faune extends Phaser.Physics.Arcade.Sprite {

    private healthState = HealthState.IDLE
    private damageTime = 0
    private knives?: Phaser.Physics.Arcade.Group
    private activeChest?: Chest

    private _health = 3
    private _coins = 0

    get health(): number {
        return this._health
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.anims.play('fauna-idle-down', true);
    }

    setKnife(knives: Phaser.Physics.Arcade.Group): void {
        this.knives = knives
    }

    setChest(chest: Chest): void {
        this.activeChest = chest
    }

    handleDamage(direction: Phaser.Math.Vector2): void {

        if (this._health <= 0) {
            return
        }

        if (this.healthState === HealthState.DAMAGE) {
            return
        }

        --this._health

        if (this._health <= 0) {
            this.healthState = HealthState.DEAD
            this.anims.play('fauna-faint')
            this.setVelocity(0, 0)
        } else {
            this.setVelocity(direction.x, direction.y)

            this.setTint(0xff0000)

            this.healthState = HealthState.DAMAGE
            this.damageTime = 0
        }
    }

    private throwKnive() {
        if (!this.knives) {
            return
        }

        const knife = this.knives.get(this.x, this.y, 'knife') as Phaser.Physics.Arcade.Image

        if (!knife) {
            return
        }

        const parts = this.anims.currentAnim.key.split('-')
        const direction = parts[2]

        const vec = new Phaser.Math.Vector2(0, 0)
        switch (direction) {
            case 'up':
                vec.y = -1
                break

            case 'down':
                vec.y = 1
                break

            case 'side':
                if (this.scaleX < 0) {
                    vec.x = -1
                } else {
                    vec.x = 1
                }
                break

            default:
        }
        const angle = vec.angle()

        knife.setActive(true)
        knife.setVisible(true)

        knife.setRotation(angle)

        knife.x += vec.x * 16
        knife.y += vec.y * 16

        knife.setVelocity(vec.x * 300, vec.y * 300)
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        switch (this.healthState) {
            case HealthState.IDLE:

                break
            case HealthState.DAMAGE:
                this.damageTime += delta

                if (this.damageTime >= 250) {
                    this.healthState = HealthState.IDLE
                    this.setTint(0xffffff)
                    this.damageTime = 0
                }
                break
        }
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {


        if (this.healthState === HealthState.DAMAGE || this.healthState === HealthState.DEAD) {
            return
        }

        if (!cursors) {
            return
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
            if (this.activeChest) {
                const coins = this.activeChest.open()
                this._coins += coins

                sceneEvents.emit('player-coins-changed', this._coins)
            } else {
                this.throwKnive()
            }
            return
        }

        const speed = 100

        const leftDown = cursors.left?.isDown
        const rightDown = cursors.right?.isDown
        const upDown = cursors.up?.isDown
        const downDown = cursors.down?.isDown

        if (leftDown && upDown) {
            this.anims.play('fauna-run-up', true);
            this.setVelocity(-speed / 1.4, -speed / 1.4);

            this.scaleX = -1;
            this.body.offset.x = 24;
        } else if (leftDown && downDown) {
            this.anims.play('fauna-run-down', true);
            this.setVelocity(-speed / 1.4, speed / 1.4);

            this.scaleX = -1;
            this.body.offset.x = 24;
        } else if (rightDown && upDown) {
            this.anims.play('fauna-run-up', true);
            this.setVelocity(speed / 1.4, -speed / 1.4);

            this.scaleX = 1;
            this.body.offset.x = 8;
        } else if (rightDown && downDown) {
            this.anims.play('fauna-run-down', true);
            this.setVelocity(speed / 1.4, speed / 1.4);

            this.scaleX = 1;
            this.body.offset.x = 8;
        } else if (leftDown) {
            this.anims.play('fauna-run-side', true);
            this.setVelocity(-speed, 0);

            this.scaleX = -1;
            this.body.offset.x = 24;
        } else if (rightDown) {
            this.anims.play('fauna-run-side', true);
            this.setVelocity(speed, 0);

            this.scaleX = 1;
            this.body.offset.x = 8;
        } else if (upDown) {
            this.anims.play('fauna-run-up', true);
            this.setVelocity(0, -speed);

        } else if (downDown) {
            this.anims.play('fauna-run-down', true);
            this.setVelocity(0, speed);
            
        } else {
            const lastPosition = this.anims.currentAnim.key.split('-');
            lastPosition[1] = 'idle';
            this.anims.play(lastPosition.join('-'), true);
            
            this.setVelocity(0, 0);
        }

        if (leftDown || rightDown || upDown || downDown) {
            this.activeChest = undefined
        }

    }

}

Phaser.GameObjects.GameObjectFactory.register('faune', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    let sprite = new Faune(this.scene, x, y, texture, frame);
    this.displayList.add(sprite);
    this.updateList.add(sprite);
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)
    return sprite;
});
