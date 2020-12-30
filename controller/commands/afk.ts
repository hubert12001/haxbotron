import * as Tst from "../Translator";
import * as BotSettings from "../../resources/settings.json";
import * as LangRes from "../../resources/strings";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { TeamID } from "../../model/GameObject/TeamID";
import { getUnixTimestamp } from "../Statistics";
import { roomActivePlayersNumberCheck } from "../../model/OperateHelper/Quorum";

export function cmdAfk(byPlayer: PlayerObject, message?: string): void {
    var placeholder = {
        targetName: byPlayer.name
        ,ticketTarget: byPlayer.id
        ,targetAfkReason: ''
        ,gameRuleNeedMin: window.settings.game.rule.requisite.minimumPlayers,
    }
    if (window.playerList.get(byPlayer.id)!.permissions.afkmode === true) { // if this player is AFK
        window.playerList.get(byPlayer.id)!.permissions.afkmode = false; // return to active mode
        window.playerList.get(byPlayer.id)!.permissions.afkreason = ''; // init
        window.playerList.get(byPlayer.id)!.afktrace = { exemption: false, count: 0 }; // reset for afk trace
        
        if(BotSettings.antiAFKFlood === true && window.playerList.get(byPlayer.id)!.permissions.mute === true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.unAfk, placeholder), byPlayer.id, 0x479947, "normal", 1);
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.muteNotifyWarn, placeholder), byPlayer.id, 0xFF7777, "normal", 2);
        } else {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.unAfk, placeholder), null, 0x479947, "normal", 1);
        }
    } else { // if this player is not AFK (in active)
        if(BotSettings.antiAFKAbusing === true && window.playerList.get(byPlayer.id)!.team !== TeamID.Spec) {
            // if in game situation and this player is in team, prevent AFK abusing
            window.room.sendAnnouncement(LangRes.antitrolling.afkAbusing.cannotReason, byPlayer.id, 0xFF7777, "normal", 2); //warn
            return; //abort this event
        }
        window.room.setPlayerTeam(byPlayer.id, TeamID.Spec); // Moves this player to Spectators team.
        window.room.setPlayerAdmin(byPlayer.id, false); // disqulify admin permission
        window.playerList.get(byPlayer.id)!.admin = false;
        window.playerList.get(byPlayer.id)!.permissions.afkmode = true; // set afk mode
        window.playerList.get(byPlayer.id)!.permissions.afkdate = getUnixTimestamp(); // set afk beginning time stamp
        window.playerList.get(byPlayer.id)!.afktrace = { exemption: false, count: 0}; // reset for afk trace

        if(message !== undefined) { // if the reason is not skipped
            window.playerList.get(byPlayer.id)!.permissions.afkreason = message; // set reason
            placeholder.targetAfkReason = message; // update placeholder
        }
        
        if(BotSettings.antiAFKFlood === true && window.playerList.get(byPlayer.id)!.permissions.mute === true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.setAfk, placeholder), byPlayer.id, 0x479947, "normal", 1);
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.muteNotifyWarn, placeholder), byPlayer.id, 0xFF7777, "normal", 2);
        } else {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.setAfk, placeholder), null, 0x479947, "normal", 1);
        }

        if(BotSettings.afkCommandAutoKick === true) {
            window.room.sendAnnouncement(LangRes.command.afk._WarnAfkTooLong, byPlayer.id, 0x479947, "normal", 1);
        }
    }
    // check number of players and change game mode
    if (window.settings.game.rule.statsRecord === true && roomActivePlayersNumberCheck() >= window.settings.game.rule.requisite.minimumPlayers) {
        if (window.isStatRecord !== true) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.startRecord, placeholder), null, 0x00FF00, "normal", 0);
            window.isStatRecord = true;
        }
    } else {
        if (window.isStatRecord !== false) {
            window.room.sendAnnouncement(Tst.maketext(LangRes.command.afk.stopRecord, placeholder), null, 0x00FF00, "normal", 0);
            window.isStatRecord = false;
        }
    }
}
