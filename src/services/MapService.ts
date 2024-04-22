
import * as fs from 'fs';
import * as path from 'path';
import Config from '../config/Config';

class MapService {
    getMap(name: string) {
        const file = fs.readFileSync(path.resolve('', Config.folder.mapFolder, `${name}.json`), {encoding:'utf-8'})
        return JSON.parse(file)
    }

}

export default new MapService()