import { IEntity } from './../Levels/index'
import { _decorator, Component, Sprite, UITransform } from 'cc'
import { DIRECTION_ENUM, PARAMS_NAME_ENUM, ENTITY_STATE_ENUM, DIRECTION_ORDER_ENUM } from '../Enums'
import { TILE_HEIGHT, TILE_WIDTH } from '../Scripts/Tile/TileManager'
import { PlayerStateMachine } from '../Scripts/Player/PlayerStateMachine'
const { ccclass } = _decorator

@ccclass('EntityManager')
export class EntityManager extends Component {
  x: number = 0
  y: number = 0
  fsm: PlayerStateMachine

  private _direction: DIRECTION_ENUM
  private _state: ENTITY_STATE_ENUM

  get direction(): DIRECTION_ENUM {
    return this._direction
  }

  set direction(_direction: DIRECTION_ENUM) {
    this._direction = _direction
    this.fsm.setParams(PARAMS_NAME_ENUM.TURNLEFT, DIRECTION_ORDER_ENUM[_direction])
  }

  get state(): ENTITY_STATE_ENUM {
    return this._state
  }

  set state(state: ENTITY_STATE_ENUM) {
    this._state = state
    this.fsm.setParams(state, true)
  }

  async init(params: IEntity) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.x = params.x
    this.y = params.y
    this.direction = params.direction
    this.state = params.state
  }

  update() {
    const posiX = this.x * TILE_WIDTH - TILE_WIDTH * 1.5
    const posiY = -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5
    this.node.setPosition(posiX, posiY)
  }
}
