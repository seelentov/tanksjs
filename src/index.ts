// import readline from "readline";
import GameMap from "./models/GameMap";
import MapService from "./services/MapService";
import Game from "./models/Game";
import Matrix from "./models/Matrix";
// import Tank from "./models/Tank";

// readline.emitKeypressEvents(process.stdin);

// if (process.stdin.isTTY)
//     process.stdin.setRawMode(true);

const map1 = new GameMap(MapService.getMap('map1'))

const game = new Game(map1)

// process.stdin.on('keypress', (_chunk, key) => {
//     if (key?.name) {
//         game.input(key?.name)
//     }
//     if (key && key.sequence == '\x03')
//         process.exit();
// });

// game.start()

const matrix = new Matrix(5,5)
matrix.push(3,1,'top2')
matrix.push(3,2,'top1')
matrix.push(3,4,'bottom1')
matrix.push(3,5,'bottom2')

matrix.push(1,3,'left2')
matrix.push(2,3,'left1')
matrix.push(4,3,'right1')
matrix.push(5,3,'right2')


console.log(matrix.firstOnDirections([3,3]))