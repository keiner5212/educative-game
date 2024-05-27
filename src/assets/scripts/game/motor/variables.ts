// adaptatives
export const xIntervalRight: { [characterUID: number]: number } = {};
export const xIntervalLeft: { [characterUID: number]: number } = {};
export const yInterval: { [characterUID: number]: number } = {};
export const speedX: { [characterUID: number]: number } = {};
export const speedY: { [characterUID: number]: number } = {};
export const animating: { [characterUID: number]: string } = {};
export const isQuietInterval: { [characterUID: number]: number } = {};
export const JumperInterval: { [characterUID: number]: number } = {};

// general
export const ground = window.innerHeight - 135;
export const wallRight = window.innerWidth;
export const keys: { [key: string]: boolean } = {};
export const wallLeft = 0;