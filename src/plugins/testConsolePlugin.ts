import { EventBus } from "../contexts/eventBusContext"
import Todo from "../types/Todo";

class TestConsolePlugin {
    init = (eventBus: EventBus) => {
        eventBus.addEventListener("onFetchList", (t) => {
            console.log("Fetched", t);
        })
        eventBus.addEventListener("onInitialize", () => { console.log("Initialize") })
        eventBus.addEventListener("onUpdateList", (t) => { console.log("Updated", t) })
    }
}

export default new TestConsolePlugin()