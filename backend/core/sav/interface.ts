namespace PKEdit.Core {
    export namespace SAV {
        export interface ICommonSave extends Core.SAV.SAVObject {
            getPlayerPokepuffData();
            getPlayerPocketData();
            getPlayerQuickAccessItems();
            getPlayerMapData();
            getPlayerPlayTime();
            getPlayerWardrobe();
            getWorldData();
            getPlayerTrainerInformation();
            getPlayerBoxMetadata();
            getPlayerBattleBox();
            getPlayerPSSFriends();
            getPlayerPSSAcquaintances();
            getPlayerPSSPasserby();
            getPlayerTrainerCard();
            getPlayerParty();
            getWorldEventFlags();
            getPlayerPokedex();
            getPlayerZRStorage();
            getPlayerOPowerFlags();
            getPlayerMetadata();
            getPlayerGTSCache();
            getWorldEncounterData();
            getPlayerNetworkData();
            getPlayerHallOfFameData();
            getPlayerMaisonData();
            getPlayerDaycareData();
            getWorldBerryData();
            getPlayerWondercardData();
            //getAnistarOldManStorage();
            getPlayerFriendSafariData();
            getPlayerPSSExtraData();
            getPlayerPSSExtraFriendData();
            getPlayerSupertrainingData();
            getPlayerPKBankGifts();
            getPlayerPGLGifts();
            getPlayerPCBoxes();
            getPlayerPGLImageCache();

            ///

            setPlayerPokepuffData(): boolean;
            setPlayerPocketData(): boolean;
            setPlayerQuickAccessItems(): boolean;
            setPlayerMapData(): boolean;
            setPlayerPlayTime(): boolean;
            setPlayerWardrobe(): boolean;
            setWorldData(): boolean;
            setPlayerTrainerInformation(): boolean;
            setPlayerBoxMetadata(): boolean;
            setPlayerBattleBox(): boolean;
            setPlayerPSSFriends(): boolean;
            setPlayerPSSAcquaintances(): boolean;
            setPlayerPSSPasserby(): boolean;
            setPlayerTrainerCard(): boolean;
            setPlayerParty(): boolean;
            setWorldEventFlags(): boolean;
            setPlayerPokedex(): boolean;
            setPlayerZRStorage(): boolean;
            setPlayerOPowerFlags(): boolean;
            setPlayerMetadata(): boolean;
            setPlayerGTSCache(): boolean;
            setWorldEncounterData(): boolean;
            setPlayerNetworkData(): boolean;
            setPlayerHallOfFameData(): boolean;
            setPlayerMaisonData(): boolean;
            setPlayerDaycareData(): boolean;
            setWorldBerryData(): boolean;
            setPlayerWondercardData(): boolean;
            //setAnistarOldManStorage(): boolean;
            setPlayerFriendSafariData(): boolean;
            setPlayerPSSExtraData(): boolean;
            setPlayerPSSExtraFriendData(): boolean;
            setPlayerSupertrainingData(): boolean;
            setPlayerPKBankGifts(): boolean;
            setPlayerPGLGifts(): boolean;
            setPlayerPCBoxes(): boolean;
            setPlayerPGLImageCache(): boolean;
        }

        export interface IXYSave {
            getAnistarOldManStorage();
        }

        export interface IORASSave {

        }
    }
}