import { Sprite, Text, Container, Assets, TextStyle, Graphics } from 'pixi.js';

export async function showDialog(
    dialogSprite: string,
    dialog: string,
    x: number,
    y: number,
    width: number,
    height: number,
    onClickCallback: () => void 
) {
    const texture = await Assets.get(dialogSprite);
    texture.source.scaleMode = "nearest";

    const card = new Sprite(texture);
    card.anchor.set(0.5);
    card.width = width;
    card.height = height;

    const textStyle = new TextStyle({
        fontFamily: 'Georgia',
        fontSize: 24,
        fill: 'black',
        wordWrap: true,
        wordWrapWidth: width - 20,
    });

    const dialogText = new Text('', textStyle); 
    dialogText.anchor.set(0.5);
    dialogText.x = 0;
    dialogText.y = 0;

    const container = new Container();
    container.addChild(card);
    container.addChild(dialogText);
    container.x = x;
    container.y = y;

    const button = new Graphics();
    button.beginFill(0x12152b); 
    button.lineStyle(2, 0xffffff); 
    button.drawRect(-width/2 + 250 , height / 2 + 10, 400, 30); 
    button.endFill();
    button.interactive = true;
    button.cursor = 'pointer';
    button.on('pointerdown', onClickCallback); 

    const buttonText = new Text('Siguiente', {
        fontFamily: 'Georgia',
        fontSize: 24,
        fill: 'white',
        fontStyle: 'oblique',
    });
    buttonText.anchor.set(0.5);
    buttonText.position.set(0, height / 2 + 25); 

    button.addChild(buttonText);
    container.addChild(button);

    const textToWrite = dialog;
    let currentText = '';
    let currentIndex = 0;
    const typingInterval = 40; 

    const typingTimer = setInterval(() => {
        if (currentIndex < textToWrite.length) {
            currentText += textToWrite[currentIndex];
            dialogText.text = currentText;
            currentIndex++;
        } else {
            clearInterval(typingTimer);
        }
    }, typingInterval);

    return container;
}
