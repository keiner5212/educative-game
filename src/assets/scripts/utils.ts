import MobileDetect from 'mobile-detect';

export function closeModal() {
    document.querySelector('.modal')?.classList.remove('is-active');
}

export function closeModalXButton() {
    document.location.href="https://github.com/keiner5212/educative-game.git"
}

function removeModal() {
    document.querySelector('.modal')?.remove();
}

export function openModal() {
    document.querySelector('.modal')?.classList.add('is-active');
}

export function accept(accept: any) {
    accept();
    closeModal();
    removeModal();
}

export function decline(decline: any) {
    decline();
    closeModal();
    removeModal();
}

export function IsMobile() {
    const md = new MobileDetect(window.navigator.userAgent);
    if (md.mobile()) {
        return true
    }
    return false
}