import {Doku} from "../common/doku";
class Dokus {
    private dokulist: Array<Doku>;
    constructor(){
        this.dokulist=new Array<Doku>();
        this.dokulist.push(new Doku("TestDoku","test/Dokus",new Date()));
        this.dokulist.push(new Doku("TestDoku2","test/Dokus",new Date()));
        this.dokulist.push(new Doku("TestDoku6","test/Dokus",new Date()));
    }
    public getDokus(){
        return this.dokulist;
    }

}

export default new Dokus();