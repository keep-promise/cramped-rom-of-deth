import { _decorator, Component, Animation, SpriteFrame } from 'cc'
import State from './State'
import { FSM_PARAMS_TYPE_ENUM } from '../Enums'
import { SubStateMachine } from './SubStateMachine'
const { ccclass } = _decorator

type IParamsValueType = boolean | number

export interface IParamsValue {
  type: FSM_PARAMS_TYPE_ENUM
  value: IParamsValueType
}

export function getInitParamsTrigger() {
  return {
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

export function getInitParamsNumber() {
  return {
    type: FSM_PARAMS_TYPE_ENUM.NUMBER,
    value: 0,
  }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  private _currentState: State | SubStateMachine = null
  params: Map<string, IParamsValue> = new Map()
  stateMachines: Map<string, State | SubStateMachine> = new Map()
  animationComponent: Animation
  waitingList: Array<Promise<SpriteFrame[]>> = []

  getParams(paramName: string) {
    if (this.params.has(paramName)) {
      return this.params.get(paramName).value
    }
  }

  setParams(paramName: string, value: IParamsValueType) {
    if (this.params.has(paramName)) {
      this.params.get(paramName).value = value
      this.run()
      this.resetTrigger()
    }
  }

  get currentState() {
    return this._currentState
  }

  set currentState(state: State | SubStateMachine) {
    this._currentState = state
    this._currentState.run()
  }

  resetTrigger() {
    for (const [_, value] of this.params) {
      if (value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        value.value = false
      }
    }
  }

  abstract init(): void
  abstract run(): void
}
