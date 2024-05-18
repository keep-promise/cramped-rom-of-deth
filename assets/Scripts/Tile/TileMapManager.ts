
import { _decorator, Component, resources, SpriteFrame } from 'cc';
import DataManagerInstance from '../../Runtime/DataManager';
import ResourceManagerInstance from '../../Runtime/ResourceManager';
import { createUINode, randomByRange } from '../../Utils';
import { TileManager } from './TileManager';
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;


@ccclass('TileMapManager')
export class TileMapManager extends Component {

    async init() {
        const { mapInfo, mapRowCount } = DataManagerInstance.getMapInfo();
        const spriteFrames = await ResourceManagerInstance.loadDir('texture/tile/tile');
        for(let i = 0; i<mapRowCount; i++) {
            const column = mapInfo[i];
            for(let j = 0; j<column.length; j++) {
                const item = column[j];
                if (item.src === null || item.type === null) {
                    continue;
                }

                let num = item.src;

                // 地表随机
                if ((num===1 || num===5|| num===9)&&(i%2==0&&j%2==0)) {
                  num += randomByRange(0, 4);
                }
                const node = createUINode();
                const imgSrc = `tile (${num})`;
                const spriteFrame =
                    spriteFrames.find((v) => v.name === imgSrc) || spriteFrames[0];

                const tileManager = node.addComponent(TileManager);
                tileManager.init(spriteFrame, i, j);

                node.setParent(this.node);
            }

        }
    }

}

