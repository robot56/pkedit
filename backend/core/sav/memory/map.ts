namespace PKEdit.Core {
    export namespace SAV.Memory {

        export namespace XYMap {
            // Array [address, bits]

            export const INVENTORY_POKEPUFFS = [0x5400, 1];

            export const POCKET_ITEMS = [0x5800, 0x640];
            export const POCKET_KEY_ITEMS = [0x05E40, 0x180];
            export const POCKET_TMS = [0x05FC0, 0x180];
            export const POCKET_MEDICINE = [0x06168, 0x1A8];
            export const POCKET_BERRIES = [0x06268, 0x100];

            export const QUICK_ACCESS_ITEMS = [0x06400, 0x2C];

            //export const TRAINER_STATS = [0x6400, 0x150];

            export const MAP_ID = [0x06802, 2];
            export const MAP_X_COORDINATE = [0x06810, 4];
            export const MAP_Y_COORDINATE = [0x06814, 4];
            export const MAP_Z_COORDINATE = [0x06818, 4];
            // map data is stored twice
            export const MAP_ID_2 = [0x068F4, 2];
            export const MAP_X_COORDINATE_2 = [0x06904, 4];
            export const MAP_Y_COORDINATE_2 = [0x06808, 4];
            export const MAP_Z_COORDINATE_2 = [0x0680C, 4];

            export const PLAY_TIME = [0x06C00, 8];

            export const WARDROBES = [0x06E00, 0x1C0];

            export const WORLD_DATA = [0x07400, 0x2100];

            export const TRAINER_INFORAMTION = [0x09600, 0x140];

            export const BOX_METADATA = [0x09800, 0x440];

            export const BATTLE_BOX = [0x09E00, 0x574]; // Cannot be modified

            export const PSS_DATA_FRIENDS = [0x0A400, 0x4E28];
            export const PSS_DATA_ACQUAINTANCES = [0x0F400, 0x4E28];
            export const PSS_DATA_PASSERBY = [0x14400, 0x4E28];

            export const TRAINER_CARD = [0x19400, 0x170];

            export const PARTY_POKEMON = [0x19600, 0x61C];

            export const EVENT_FLAGS = [0x19E00, 0x504];

            export const POKEDEX = [0x1A400, 0x6A0];

            export const ZEKROM_RESHIRAM_DATA = [0x1B400, 0x104]; // TODO: (Normal) Implement support for fused Zekrom and Reshiram editing

            export const OPOWER_FLAGS = [0x1BE00, 0x64];

            export const PLAYER_METADATA = [0x1C400, 0x70C];

            export const CACHED_GTS_DATA = [0x1CC00, 0x180];

            export const WILD_ENCOUNTER_DATA = [0x1D200, 0x48];

            export const TOURNAMENT_WIFI_DATA = [0x1D600, 0x644];
            export const TOURNAMENT_LIVE_DATA = [0x1DE00, 0x5C8];

            export const NETWORK_DATA = [0x1E400, 0x2F8];

            export const HALL_OF_FAME_DATA = [0x1E800, 0x1B40];

            export const BATTLE_MAISON_DATA = [0x20400, 0x1F4];

            export const DAY_CARE_DATA = [0x20600, 0x1F0];

            export const BERRY_DATA = [0x20C00, 0x390];

            export const WONDERCARD_DATA = [0x21000, 0x1A90];

            export const ANISTAR_OLD_MAN_STORAGE = [0x22C00, 0x308];

            export const FRIEND_SAFARI_DATA = [0x23000, 0x618];

            export const PSS_DATA_EXTRA = [0x23800, 0x25C];
            export const PSS_DATA_FRIENDS_EXTRA = [0x23C00, 0x834]; // TODO(Extreme): Figure out what extra data this actually is

            export const SUPER_TRAINING_DATA = [0x24600, 0x318];

            export const POKEMON_BANK_GIFTS = [0x25200, 0xC48];

            export const POKEMON_GLOBAL_LINK_GIFTS = [0x26200, 0x200];

            export const BOX_DATA = [0x27A00, 0x34AD0];

            export const POKEMON_GLOBAL_LINK_PICTURES = [0x26200, 0x200];

            export const CHECKSUM = [0x6A800, 0x800];
        }

        export namespace ORASMap {
            // Array [address, bits]

            /*export const INVENTORY_POKEPUFFS = [0x5400, 0x2C8];

            export const POCKET_ITEMS = [0x5800, 0x640];
            export const POCKET_KEY_ITEMS = [0x05E40, 0x180];
            export const POCKET_TMS = [0x05FC0, 0x180];
            export const POCKET_MEDICINE = [0x06168, 0x1A8];
            export const POCKET_BERRIES = [0x06268, 0x100];

            export const QUICK_ACCESS_ITEMS = [0x06400, 0x2C];

            //export const TRAINER_STATS = [0x6400, 0x150];

            export const MAP_ID = [0x06802, 2];
            export const MAP_X_COORDINATE = [0x06810, 4];
            export const MAP_Y_COORDINATE = [0x06814, 4];
            export const MAP_Z_COORDINATE = [0x06818, 4];
            // map data is stored twice
            export const MAP_ID_2 = [0x068F4, 2];
            export const MAP_X_COORDINATE_2 = [0x06904, 4];
            export const MAP_Y_COORDINATE_2 = [0x06808, 4];
            export const MAP_Z_COORDINATE_2 = [0x0680C, 4];

            export const PLAY_TIME = [0x06C00, 8];

            export const WARDROBES = [0x06E00, 0x1C0];

            export const WORLD_DATA = [0x07400, 0x2100];

            export const TRAINER_INFORAMTION = [0x09600, 0x140]; */

            export const BOX_METADATA = [0x09800, 0x440];

            export const BATTLE_BOX = [0x09E00, 0x574]; // Cannot be modified

            /*export const PSS_DATA_FRIENDS = [0x0A400, 0x4E28];
            export const PSS_DATA_ACQUAINTANCES = [0x0F400, 0x4E28];
            export const PSS_DATA_PASSERBY = [0x14400, 0x4E28];

            export const TRAINER_CARD = [0x19400, 0x170];

            export const PARTY_POKEMON = [0x19600, 0x61C];

            export const EVENT_FLAGS = [0x19E00, 0x504];

            export const POKEDEX = [0x1A400, 0x6A0];

            export const ZEKROM_RESHIRAM_DATA = [0x1B400, 0x104]; // TODO: (Normal) Implement support for fused Zekrom and Reshiram editing

            export const OPOWER_FLAGS = [0x1BE00, 0x64];

            export const PLAYER_METADATA = [0x1C400, 0x70C];

            export const CACHED_GTS_DATA = [0x1CC00, 0x180];

            export const WILD_ENCOUNTER_DATA = [0x1D200, 0x48];

            export const TOURNAMENT_WIFI_DATA = [0x1D600, 0x644];
            export const TOURNAMENT_LIVE_DATA = [0x1DE00, 0x5C8];

            export const NETWORK_DATA = [0x1E400, 0x2F8];

            export const HALL_OF_FAME_DATA = [0x1E800, 0x1B40];

            export const BATTLE_MAISON_DATA = [0x20400, 0x1F4];

            export const DAY_CARE_DATA = [0x20600, 0x1F0];

            export const BERRY_DATA = [0x20C00, 0x390];

            export const WONDERCARD_DATA = [0x21000, 0x1A90];

            export const ANISTAR_OLD_MAN_STORAGE = [0x22C00, 0x308];

            export const FRIEND_SAFARI_DATA = [0x23000, 0x618];

            export const PSS_DATA_EXTRA = [0x23800, 0x25C];
            export const PSS_DATA_FRIENDS_EXTRA = [0x23C00, 0x834]; // TODO(Extreme): Figure out what extra data this actually is

            export const SUPER_TRAINING_DATA = [0x24600, 0x318];

            export const POKEMON_BANK_GIFTS = [0x25200, 0xC48];

            export const POKEMON_GLOBAL_LINK_GIFTS = [0x26200, 0x200];*/

            export const BOX_DATA = [0x38400, 0x34AD0];

            /*export const POKEMON_GLOBAL_LINK_PICTURES = [0x26200, 0x200];

            export const CHECKSUM = [0x6A800, 0x800];*/
        }
    }
}