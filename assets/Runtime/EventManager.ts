import Singleton from '../Base/Singleton';

export class EventManager extends Singleton {
    static get instance() {
        return super.getInstance<EventManager>();
    }

    private eventDic: Map<string, Array<Function>> = new Map();

    on(eventName: string, func: Function) {
        if (this.eventDic.has(eventName)) {
            const funcs = this.eventDic.get(eventName);
            funcs.push(func);
            this.eventDic.set(eventName, funcs);
        } else {
            this.eventDic.set(eventName, [func]);
        }
    }

    off(eventName: string, func: Function) {
        if (this.eventDic.has(eventName)) {
            const funcs = this.eventDic.get(eventName);
            funcs.some((item: Function, index: number) => {
                if (item === func) {
                    funcs.splice(index, 1);
                    return true;
                }
            });
            this.eventDic.set(eventName, funcs);
        }
    }

    emit(eventName: string, ...args: unknown[]) {
        if (this.eventDic.has(eventName)) {
            const funcs = this.eventDic.get(eventName);
            funcs.forEach((func) => {
                func(...args);
            })
        }
    }

    clear() {
        this.eventDic.clear();
    }
}

const EventManagerInstance = EventManager.instance

export default EventManagerInstance;
