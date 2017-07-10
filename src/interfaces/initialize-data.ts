import { iSoldItem } from './sold-item.interface';


export class InitClass {
    SOLDITEM: iSoldItem;
    public getDefaultSoldItem() {
        return this.SOLDITEM = {
            UID: null,
            // AVATAR_URL: null,
            NAME: null,
            PHONE: null,
            KIND: null, // pho, chungcu, dat
            PRICE: null,
            GROUNDSQUARES: null,
            USEDSQUARES: null,
            FACILITIES: {
                hasSCHOOL: false,
                hasSCHOOLFAR: null,
                hasMART: false,
                hasMARTFAR: null,
                hasHOSPITAL: false,
                hasHOSPITALFAR: null,
                hasCENTER: false,
                hasCENTERFAR: null
            },
            ADDRESS: null,
            PHOTOS: [],
            POSITION: null,
            VISIBLE: true,
            POSTDATE: null
        }
    }
}