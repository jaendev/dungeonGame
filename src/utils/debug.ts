import Pahser from 'phaser'

export const debugDraw = (layer: Phaser.Tilemaps.StatycTilemapLayer, scene: Pahser.Scene) => {
    if (!layer || !scene) {
        console.error("La capa o la escena no son válidas.");
        return;
    }
    
    // Pinto en los bordes de la pantalla las paredes
    const debugGraphics = scene.add.graphics().setAlpha(0.7)
    layer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })
}