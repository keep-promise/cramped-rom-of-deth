import { _decorator, Component, Animation, AnimationClip, SpriteFrame } from 'cc';
import State from '../../Base/State';
import { FSM_PARAMS_TYPE_ENUM, PARAM_NAME_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

type IParamsValueType = boolean | number;

export interface IParamsValue {
    type: FSM_PARAMS_TYPE_ENUM,
    value: IParamsValueType
}

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends Component {

    private _currentState: State = null;
    params: Map<string, IParamsValue> = new Map();
    stateMachines: Map<string, State> = new Map();
    animationComponent: Animation;
    waitingList: Array<Promise<SpriteFrame[]>> = [];

    getParams(paramName: string) {
        if (this.params.has(paramName)) {
            return this.params.get(paramName).value;
        }
    }

    setParams(paramName: string, value: IParamsValueType) {
        if (this.params.has(paramName)) {
            this.params.get(paramName).value = value;
            this.run();
        }
    }

    get currentState() {
        return this._currentState;
    }

    set currentState(state: State) {
        this._currentState = state;
        this._currentState.run();
    }

    async init() {
        this.animationComponent = this.addComponent(Animation);

        this.initParams();
        this.initStateMachines();

        await Promise.all(this.waitingList);

    }

    initParams() {
        this.params.set(PARAM_NAME_ENUM.IDLE, {
            type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
            value: false
        });

        this.params.set(PARAM_NAME_ENUM.TURNLEFT, {
            type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
            value: false
        });
    }

    initStateMachines() {
        this.stateMachines.set(PARAM_NAME_ENUM.IDLE, new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop));
        this.stateMachines.set(PARAM_NAME_ENUM.TURNLEFT, new State(this, 'texture/player/turnleft/top'))

    }

    run() {
        switch(this.currentState) {
            case this.stateMachines.get(PARAM_NAME_ENUM.TURNLEFT):
            case this.stateMachines.get(PARAM_NAME_ENUM.IDLE):
                if (this.params.get(PARAM_NAME_ENUM.TURNLEFT)) {
                    this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.TURNLEFT);
                } else if (this.params.get(PARAM_NAME_ENUM.IDLE)) {
                    this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE);
                }
                break;
            default:
                this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE);
        }
    }
}

