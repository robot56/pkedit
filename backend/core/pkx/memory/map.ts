namespace PKEdit.Core {
    export namespace PK6.Memory {
        export namespace Map {

            /* Block A (0x8 - 0x3F) */

            export const NATIONAL_POKEDEX_ID = [0x8, 0x2];
            export const HELD_ITEM = [0xA, 0x2];
            export const OT_ID = [0x0C, 0x2];
            export const OT_SECRET_ID = [0x0E, 0x2];
            export const EXP_POINTS = [0x10, 0x3];
            export const ABILITY = [0x14, 0x1];
            export const ABILITY_NUM = [0x15, 0x1];

            // missing 0x16 - 0x17

            export const PERSONALITY_VALUE = [0x18, 0x4];
            export const NATURE = [0x1C, 0x1];

            export const ENCOUNTER_FLAGS = [0x1D, 0x1];
            //export const FATEFUL_ENCOUNTER = [];
            //export const IS_FEMALE,
            //export const IS_GENDERLESS,
            //export const ALTERNATE_FORMS;

            export const EV_HP = [0x1E, 0x1];
            export const EV_ATTACK = [0x1F, 0x1];
            export const EV_DEFENSE = [0x20, 0x1];
            export const EV_SPEED = [0x21, 0x1];
            export const EV_SPECIALATTACK = [0x22, 0x1];
            export const EV_SPECIALDEFENSE = [0x23, 0x1];

            export const CONTEST_COOL = [0x24, 0x1];
            export const CONTEST_BEAUTY = [0x25, 0x1];
            export const CONTEST_CUTE = [0x26, 0x1];
            export const CONTEST_TOUGH = [0x27, 0x1];
            export const CONTEST_SHEEN = [0x28, 0x1];

            export const MARKINGS = [0x29, 0x1];

            export const POKERUS = [0x2B, 0x1];

            export const SUPERTRAINING_GOLD_FLAGS = [0x2C, 0x4];
            export const RIBBONS = [0x30, 0x5];
            export const RIBBON_STATS = [0x36, 0x2];
            export const SUPERTRAINING_DISTRIBUTION_FLAGS = [0x3A, 0x1];

            /* Block B (0x40 - 0x77) */

            export const NICKNAME = [0x40, 0x12];
            export const MOVE1_ID = [0x58, 0x2];
            export const MOVE2_ID = [0x5C, 0x2];
            export const MOVE3_ID = [0x5E, 0x2];
            export const MOVE4_ID = [0x60, 0x2];
            export const MOVE1_PP = [0x62, 0x1];
            export const MOVE2_PP = [0x63, 0x1];
            export const MOVE3_PP = [0x64, 0x1];
            export const MOVE4_PP = [0x65, 0x1];
            export const MOVE1_PPUPS = [0x66, 0x1];
            export const MOVE2_PPUPS = [0x67, 0x1];
            export const MOVE3_PPUPS = [0x68, 0x1];
            export const MOVE4_PPUPS = [0x69, 0x1];
            export const MOVE1_RELEARN = [0x6A, 0x2];
            export const MOVE2_RELEARN = [0x6C, 0x2];
            export const MOVE3_RELEARN = [0x6E, 0x2];
            export const MOVE4_RELEARN = [0x70, 0x2];
            export const SUPERTRAINING_MISSIONFLAG = [0x72, 0x1];

            export const INDIVIDUAL_VALUES = [0x74, 0x4];
            //export const IV_ATTACK,
            //export const IV_DEFENSE,
            //export const IV_SPEED,
            //export const IV_SPECIALATTACK,
            //export const IV_SPECIALDEFENSE,
            //export const IS_EGG,
            //export const IS_NICKNAMED

            /* Block C (0x78 - 0xAF) */

            export const LH_NICKNAME = [0x78, 0x12];
            export const LH_GENDER = [0x92, 0x1];
            export const CURRENT_HANDLER = [0x93, 0x1];
            export const GEOLOC_1 = [0x94, 0x2];
            export const GEOLOC_2 = [0x96, 0x2];
            export const GEOLOC_3 = [0x98, 0x2];
            export const GEOLOC_4 = [0x9A, 0x2];
            export const GEOLOC_5 = [0x9C, 0x2];

            export const LH_FRIENDSHIP = [0xA2, 0x1];
            export const LH_AFFECTION = [0xA3, 0x1];
            export const LH_MEMORY_INTENSITY = [0xA4, 0x1];
            export const LH_MEMORY_LINE = [0xA5, 0x1];
            export const LH_MEMORY_FEELING = [0xA6, 0x1];

            export const LH_MEMORY_TEXT = [0xA8, 0x2];

            export const AMIE_FULLNESS = [0xAE, 0x1];
            export const AMIE_ENJOYMENT = [0xAF, 0x1];

            /* Block D (0xB0 - 0xE7) */

            export const OT_NICKNAME = [0xB0, 0x12];
            export const OT_FRIENDSHIP = [0xCA, 0x1];
            export const OT_AFFECTION = [0xCB, 0x1];
            export const OT_MEMORY_INTENSITY = [0xCC, 0x1];
            export const OT_MEMORY_LINE = [0xCD, 0x1];
            export const OT_MEMORY_TEXT = [0xCE, 0x2];
            export const OT_MEMORY_FEELING = [0xD0, 0x1];
            export const EGG_MET_DATE = [0xD1, 0x3];
            export const MET_DATE = [0xD4, 0x3];

            export const EGG_MET_LOCATION = [0xD8, 0x2];
            export const MET_LOCATION = [0xDA, 0x2];

            export const POKEBALL = [0xDC, 0x1];
            export const ENCOUNTER_OT_GENDER = [0xDD, 0x1];
            export const ENCOUNTER_TYPE = [0xDE, 0x1];
            export const OT_GAME_ID = [0xDF, 0x1];
            export const COUNTRY_ID = [0xE0, 0x1];
            export const REGION_ID = [0xE1, 0x1];
            export const REGION_3DS_ID = [0xE2, 0x1];
            export const OT_LANGUAGE_ID = [0xE3, 0x1];

        }
    }
}