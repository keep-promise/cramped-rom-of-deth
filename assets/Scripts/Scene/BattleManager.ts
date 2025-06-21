import { _decorator, Component, Node } from 'cc'
import { EVENT_ENUM } from '../../Enums'
import levels, { ILevel } from '../../Levels'
import DataManagerInstance from '../../Runtime/DataManager'
import EventManagerInstance from '../../Runtime/EventManager'
import { createUINode } from '../../Utils'
import { PlayerManager } from '../Player/PlayerManager'
import { TileManager, TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager'
import { TileMapManager } from '../Tile/TileMapManager'
const { ccclass, property } = _decorator

@ccclass('BattleManage')
export class BattleManage extends Component {
  stage: Node
  level: ILevel

  onLoad() {
    EventManagerInstance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }

  onDestroy() {
    EventManagerInstance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }

  start() {
    this.generateStage()
    this.initLevel()
  }

  initLevel() {
    const levelIndex = DataManagerInstance.getLevelIndex()
    const level = levels[`level${levelIndex}`]
    if (level) {
      this.clearLevel()
      this.level = level
      DataManagerInstance.setMapInfo(level.mapInfo)

      this.generateTileMap()
      this.generatePlayer()
    }
  }

  nextLevel = () => {
    const levelIndex = DataManagerInstance.getLevelIndex()
    DataManagerInstance.setLevelIndex(levelIndex + 1)
    this.initLevel()
  }

  clearLevel() {
    this.stage.destroyAllChildren()
  }

  generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
  }

  generateTileMap() {
    const tileMap = createUINode()
    tileMap.setParent(this.stage)
    const tileMapManager = tileMap.addComponent(TileMapManager)
    tileMapManager.init()

    // 地图位置适配居中
    this.adtPosition()
  }

  generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    playerManager.init()
  }

  adtPosition() {
    const { mapRowCount, mapColumnCount } = DataManagerInstance.getMapInfo()
    const disX = (mapRowCount * TILE_WIDTH) / 2
    const disY = (mapColumnCount * TILE_HEIGHT) / 2 + 80

    this.stage.setPosition(-disX, disY)
  }
}
