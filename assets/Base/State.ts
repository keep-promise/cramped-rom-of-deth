import { animation, AnimationClip, Sprite, SpriteFrame } from 'cc'
import ResourceManagerInstance from '../Runtime/ResourceManager'
import { StateMachine } from './StateMachine'

/*
 * 1. 需要知道animationClip
 * 2. 需要播放动画的能力
 */
const ANIMATION_SPEED = 1 / 8

export default class State {
  private animationClip: AnimationClip
  constructor(
    private fsm: StateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
  ) {
    this.init()
  }

  async init() {
    const promise = ResourceManagerInstance.loadDir(this.path)
    this.fsm.waitingList.push(promise)
    const spriteFrames = await promise

    this.animationClip = new AnimationClip()
    this.animationClip.duration = 1.0 // 整个动画剪辑的周期

    const track = new animation.ObjectTrack() // 创建一个向量轨道
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item])
    track.channel.curve.assignSorted(frames)

    // 最后将轨道添加到动画剪辑以应用
    this.animationClip.addTrack(track)
    this.animationClip.name = this.path
    this.animationClip.duration = frames.length * ANIMATION_SPEED
    this.animationClip.wrapMode = this.wrapMode
  }

  run() {
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}
