import { IEntity } from './../../Levels/index'
import { _decorator, Component, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame } from 'cc'
import {
  CONTROLLER_ENUM,
  DIRECTION_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
  ENTITY_STATE_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_TYPE_ENUM,
} from '../../Enums'
import EventManagerInstance from '../../Runtime/EventManager'
import ResourceManagerInstance from '../../Runtime/ResourceManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager'
import { PlayerStateMachine } from './PlayerStateMachine'
import { EntityManager } from '../../Base/EntityManager'
const { ccclass } = _decorator

const ANIMATION_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  targetX: number = 0
  targetY: number = 0
  private readonly speed = 1 / 10

  async init() {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    super.init({
      x: 0,
      y: 0,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

    EventManagerInstance.on(EVENT_ENUM.PLAYER_CTRL, this.move)
  }

  update() {
    this.updateXY()
    super.update()
  }

  updateXY() {
    if (this.targetX < this.x) {
      this.x -= this.speed
    } else if (this.targetX > this.x) {
      this.x += this.speed
    }

    if (this.targetY < this.y) {
      this.y -= this.speed
    } else if (this.targetY > this.y) {
      this.y += this.speed
    }

    const disX = Math.abs(this.targetX - this.x)
    const disY = Math.abs(this.targetY - this.y)
    if (disX <= 0.1 && disY <= 0.1) {
      this.x = this.targetX
      this.y = this.targetY
    }
  }

  move = (inputDirection: CONTROLLER_ENUM) => {
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.targetY--
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.targetY++
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.targetX--
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.targetX++
    } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }
      this.state = ENTITY_STATE_ENUM.TURNLEFT
    }
  }

  async render() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    const spriteFrames = await ResourceManagerInstance.loadDir('texture/player/idle/top')
    const animationComponent = this.addComponent(Animation)

    const animationClip = new AnimationClip()
    animationClip.duration = 1.0 // 整个动画剪辑的周期

    const track = new animation.ObjectTrack() // 创建一个向量轨道
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item])
    track.channel.curve.assignSorted(frames)

    // 最后将轨道添加到动画剪辑以应用
    animationClip.addTrack(track)

    animationClip.duration = frames.length * ANIMATION_SPEED
    animationClip.wrapMode = AnimationClip.WrapMode.Loop
    animationComponent.defaultClip = animationClip
    animationComponent.play()
  }
}
