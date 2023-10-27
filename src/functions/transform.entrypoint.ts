// -----------------------------------------------------------------------------
// Purpose: Transform entrypoint
// this is the entrypoint that will be called when the transformer is invoked
// to transform an event, the return value of this function will be passed to
// the read model adapter.
// -----------------------------------------------------------------------------
interface Input<T = any> {
  eventId: string;
  validTime: string;
  payload: T;
}

export default async function (input: Input) {
  if(payload.payload_type === 62){
    return input;
  }
  return null;
}
