import { iPosition } from './position.interface';

export interface iSoldItem {
    UID: string,
    // AVATAR_URL: string,
    NAME: string,
    PHONE: string,
    KIND: string, // pho, chungcu, dat
    PRICE: number,
    GROUNDSQUARES: number,
    USEDSQUARES: number,
    FACILITIES: {
        hasSCHOOL: boolean,
        hasSCHOOLFAR: number,
        hasMART: boolean,
        hasMARTFAR: number,
        hasHOSPITAL: boolean,
        hasHOSPITALFAR: number,
        hasCENTER: boolean,
        hasCENTERFAR: number
    },
    ADDRESS: string,
    PHOTOS: string[],
    POSITION: iPosition,
    VISIBLE: boolean,
    POSTDATE: string
}