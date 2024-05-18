
import { _decorator, Component, Node } from 'cc';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enums';
import EventManagerInstance from '../../Runtime/EventManager';
const { ccclass, property } = _decorator;

@ccclass('ControlManager')
export class ControlManager extends Component {

    handleCtrl(evt: Event, type: CONTROLLER_ENUM) {
        console.log('handleCtrl', type);
        EventManagerInstance.emit(EVENT_ENUM.PLAYER_CTRL, type);
    }

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
