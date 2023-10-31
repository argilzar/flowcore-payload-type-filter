// -----------------------------------------------------------------------------
// Purpose: Transform entrypoint
// this is the entrypoint that will be called when the transformer is invoked
// to transform an event, the return value of this function will be passed to
// the read model adapter.
// -----------------------------------------------------------------------------
import * as console from "console";

const CELLULAR_PAYLOAD_TYPE = 62;
const INTERNAL_SENSOR_RECORD = 63;
const LOCATION_RECORD = 64;
const SYSTEM_STATUS_RECORD = 65;

const SOURCE_SERVER_ID_DEVSOL = 1;
const SOURCE_SERVER_ID_HAPAG = 2;

const SOURCE_SERVER_NAME_1 = "devsol";
const SOURCE_SERVER_NAME_2 = "hapag";

interface ReturnRecord {
    timestamp: string;
    record_type: number;
    box_id: number;
    asset_id: number;
    source_server_id: number;
    when_received: string;
} 

interface Input<T = any> {
    eventId: string;
    validTime: string;
    payload: T;
}

function transform_LOCATION_RECORD(input: Input) {
    if (input.payload && input.payload.payload) {
        const timeStamp = input.payload.payload["gps_time"] ? input.payload.payload["gps_time"] : input.validTime;
        const returnRecord: ReturnRecord = {
            timestamp: timeStamp,
            record_type: LOCATION_RECORD,
            box_id: parseInt(input.payload["box_id"]),
            asset_id: parseInt(input.payload["asset_id"]),
            source_server_id: getSourceServerId(input.payload["source_server"]),
            when_received: new Date(parseInt(input.payload["when_received"])).toISOString(),
        }
        return returnRecord;

    }
    return null;
}

function transform_SYSTEM_STATUS_RECORD(input: Input) {
    if(input.payload && input.payload.payload) {
        const timeStamp = input.payload["when_sent"] ? new Date(input.payload["when_sent"]).toISOString() : input.validTime;
        const returnRecord: ReturnRecord = {
            timestamp: timeStamp,
            record_type: SYSTEM_STATUS_RECORD,
            box_id: parseInt(input.payload["box_id"]),
            asset_id: parseInt(input.payload["asset_id"]),
            source_server_id: getSourceServerId(input.payload["source_server"]),
            when_received: new Date(parseInt(input.payload["when_received"])).toISOString(),
        }
        return returnRecord;
    }
}

export default async function (input: Input) {
    try {
        const {payload_type} = input.payload;
        switch (payload_type) {
            case CELLULAR_PAYLOAD_TYPE:
                return transform_CELLULAR_PAYLOAD_TYPE(input);
            case INTERNAL_SENSOR_RECORD:
                return transform_INTERNAL_SENSOR_RECORD(input);
            case LOCATION_RECORD:
                return transform_LOCATION_RECORD(input);
                case SYSTEM_STATUS_RECORD:
                return transform_SYSTEM_STATUS_RECORD(input);
            default:
                console.debug("No transformation for payload type: " + payload_type);
                return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}


function transform_INTERNAL_SENSOR_RECORD(input: Input) {
    if (input.payload && input.payload.payload && input.payload["asset_id"]&& input.payload["box_id"]) {
        const timeStamp = input.payload.payload["when_captured"] ? input.payload.payload["when_captured"] : input.validTime;
        const returnRecord: ReturnRecord = {
            timestamp: timeStamp,
            record_type: INTERNAL_SENSOR_RECORD,
            box_id: parseInt(input.payload["box_id"]),
            asset_id: parseInt(input.payload["asset_id"]),
            source_server_id: getSourceServerId(input.payload["source_server"]),
            when_received: new Date(parseInt(input.payload["when_received"])).toISOString(),
        }
        return returnRecord;
    }
    return null;
}

function transform_CELLULAR_PAYLOAD_TYPE(input: Input) {
    if (input.payload && input.payload.payload) {
        const timeStamp = input.payload.payload["call_start_time"] ? input.payload.payload["call_start_time"] : input.validTime;
        const returnRecord: ReturnRecord = {
            timestamp: timeStamp,
            record_type: CELLULAR_PAYLOAD_TYPE,
            box_id: parseInt(input.payload["box_id"]),
            asset_id: parseInt(input.payload["asset_id"]),
            source_server_id: getSourceServerId(input.payload["source_server"]),
            when_received: new Date(parseInt(input.payload["when_received"])).toISOString(),
        }
        return returnRecord;
    }
    return null;
}

function getSourceServerId(source_server: string) {
    if (source_server === SOURCE_SERVER_NAME_1) {
        return SOURCE_SERVER_ID_DEVSOL;
    }
    if (source_server === SOURCE_SERVER_NAME_2) {
        return SOURCE_SERVER_ID_HAPAG;
    }
    return 0;
}
