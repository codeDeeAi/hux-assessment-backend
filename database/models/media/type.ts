import { ITimestamps } from "../../../src/types";

export enum EMediaTypes {
    AVATAR = 'AVATAR'
}

export type IMediaType = keyof typeof EMediaTypes;
export interface IMedia extends ITimestamps {
    id: number;
    type: IMediaType;
    model: string;
    model_id: number | null;
    model_uuid: string | null;
    media: { [key: string]: any };
}