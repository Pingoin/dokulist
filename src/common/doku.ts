export class Doku{
    public filename: string;
    public path: string;
    public date: Date;
    constructor(filename: string, path: string,date: Date){
        this.filename=filename;
        this.path=path;
        this.date=date;
    }
    static fromJSON(json: string): Doku{
        const tmp=JSON.parse(json);

        return new Doku(tmp.filename,tmp.path,new Date(tmp.date));
    }
}