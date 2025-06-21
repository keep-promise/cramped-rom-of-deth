import State from './State'
import { FSM_PARAMS_TYPE_ENUM } from '../Enums'
import { StateMachine } from './StateMachine'

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

export function getInitParamNumber() {
  return {
    type: FSM_PARAMS_TYPE_ENUM.NUMBER,
    value: 0,
  }
}

export abstract class SubStateMachine {
  private _currentState: State = null
  stateMachines: Map<string, State> = new Map()

  constructor(public fsm: StateMachine) {}

  get currentState() {
    return this._currentState
  }

  set currentState(state: State) {
    this._currentState = state
    this._currentState.run()
  }

  abstract run(): void
}
