import {Doku} from "../common/doku";
import fs, { PathLike } from "fs";
import Path from "path";
class Dokus {
    private dokulist: Array<Doku>;
    constructor(){
        this.dokulist=new Array<Doku>();
        this.dokulist.push(new Doku("TestDoku","test/Dokus",new Date()));
        this.dokulist.push(new Doku("TestDoku2","test/Dokus",new Date()));
        this.dokulist.push(new Doku("TestDoku6","test/Dokus",new Date()));
        this.dokulist.push(new Doku("TestDoku6","test/Dokus",new Date()));
        this.dokulist.push(new Doku("TestDoku6","test/Dokus",new Date()));
    }
    public getDokus(){
        //console.log(this.allFilesSync("./dist"));
        return this.allFilesSync("N:\\");
    }

    private allFilesSync(dir: PathLike, fileList: Array<Doku>= []){
        fs.readdirSync(dir).forEach(file => {
          const filePath = Path.join(dir.toString(), file);
            if(fs.statSync(filePath).isDirectory()){
                this.allFilesSync(filePath,fileList);
            }else{
                if (/[(.js)(.json)]$/i.test(file)){
                    fileList.push(new Doku(file,dir.toString(),new Date(fs.statSync(filePath).birthtime)));
                }
            }
        });
        return fileList;
      }

}

export default new Dokus();