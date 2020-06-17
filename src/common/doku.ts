export class Doku{
    public filename: string;
    public path: string;
    public date: Date;
    public description="";
    public ageRating=0;
    public year=0;
    public source="";
    public extension="";
    public title: string;
    constructor(filename: string, path: string,date: Date){
        this.filename=filename;
        this.title=filename.replace(".mkv","").replace(".mp4","");
        this.extension=filename.replace(this.title,"");
        this.path=path;
        this.date=date;
    }

    static fromJSON(json: string): Doku{
        const tmp=JSON.parse(json);
        const tmpDoku: Doku=new Doku(tmp.filename,tmp.path,new Date(tmp.date));

        return tmpDoku;
    }
}