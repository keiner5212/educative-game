import { Sprite, Text, Container, Assets, TextStyle } from "pixi.js";
import "./dialog.css";
import { Constants } from "../../constants";

export async function showDialog(
	dialogSprite: string,
	dialog: string,
	x: number,
	y: number
) {
	const width = 900;
	const height = 200;

	const texture = await Assets.get(dialogSprite);
	texture.source.scaleMode = "nearest";

	const card = new Sprite(texture);
	card.anchor.set(0.5);
	card.width = width;
	card.height = height;

	const textStyle = new TextStyle({
		fontFamily: Constants.FONT_FAMILY,
		fontSize: 24,
		fill: "black",
		wordWrap: true,
		wordWrapWidth: width - 20,
	});

	const dialogText = new Text("", textStyle);
	dialogText.anchor.set(0.5);
	dialogText.x = 0;
	dialogText.y = 0;

	const container = new Container();
	container.addChild(card);
	container.addChild(dialogText);
	container.x = x;
	container.y = y;

	const textToWrite = dialog;
	let currentText = "";
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

export function createButtonAt(
	x: number,
	y: number,
	buttonText: string,
	action: () => void
) {
	const wraper = document.getElementById("root-wraper");
	if (!wraper) return;
	wraper.innerHTML += `
    <div id="dialog-button" style="top: ${y}px; left: ${x}px;">
        <button class="dialog-button button">${buttonText}</button>
    </div>`;

	document.querySelector(".dialog-button")?.addEventListener("click", () => {
		action();
		removeDialogButton();
	});
}

export function createDialogInputForm(
	x: number,
	y: number,
	buttonText: string,
	action: (value: string) => void
) {
	const wraper = document.getElementById("root-wraper");
	if (!wraper) return;
	wraper.innerHTML += `
    <div id="dialog-button" style="top: ${y}px; left: ${x}px;">
        <input class="dialog-button button" type="text" id="dialog-input" placeholder="Your answer..." >
        <button class="dialog-button">${buttonText}</button>
    </div>`;

	document.querySelector(".dialog-button")?.addEventListener("click", () => {
		action(
			(document.querySelector("#dialog-input") as HTMLInputElement).value
		);
		removeDialogButton();
	});
}

export function removeDialogButton() {
	document.querySelector("#dialog-button")?.remove();
}
