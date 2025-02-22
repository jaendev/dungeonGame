import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() {
        // * Load dungeon
        this.load.image("tiles", "tiles/dungeon_tiles_extruded.png");
        this.load.tilemapTiledJSON("dungeon", "tiles/dungeon-01.json");
        
        // * Load player
        this.load.atlas("fauna", "character/fauna.png", "character/fauna.json");
        this.load.atlas("lizard", "enemies/lizard.png", "enemies/lizard.json");

        // * Load treasure
        this.load.atlas("treasure", "items/treasure.png", "items/treasure.json");
        
        // * Load health UI
        this.load.image("ui-heart-full", "ui/ui_heart_full.png");
        this.load.image("ui-heart-empty", "ui/ui_heart_empty.png");
        
        // * Load knife
        this.load.image("knife", "weapons/weapon_knife.png");
    }

    create() {
        this.scene.start("game");
    }
}