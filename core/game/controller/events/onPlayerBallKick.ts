import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { gameState, resetTouchCounters, checkBallSideChange } from './cos.js';

var blockArea = { xMin: -40, xMax: 40, yMin: -210, yMax: 110 }; // Obszar blocka
let lastTeamTouched: number | null = null;
let previousTeamTouched = null;


// Funkcja pomocnicza do filtrowania graczy grających w drużynach
function getActivePlayersCount() {
    var players = window.gameRoom._room.getPlayerList();
    return players.filter(player => player.team === 1 || player.team === 2).length;
}

// Funkcja sprawdzająca, czy piłka jest w obszarze blocka
function isBallInBlockArea() {
    var ballPosition = window.gameRoom._room.getBallPosition();

    // Sprawdzamy, czy ballPosition nie jest null, zanim użyjemy x i y
    if (ballPosition && ballPosition.x !== null && ballPosition.y !== null) {
        return (
            ballPosition.x >= blockArea.xMin &&
            ballPosition.x <= blockArea.xMax &&
            ballPosition.y >= blockArea.yMin &&
            ballPosition.y <= blockArea.yMax
        );
    }
    
    // Jeśli ballPosition jest null, zwracamy false
    return false;
}

export function onPlayerBallKickListener(player: PlayerObject): void {
    // Event called when a player kicks the ball.
    // records player's id, team when the ball was kicked
    var placeholderBall = {
        playerID: player.id,
        playerName: player.name,
        gameRuleName: window.gameRoom.config.rules.ruleName,
        gameRuleLimitTime: window.gameRoom.config.rules.requisite.timeLimit,
        gameRuleLimitScore: window.gameRoom.config.rules.requisite.scoreLimit,
        gameRuleNeedMin: window.gameRoom.config.rules.requisite.minimumPlayers,
        possTeamRed: window.gameRoom.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.gameRoom.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.gameRoom.winningStreak.teamID),
        streakTeamCount: window.gameRoom.winningStreak.count
    };

    if (window.gameRoom.config.rules.statsRecord === true && window.gameRoom.isStatRecord === true) { // record only when stat record mode

        window.gameRoom.playerList.get(player.id)!.matchRecord.balltouch++; // add count of ball touch in match record

        if (window.gameRoom.ballStack.passJudgment(player.team) === true && window.gameRoom.playerList.has(window.gameRoom.ballStack.getLastTouchPlayerID()) === true) {
            window.gameRoom.playerList.get(window.gameRoom.ballStack.getLastTouchPlayerID())!.matchRecord.passed++; // add count of pass success in match record
        }

        window.gameRoom.ballStack.touchTeamSubmit(player.team);
        window.gameRoom.ballStack.touchPlayerSubmit(player.id); // refresh who touched the ball in last

        window.gameRoom.ballStack.push(player.id);
        window.gameRoom.ballStack.possCount(player.team); // 1: red team, 2: blue team

    }

    var activePlayerCount = getActivePlayersCount();
    previousTeamTouched = lastTeamTouched;
    lastTeamTouched = player.team;
    // Sprawdź, czy piłka zmieniła stronę przed dotknięciem
    checkBallSideChange();

    // Sprawdź, czy piłka jest w obszarze blocka i czy blok jest dozwolony
    if (isBallInBlockArea() && gameState.blockAllowed) {
        if ((previousTeamTouched === 1 && player.team === 2) || (previousTeamTouched === 2 && player.team === 1)) {
            window.gameRoom._room.sendAnnouncement(player.name + " blocked!", null, 0xFFD700, "bold", 1);
            gameState.blockAllowed = false; // Blok został użyty, teraz jest zablokowany
            
            // Reset liczników dotknięć po bloku
            gameState.blueTeamTouches = 0;
            gameState.redTeamTouches = 0;
            gameState.ballTouchCount = 0;

            return; // Blok nie liczy się jako odbicie
        }
    }

    // Piłka została dotknięta, blok nie jest już dozwolony
    gameState.blockAllowed = false;

    if (player.team === 1) { // Red Team
        gameState.redTeamTouches++;
        gameState.blueTeamTouches = 0; // Reset odbić niebieskich, gdy czerwoni dotkną piłki
    } else if (player.team === 2) { // Blue Team
        gameState.blueTeamTouches++;
        gameState.redTeamTouches = 0; // Reset odbić czerwonych, gdy niebiescy dotkną piłki
    }

    // Zwiększ licznik odbić piłki
    gameState.ballTouchCount++;

    // Sprawdź, czy liczba odbić przekroczyła limit (3 odbicia)
    if (gameState.ballTouchCount > 3) {
        gameState.ballTouchCount = 1; // Resetuj licznik odbić
    }

    if (gameState.serving) {
        if (gameState.redTeamTouches > 1) {
            window.gameRoom._room.setDiscProperties(0, { x: -50, y: 60, xspeed: 0, yspeed: 50 });
        }
        if (gameState.blueTeamTouches > 1) 
        {
            window.gameRoom._room.setDiscProperties(0, { x: 50, y: 60, xspeed: 0, yspeed: 50 });
        }
    }

    if(player.team!=previousTeamTouched) {
        gameState.doubleTouch = false;
        gameState.tripleTouch = false;
    }
    
    if (activePlayerCount >= 4) { // 2v2 lub więcej
        if (gameState.redTeamTouches > 3) {
            window.gameRoom._room.setDiscProperties(0, { 
                x: -50,
                y: 60,
                xspeed: 0,
                yspeed: 50
            });
            resetTouchCounters();
            return;
        }
        if (gameState.blueTeamTouches > 3) {
            window.gameRoom._room.setDiscProperties(0, { 
                x: 50,
                y: 60,
                xspeed: 0,
                yspeed: 50
            });
            resetTouchCounters();
            return;
        }
    
        if (gameState.doubleTouch && gameState.lastPlayerToTouchBall && gameState.lastPlayerToTouchBall.id === player.id) {
            if (player.team === 1) {
                window.gameRoom._room.setDiscProperties(0, { 
                    x: -50, 
                    y: 60,
                    xspeed: 0,
                    yspeed: 50
                });
                resetTouchCounters();
            } else if (player.team === 2) {
                window.gameRoom._room.setDiscProperties(0, {
                    x: 50,
                    y: 60,
                    xspeed: 0,
                    yspeed: 50
                });
                resetTouchCounters();
            }
        } else {
            gameState.doubleTouch = true;
            gameState.lastPlayerToTouchBall = player;
        }
    } else if (activePlayerCount < 4) { // 1v1
        if (gameState.tripleTouch && gameState.lastPlayerToTouchBall && gameState.lastPlayerToTouchBall.id === player.id) {
            if (player.team === 1) {
                window.gameRoom._room.setDiscProperties(0, { 
                    x: -50, 
                    y: 30,
                    xspeed: 0,
                    yspeed: 50
                });
                resetTouchCounters();
            } else if (player.team === 2) {
                window.gameRoom._room.setDiscProperties(0, { 
                    x: 50,
                    y: 60,
                    xspeed: 0,
                    yspeed: 50
                });
                resetTouchCounters();
            }
        } else if (gameState.doubleTouch && gameState.lastPlayerToTouchBall && gameState.lastPlayerToTouchBall.id === player.id) {
            gameState.tripleTouch = true;
        } else {
            gameState.doubleTouch = true;
            gameState.lastPlayerToTouchBall = player;
        }
    }
}
