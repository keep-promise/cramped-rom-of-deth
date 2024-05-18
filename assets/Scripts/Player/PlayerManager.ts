import {
    _decorator,
    Component,
    Sprite,
    UITransform,
    Animation,
    AnimationClip,
    animation,
    SpriteFrame
} from 'cc';
import {
    CONTROLLER_ENUM,
    DIRECTION_ENUM,
    EVENT_ENUM,
    PARAM_NAME_ENUM,
    ENTITY_STATE_ENUM,
    DIRECTION_ORDER_ENUM
} from '../../Enums';
import EventManagerInstance from '../../Runtime/EventManager';
import ResourceManagerInstance from '../../Runtime/ResourceManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { PlayerStateMachine } from './PlayerStateMachine';
const { ccclass } = _decorator;

const ANIMATION_SPEED = 1/8;

@ccclass('PlayerManager')
export class PlayerManager extends Component {

    x: number = 0;
    y: number = 0;
    targetX: number = 0;
    targetY: number = 0;
    private readonly speed = 1/10;
    fsm: PlayerStateMachine;

    private _direction: DIRECTION_ENUM;
    private _state: ENTITY_STATE_ENUM;

    get direction(): DIRECTION_ENUM {
        return this._direction;
    }

    set direction(_direction: DIRECTION_ENUM) {
        this._direction = _direction;
        this.fsm.setParams(PARAM_NAME_ENUM.TURNLEFT, DIRECTION_ORDER_ENUM[_direction]);
    }

    get state(): ENTITY_STATE_ENUM{
        return this._state;
    }

    set state(state: ENTITY_STATE_ENUM) {
        this._state = state;
        this.fsm.setParams(state, true);
    }

    async init() {
        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const transform = this.getComponent(UITransform);
        transform.setContentSize(TILE_WIDTH*4, TILE_HEIGHT*4);

        this.fsm = this.addComponent(PlayerStateMachine);

        await this.fsm.init();
        this.state = ENTITY_STATE_ENUM.IDLE;
        // this.fsm.setParams(PARAM_NAME_ENUM.IDLE, true);
        // this.render();

        EventManagerInstance.on(EVENT_ENUM.PLAYER_CTRL, this.move);
    }

    update() {
        this.updateXY();
        const posiX = this.x*TILE_WIDTH-TILE_WIDTH*1.5;
        const posiY = -this.y*TILE_HEIGHT + TILE_HEIGHT*1.5;
        this.node.setPosition(posiX, posiY);
    }

    updateXY() {
        if (this.targetX < this.x) {
            this.x -= this.speed;
        } else if(this.targetX > this.x) {
            this.x += this.speed;
        }

        if (this.targetY < this.y) {
            this.y -= this.speed;
        } else if(this.targetY > this.y) {
            this.y += this.speed;
        }

        const disX = Math.abs(this.targetX-this.x);
        const disY = Math.abs(this.targetY-this.y);
        if (disX<=0.1 && disY<=0.1) {
            this.x = this.targetX;
            this.y = this.targetY;
        }
    }

    move = (inputDirection: CONTROLLER_ENUM) => {
        if (inputDirection === CONTROLLER_ENUM.TOP) {
            this.targetY--;
        } else if(inputDirection === CONTROLLER_ENUM.BOTTOM) {
            this.targetY++;
        } else if(inputDirection === CONTROLLER_ENUM.LEFT) {
            this.targetX--;
        } else if(inputDirection === CONTROLLER_ENUM.RIGHT) {
            this.targetX++;
        } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
            if(this.direction === DIRECTION_ENUM.TOP) {
                this.direction = DIRECTION_ENUM.LEFT;
            } else if(this.direction === DIRECTION_ENUM.LEFT) {
                this.direction = DIRECTION_ENUM.BOTTOM;
            } else if(this.direction === DIRECTION_ENUM.BOTTOM) {
                this.direction = DIRECTION_ENUM.RIGHT;
            } else if(this.direction === DIRECTION_ENUM.RIGHT) {
                this.direction = DIRECTION_ENUM.TOP;
            }
            this.state = ENTITY_STATE_ENUM.TURNLEFT;
        }
    }

    async render() {
        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const transform = this.getComponent(UITransform);
        transform.setContentSize(TILE_WIDTH*4, TILE_HEIGHT*4);

        const spriteFrames = await ResourceManagerInstance.loadDir('texture/player/idle/top');
        const animationComponent = this.addComponent(Animation);


        const animationClip = new AnimationClip();
        animationClip.duration = 1.0; // 整个动画剪辑的周期

        const track  = new animation.ObjectTrack(); // 创建一个向量轨道
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
        const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED*index, item]);
        track.channel.curve.assignSorted(frames);

        // 最后将轨道添加到动画剪辑以应用
        animationClip.addTrack(track);

        animationClip.duration = frames.length * ANIMATION_SPEED;
        animationClip.wrapMode = AnimationClip.WrapMode.Loop;
        animationComponent.defaultClip = animationClip;
        animationComponent.play();
    }
}
