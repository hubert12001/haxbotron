import { PlayerObject } from "../../model/GameObject/PlayerObject";

const gameState = {
    lastPlayerToTouchBall: null as PlayerObject | null,
    doubleTouch: false,
    tripleTouch: false,
    blockAllowed: false,
    ballTouchCount: 0,
    blueTeamTouches: 0,
    redTeamTouches: 0,
    ballLastPosition: { x: 0, y: 0 },
    servingTeam: 2,
    serving: false,
    servingBlockArea: false
};

function resetTouchCounters() {
    gameState.lastPlayerToTouchBall = null;
    gameState.doubleTouch = false;
    gameState.tripleTouch = false;
    gameState.blockAllowed = false;
    gameState.ballTouchCount = 0;
    gameState.blueTeamTouches = 0;
    gameState.redTeamTouches = 0;
}

function checkBallSideChange() {
    var ballPosition = window.gameRoom._room.getBallPosition();
    
    if (!ballPosition || ballPosition.x === null || ballPosition.y === null) {
        console.error("Nie można pobrać pozycji piłki.");
        return;
    }
    // Jeśli piłka zmieniła stronę boiska (np. przeszła z x < 0 na x > 0 lub odwrotnie)
    if (!gameState.ballLastPosition) {
        gameState.ballLastPosition = { x: 0, y: 0 };
    }

    // Sprawdzenie, czy piłka zmieniła stronę boiska
    if ((ballPosition.x > -10 && gameState.ballLastPosition.x <= -10) || (ballPosition.x < 10 && gameState.ballLastPosition.x >= 10)) {
        gameState.blockAllowed = true; // Blok jest dozwolony zaraz po zmianie strony
        gameState.serving = false;
    }

    // Zaktualizowanie ostatniej pozycji piłki
    gameState.ballLastPosition = { x: ballPosition.x, y: ballPosition.y };
}

function serveBall() { //
    gameState.serving =true;
    gameState.servingBlockArea = true;
    if (gameState.servingTeam === 1) { // Red Team serwuje
        window.gameRoom._room.setDiscProperties(0, { x: -400, y: 0, xspeed: 2, yspeed: -10 }); // Podbij piłkę po lewej stronie
    } else if (gameState.servingTeam === 2) { // Blue Team serwuje
        window.gameRoom._room.setDiscProperties(0, { x: 400, y: 0, xspeed: -2, yspeed: -10 }); // Podbij piłkę po prawej stronie
    }
}
// Eksportowanie obiektu i funkcji, aby można było używać w innych plikach
export { gameState, resetTouchCounters, checkBallSideChange, serveBall };
