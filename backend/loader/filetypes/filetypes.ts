namespace PKEdit.Loader {
    export enum FileType {
        DECRYPTED_ORAS_CYBERSAVE_FILE, // 0x76000 bit
        DECRYPTED_XY_CYBERSAVE_FILE, // 0x65600 bit

        DECRYPTED_RAW_XY_SAVE_FILE, // 1MB file
        DECRYPTED_RAW_ORAS_SAVE_FILE, // 1MB file

        ENCRYPTED_RAW_SAVE_FILE, // We can't open these

        DECRYPTED_PK6_BOXFILE, // .pk6 232 byte
        ENCRYPTED_EK6_BOXFILE, // .ek6 232 byte

        DECRYPTED_PK6_PARTYFILE, // .pk6 260 byte
        ENCRYPTED_EK6_PARTYFILE, // .ek6 260 byte
    };
}