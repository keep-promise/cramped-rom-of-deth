import Singleton from '../Base/Singleton';
import { ITile } from '../Levels';

export class DataManager extends Singleton {
    mapInfo: Array<Array<ITile>> = [];
    mapRowCount: number = 0;
    mapColumnCount: number = 0;
    levelIndex: number = 1;

    static get instance() {
        return super.getInstance<DataManager>();
    }

    getLevelIndex() {
        return this.levelIndex;
    }

    setLevelIndex(levelIndex: number) {
        this.levelIndex = levelIndex;
    }

    getMapInfo() {
        return {
            mapInfo: this.mapInfo,
            mapRowCount: this.mapRowCount,
            mapColumnCount: this.mapColumnCount
        }
    }

    setMapInfo(mapInfo: Array<Array<ITile>>) {
        this.mapInfo = mapInfo;
        this.mapRowCount = mapInfo.length || 0;
        this.mapColumnCount = mapInfo[0].length || 0;
    }

    reset() {
        this.setMapInfo([]);
    }

}

const DataManagerInstance = DataManager.instance

export default DataManagerInstance;
