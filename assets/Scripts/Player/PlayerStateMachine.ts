import { _decorator, Animation, AnimationClip, SpriteFrame } from 'cc';
import State from '../../Base/State';
import { getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { FSM_PARAMS_TYPE_ENUM, PARAM_NAME_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

type IParamsValueType = boolean | number;

export interface IParamsValue {
    type: FSM_PARAMS_TYPE_ENUM,
    value: IParamsValueType
}

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

    async init() {
        this.animationComponent = this.addComponent(Animation);

        this.initParams();
        this.initStateMachines();
        this.initAnimationEvent();

        await Promise.all(this.waitingList);
    }

    initParams() {
        this.params.set(PARAM_NAME_ENUM.IDLE, getInitParamsTrigger());
        this.params.set(PARAM_NAME_ENUM.TURNLEFT, getInitParamsTrigger());
        this.params.set(PARAM_NAME_ENUM.DIRECTION, getInitParamsTrigger());
    }

    initStateMachines() {
        this.stateMachines.set(PARAM_NAME_ENUM.IDLE, new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop));
        this.stateMachines.set(PARAM_NAME_ENUM.TURNLEFT, new State(this, 'texture/player/turnleft/top'))

    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name;
            const whiteList = ['turn'];
            const isIn = whiteList.some((v) => name.includes(v));
            if (isIn) {
                this.setParams(PARAM_NAME_ENUM.IDLE, true);
            }

        })
    }

    run() {
        switch(this.currentState) {
            case this.stateMachines.get(PARAM_NAME_ENUM.TURNLEFT):
            case this.stateMachines.get(PARAM_NAME_ENUM.IDLE):
                if (this.params.get(PARAM_NAME_ENUM.TURNLEFT).value) {
                    this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.TURNLEFT);
                } else if (this.params.get(PARAM_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE);
                }
                break;
            default:
                this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE);
        }
    }
}

