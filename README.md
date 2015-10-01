# PKEditJS

A work-in-progress web-based Pokémon save editor for Generation VI games. It is based off of [PKHeX](https://github.com/kwsch/PKHeX), by Kaphotics.

There's currently no UI, but you can still use the backend to interact with PK6/EK6/SAV6 binary files.

Example usage: 

    var pk = new PKEdit.PKObject(uint8arr);
    PKEdit.Loader.LoadFile.loadFile(PKEdit.Data.Devices.FrontendDevice.DESKTOP);
    var po = new PKEdit.Core.PokemonObject();
    po.setPokemonNickname("TestNick");
    console.log(po.getPokemonNickname()); --> "TestNick"


This project is in its early stages and thus may contain bugs and/or other issues.

Any contributions are welcome!

## Building

This project is being developed in Visual Studio 2015, although it is not a requirement. You can import the solution by opening the "PKEdit.sln" file.

The project has been split into two sections, the "backend" and the "frontend". The backend should not use any UI-related code or objects that may not exist on all JavaScript implemtations (such as document or window). There is some debug code that needs to be removed to comply with this.

## Features

In the future, PKEditJS will be able to properly:

* Import and export OR/AS and X/Y decrypted save files and RAM dumps
* Import and export encrypted and decrypted PK6 files
* Have a tailored interface for various devices such as mobile and desktop browsers
