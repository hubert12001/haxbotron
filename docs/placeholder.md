# Placeholders for interpolation
You can use placeholders for express dynamic values on the text resources.
Usage sample : `'Welcome, {playerName}!'`

## Available to use anywhere
### game rule
`gameRuleName` : name of loaded game rule

`gameRuleDescription` : description of loaded game rule

`gameRuleLimitTime` : limit time for end the game

`gameRuleLimitScore` : limit score for end the game

`gameRuleNeedMin` : minimum number of players needs for apply loaded game rule

### team statistical information
`possTeamRed`: numeric ball possession rate of red team

`possTeamBlue`: numeric ball possession rate of blue team

`streakTeamName`: name of the team hits a winning streak (string Red / Blue)

`streakTeamCount`: numeric count of winning streak

## in The event loop for ActionTicket Queue (command)
`_LaunchTime` : the time the bot launched. (stringfied date)

`ticketOwner` : the player who made this ticket. (number PlayerID)

`ticketTarget` : the player who is the target of this ticket. (number PlayerID)

`targetName`: name of the player who is the target of this ticket. (string)

`targetTeamID` : the team which is the target of this ticket. (number 0 Spec / 1 Red / 2 Blue)

`targetAfkReason`: the reason of the target of this ticket is AFK. (string)

### player statistical information for command
`targetStatsWinRate` : winning games rate of the player

`targetStatsTotal` : count of the player played.

`targetStatsWins` : count of the player winned.

`targetStatsGoals` : count of goals the player made.

`targetStatsAssists` : count of assists the player made.

`targetStatsOgs` : count of OGs the player made.

`targetStatsLosepoints` : count of points the player lose.

## in Functions in code
### function updateAdmins (funcUpdateAdmins)
`playerID` : numeric ID of the player who has been admin.

`playerName` : name of the player who has been admin.

## in The game events
### room.onPlayerJoin (onJoin), onPlayerLeave (onLeft)
`playerID` : numeric ID of this player.

`playerName` : name of this player.

`playerNameOld` : previous name of this player. It can be same as current name. Just loaded from localStorage. **Only available on onPlayerJoin event.**

`playerStatsTotal` : count of the player played.

`playerStatsWins` : count of the player winned.

`playerStatsGoals` : count of goals the player made.

`playerStatsAssists` : count of assists the player made.

`playerStatsOgs` : count of OGs the player made.

`playerStatsLosepoints` : count of points the player lose.

### room.onPlayerChat (onChat), room.onGameStart (onStart), room.onGameStop (onStop), room.onPlayerBallKick (onTouch)
`playerID` : numeric ID of this player.

`playerName` : name of this player.

### room.onPlayerTeamChange (onTeamChange)
`targetPlayerID`: numeric ID of the player who is the target. (number)
`targetPlayerName`: name of the player who is the target. (string)
`targetAfkReason`: the reason of this target player is AFK. (string)

### room.onTeamVictory (onVictory)
`teamID` : numeric ID of the team has winned.

`teamName` : name of the team has winnded. string (Red / Blue)

`redScore` : score of red team

`blueScore` : score of blue team

### room.onPlayerKicked (onKick)
`kickedID` : numberic ID of the player who is kicked

`kickedName` : name of the player who is kicked

`kickerID` : numberic ID of the player who act kicking

`kickerName` : name of the player who act kicking

`reason` : the reason why the player is kicked

### room.onStadiumChange (onStadium)
`playerID` : numeric ID of the player who changed map.

`playerName` : name of the player who changed map.

`stadiumName` : the name of loaded stadium

### room.onTeamGoal (onGoal)
`teamID` : numberic ID of the team got a score

`teamName` : name of the team got a score. string ( Red / Blue)

`scorerID` : numeric ID of the player scored

`scorerName` : name of the player scored

`assistID` : numeric ID of the player assisted

`assistName` : name of the player assisted

`ogID` : numeric ID of the player made an OG

`ogName` : name of the player made an OG