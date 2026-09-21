import { EventEmitter } from "node:events";
export const eventEmitter = new EventEmitter();

export const events_name = {
  confirmEmail: "confirmEmail",
};

eventEmitter.on(events_name.confirmEmail, (fn) => {
    fn()
})