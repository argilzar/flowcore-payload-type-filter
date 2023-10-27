// -----------------------------------------------------------------------------
// Purpose: Transform entrypoint
// this is the entrypoint that will be called when the transformer is invoked
// to transform an event, the return value of this function will be passed to
// the read model adapter.
// -----------------------------------------------------------------------------
import * as console from "console";

interface Input<T = any> {
  eventId: string;
  validTime: string;
  payload: T;
}

export default async function (input: Input) {
  try {
    const {payload_type} = input.payload;
    input.validTime = input.payload && input.payload.payload && input.payload.payload.call_start_time ? input.payload.payload.call_start_time : input.validTime;
    if(payload_type === 62){
      return input;
    }
    return null;
  }catch (e) {
    console.error(e);
    return null;
  }

}
