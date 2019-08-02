export class KickStack {
    /*
    KickStack is a Stack for tracing who kicked the ball.
    It can be used for processing who goaled, who made OG, and so on.
    */

    // single ton pattern 
    private static instance: KickStack = new KickStack();
    private _store: number[] = [];
    private ballPossession = {
        red: 0,
        blue: 0
    };
    private lastTouched = {
        id: 0,
        team: 0
    };

    private KickStack<Number>() { } // not use
    public static getInstance(): KickStack {
        if (this.instance == null) {
            this.instance = new KickStack();
        }
        return this.instance;
    }
    
    push(playerID: number): void {
        this._store.push(playerID);
    }
    pop(): number | undefined {
        return this._store.pop();
    }
    clear(): void {
        this._store = []; // clear
    }
    
    initTouchInfo(): void {
        this.lastTouched = {
            id: 0,
            team: 0
        };
    }
    getLastTouchPlayerID(): number {
        return this.lastTouched.id; // playerID
    }
    touchPlayerSubmit(id: number) { // playerID
        this.lastTouched.id = id;
    }
    touchTeamSubmit(team: number) { // 1: red team, 2: blue team
        this.lastTouched.team = team;
    }
    passJudgment(team: number): boolean { // 1: red team, 2: blue team
        if(this.lastTouched.team == team) {
            return true;
        } else {
            return false;
        }
    }

    possCount(team: number): void { // 1: red team, 2: blue team
        if(team == 1) { 
            this.ballPossession.red++;
        } else if(team == 2) {
            this.ballPossession.blue++;
        }
    }
    possCalculate(team: number): number { // 1: red team, 2: blue team
        if(this.ballPossession.red == 0 && this.ballPossession.blue == 0) {
            return 0;
        } else {
            if(team == 1) {
                return Math.round((this.ballPossession.red / (this.ballPossession.red + this.ballPossession.blue)) * 100);
            } else if(team == 2) {
                return Math.round((this.ballPossession.blue / (this.ballPossession.red + this.ballPossession.blue)) * 100);
            }
        }
        return 0;
    }
    possClear(): void {
        this.ballPossession = {red: 0, blue: 0};
    }
}