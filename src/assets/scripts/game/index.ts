import { Application, Sprite, Assets } from 'pixi.js';
import viteIcon from "../../img/vite.svg"

export async function CreateGame() {
    const app = new Application();

    await app.init();
    app.renderer.resize(window.innerWidth, window.innerHeight)

    document.body.appendChild(app.canvas);

    app.canvas.classList.add("game-camvas");

    // load the texture we need and create a sprite
    const texture = await Assets.load(viteIcon);
    const bunny = new Sprite(texture);

    // Setup the position of the bunny
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    // Rotate around the center
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // Add the bunny to the scene we are building
    app.stage.addChild(bunny);

    // Listen for frame updates
    app.ticker.add(() => {
        // each frame we spin the bunny around a bit
        bunny.rotation += 0.01;
    });
}