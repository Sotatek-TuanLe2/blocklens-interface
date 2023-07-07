import eventBus from 'js-event-bus';

const broadcast = new eventBus();

export const AppBroadcast = {
  on(event: string, callback: any) {
    broadcast.on(event, (e: any) => callback(e.detail));
  },
  dispatch(event: string, data?: any) {
    broadcast.emit(event, null, { detail: data });
  },
  remove(event: string) {
    broadcast.die(event);
  },
};
