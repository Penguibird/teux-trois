import { EventBus } from "../contexts/eventBusContext";

type id = string
export interface IEventBusList {
    addEventBus: (s: id, e: EventBus) => void
    getEventBus: (s: id) => EventBus
}
class EventBusList implements IEventBusList {
    private buses: Record<id, EventBus> = {};


    addEventBus = (s: id, e: EventBus) => {
        this.buses[s] = e;
    }

    getEventBus = (s: id) => {
        return this.buses[s];
    }
}

const singleton = new EventBusList();
export default singleton as EventBusList;