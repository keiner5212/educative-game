import { setMenuActions } from "../game/menu";
import { playMusic, setVolume, stopMusic } from "../game/motor/music";
import { accept, closeModal, closeModalXButton, decline } from "../utils";
import "../../styles/loader.css";

export function createModal(
	title: string,
	message: string,
	okMessage: string,
	decMessage: string,
	acceptF: any,
	declineF: any
) {
	const wraper = document.getElementById("root-wraper");
	if (!wraper) return;
	wraper.innerHTML += `
        <div class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">${title}</p>
                    <button id="close-modal" class="delete" aria-label="close"><i class="fa-regular fa-circle-xmark"></i></button>
                </header>
                <section class="modal-card-body">
                    <p>${message}</p>
                </section>
                <footer class="modal-card-foot">
                    <button id="modal-accept-button" class="button is-success">${okMessage}</button>
                    <button id="modal-decline-button" class="button">${decMessage}</button>
                </footer>
            </div>
        </div>
    `;

	document.getElementById("close-modal")?.addEventListener("click", () => {
		closeModalXButton();
	});

	document
		.getElementById("modal-accept-button")
		?.addEventListener("click", () => {
			accept(acceptF);
		});

	document
		.getElementById("modal-decline-button")
		?.addEventListener("click", () => {
			decline(declineF);
		});
}

export function settings() {
	const wraper = document.getElementById("root-wraper");
	if (!wraper) return;
	wraper.innerHTML += `
        <div class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Settings</p>
                    <button id="close-modal" class="delete" aria-label="close"><i class="fa-regular fa-circle-xmark"></i></button>
                </header>
                <section class="modal-card-body">

                    <div class="PB-range-slider-div">
                        <label for="volume-range">Volume (music): </label>
                        <input type="range" min="0" max="100" value=${localStorage.getItem(
							"volume"
						)} class="PB-range-slider" id="volume-range">
                        <p class="PB-range-slidervalue">${localStorage.getItem(
							"volume"
						)}%</p>
                        <button id="toggle-volume-button" class="PB-volume-button"><i class="fa-solid fa-volume-xmark"></i></button>
                    </div>

                </section>
                <footer class="modal-card-foot">
                    <button id="modal-accept-button" class="button is-success">Apply</button>
                    <button id="modal-decline-button" class="button">Cancel</button>
                </footer>
            </div>
        </div>
    `;

	const slider = document.getElementById("volume-range") as HTMLInputElement;

	if (localStorage.getItem("music") === "false") {
		stopMusic();
		const quitVolumeButton = document.getElementById(
			"toggle-volume-button"
		);
		if (quitVolumeButton)
			quitVolumeButton.style.backgroundColor = "#00000032";

		slider.disabled = true;
	}

	slider?.addEventListener("input", () => {
		const volume = document.querySelector(".PB-range-slidervalue");
		if (slider && volume) {
			volume.innerHTML = `${slider ? slider.value : 0}%`;
		}
	});

	document.getElementById("close-modal")?.addEventListener("click", () => {
		closeModal();
		setMenuActions();
	});

	document
		.getElementById("modal-accept-button")
		?.addEventListener("click", () => {
			const slider = document.getElementById(
				"volume-range"
			) as HTMLInputElement;
			if (slider) {
				setVolume(parseInt(slider.value));
			}

			closeModal();
			setMenuActions();
		});

	document
		.getElementById("modal-decline-button")
		?.addEventListener("click", () => {
			closeModal();
			setMenuActions();
		});

	const quitVolumeButton = document.getElementById("toggle-volume-button");
	if (quitVolumeButton) {
		quitVolumeButton.addEventListener("click", () => {
			if (!slider.disabled) {
				stopMusic();
				quitVolumeButton.style.backgroundColor = "#00000032";
				localStorage.setItem("music", "false");
			} else {
				playMusic();
				quitVolumeButton.style.backgroundColor = "#fff";
				localStorage.setItem("music", "true");
			}
			slider.disabled = !slider.disabled;
		});
	}
}

export function credits() {
	const wraper = document.getElementById("root-wraper");
	if (!wraper) return;
	wraper.innerHTML += `
    <div class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Credits</p>
                <button id="close-modal" class="delete" aria-label="close"><i class="fa-regular fa-circle-xmark"></i></button>
            </header>
            <section class="modal-card-body">
                <p class="modal-card-center-text">
                Creado por
                <br/>
                A.Marcela Rodrigues y Lewys Moscote estudiantes 1 semestre de Diseño Grafico 
                <br/>
                Con la colaboración de Keiner Alvarado, estudiante 8 semestre de ingeniería de sistema de la Unimagdalena
                <br/>
                <br/>
                A cargo de
                <br/>
                Docente Maria Consuelo 
                Pensamiento logico
                Areandina 20241
                </p>
            </section>
            <footer class="modal-card-foot">
                <button id="modal-accept-button" class="button is-success">OK</button>
                <button id="modal-decline-button" class="button">Close</button>
            </footer>
        </div>
    </div>
`;

	document
		.getElementById("modal-decline-button")
		?.addEventListener("click", () => {
			closeModal();
			setMenuActions();
		});

	document.getElementById("close-modal")?.addEventListener("click", () => {
		closeModal();
		setMenuActions();
	});

	document
		.getElementById("modal-accept-button")
		?.addEventListener("click", () => {
			closeModal();
			setMenuActions();
		});
}

export function loader() {
	const wraper = document.getElementById("root-wraper");
	if (!wraper) return;
	wraper.innerHTML += `
	<div class="modal">
		<div class="modal-background">
			<div class="spinner-container">
				<div class="spinner">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		</div>
	</div>
	`;
}
