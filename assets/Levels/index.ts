import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from './../Enums/index'
import { TILE_TYPE_ENUM } from '../Enums'
import level1 from './level1'
import level2 from './level2'

export interface IEntity {
  x: number
  y: number
  type: ENTITY_TYPE_ENUM
  direction: DIRECTION_ENUM
  state: ENTITY_STATE_ENUM
}

export interface ITile {
  src: number | null
  type: TILE_TYPE_ENUM | null
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>
}

const levels: Record<string, ILevel> = {
  level1,
  level2,
}

export default levels
