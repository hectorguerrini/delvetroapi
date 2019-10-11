import { CorsOptions } from "cors";

export class corsConfig {
    public options: CorsOptions;

    constructor() {
        this.options = {
            origin: '*',
            optionsSuccessStatus: 200
        }        
    }


}