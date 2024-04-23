// import readline from "readline";
import GameMap from "./models/GameMap";
import MapService from "./services/MapService";
import Game from "./models/Game";
import * as readline from 'readline';

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY)
    process.stdin.setRawMode(true);

process.stdin.on('keypress', (_chunk, key) => {
    if (key?.name) {
        game.input(key?.name)
    }
    if (key && key.sequence == '\x03')
        process.exit();
});


const map1 = new GameMap(MapService.getMap('map1'))

const game = new Game(map1)

game.start()