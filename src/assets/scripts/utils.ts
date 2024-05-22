import MobileDetect from 'mobile-detect';

export function closeModal() {
    document.querySelector('.modal')?.classList.remove('is-active');
    document.querySelector('.modal')?.classList.add('is-closing');
    removeModal();
}

export function closeModalXButton() {
    document.location.href = "https://github.com/keiner5212/educative-game.git"
}

function removeModal() {
    setTimeout(() => {
        document.querySelector('.modal')?.remove();
    }, 500);
}

export function openModal() {
    document.querySelector('.modal')?.classList.add('is-active');
}

export function accept(accept: any) {
    accept();
    closeModal();
}

export function decline(decline: any) {
    decline();
    closeModal();
}

export function IsMobile() {
    const md = new MobileDetect(window.navigator.userAgent);
    if (md.mobile()) {
        return true
    }
    return false
}

export function removeBackground() {
    document.getElementById('animated-background')?.remove();
}