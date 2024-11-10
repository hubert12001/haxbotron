import { resetTouchCounters, serveBall } from './cos.js';

export function onPositionsResetListener(): void {
    resetTouchCounters();
    setTimeout(serveBall, 1000);
}