
export enum TILE_TYPE_ENUM {
    WALL_ROW = 'WALL_ROW',
    WALL_COLUMN = 'WALL_COLUMN',
    WALL_LEFT_TOP = 'WALL_LEFT_TOP',
    WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
    WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
    WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
    CLIFF_CENTER = 'CLIFF_CENTER',
    CLIFF_LEFT = 'CLIFF_LEFT',
    CLIFF_RIGHT = 'CLIFF_RIGHT',
    FLOOR = 'FLOOR'
}

export enum EVENT_ENUM {
    NEXT_LEVEL = 'NEXT_LEVEL',
    PLAYER_CTRL = 'PLAYER_CTRL'
}

export enum CONTROLLER_ENUM {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    TURNLEFT = 'TURNLEFT',
    TURNRIGHT = 'TURNRIGHT'
}

export enum FSM_PARAMS_TYPE_ENUM {
    TRIGGER = 'TRIGGER',
    ATTACK = 'ATTACK'
}

export enum PARAM_NAME_ENUM {
    IDLE = 'IDLE',
    TURNLEFT = 'TURNLEFT'
}