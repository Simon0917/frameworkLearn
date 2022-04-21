
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

interface Event{
    target:any,
    callBack:Function
}

@ccclass('EventManager')
export class EventManager{
    private eventMap:Map<string,Event[]> = new Map();
    private onceEventMap:Map<string,Event[]> = new Map();

    /**注册普通事件 */
    public on(eventName:string,callBack:Function,target:any){
        if(!this.eventMap.has(eventName)){
            this.eventMap.set(eventName,[{target,callBack}]);
            return;
        }
        this.eventMap.get(eventName).push({callBack,target});
    }

    /**注册一次性事件 */
    public once(eventName:string,callBack:Function,target:any){
        if(!this.onceEventMap.has(eventName)){
            this.onceEventMap.set(eventName,[{target,callBack}]);
            return;
        }
        this.onceEventMap.get(eventName).push({callBack,target});
    }

    /**移除事件 */
    public off(eventName:string,callBack:Function,target:any){
        const events = this.eventMap.get(eventName);
        if(events){
            for(let i=0;i<events.length;++i){
                if(this.campare(events[i],callBack,target)){
                    events.splice(i,1);
                    if(!events.length){
                        this.eventMap.delete(eventName);
                    }
                    break;
                }
            }
        }

        const onceEvent = this.onceEventMap.get(eventName);
        if(onceEvent){
            for(let i=0;i<onceEvent.length;++i){
                if(this.campare(onceEvent[i],callBack,target)){
                    onceEvent.splice(i,1);
                    if(!onceEvent.length){
                        this.onceEventMap.delete(eventName);
                    }
                    break;
                }
            }
        }
    }

    /**发射事件 */
    public emit(eventName:string,...arg:any[]){
        const event = this.eventMap.get(eventName);
        if(event){
            for(let i=0;i<event.length;++i){
                const {target,callBack} = event[i];
                callBack.apply(target,arg);
            }
        }

        const onceEvent = this.onceEventMap.get(eventName);
        if(onceEvent){
            for(let i=0;i<onceEvent.length;++i){
                const {target,callBack} = onceEvent[i];
                callBack.apply(target,arg);
            }
            this.onceEventMap.delete(eventName);
        }
    }

    /**移除指定事件 */
    public remove(eventName:string){
        this.eventMap.has(eventName) && this.eventMap.delete(eventName);
        this.onceEventMap.has(eventName) && this.onceEventMap.delete(eventName);
    }

    /**移除所有事件 */
    public clear(){
        this.eventMap.clear();
        this.onceEventMap.clear();
    }

    /**比较两个事件是否是同一个 */
    private campare(event:Event,callBack:Function,target:any){
        return event.target == target && (event.callBack == callBack || event.callBack.toString() == callBack.toString());
    }
}

