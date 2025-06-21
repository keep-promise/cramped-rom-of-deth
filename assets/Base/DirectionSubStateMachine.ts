import { AnimationClip } from 'cc'
import State from '../Base/State'
import { StateMachine } from '../Base/StateMachine'
import { SubStateMachine } from '../Base/SubStateMachine'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../Enums'

export class DirectionSubStateMachine extends SubStateMachine {
  run() {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
    this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }
}
