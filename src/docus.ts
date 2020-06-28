import { Doku, iDoku } from "./common/doku";
import fs, { promises as fileSystem, PathLike } from "fs";
import Path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Database } from "sqlite";
import { DokuResponse } from "./common/dokuResponse";


/**
 *
 *
 * @export
 * @class Dokus
 */
export class Dokus {
    private static instance: Dokus;
    private dokulist: Database<sqlite3.Database, sqlite3.Statement>;
    private dokuCount:number;
    constructor() {
        sqlite3.verbose();

    }


    /**
     *
     *
     * @returns {Promise<Doku[]>}
     * @memberof Dokus
     */
    public async getDokus(count:number=25,page:number=0,order:string="date",desc:boolean=true): Promise<DokuResponse> {
        const promise = new Promise<DokuResponse>((resolve) => {
            const tempDokus: DokuResponse =new DokuResponse();
            tempDokus.limit=count;
            tempDokus.page=page;
            tempDokus.count=this.dokuCount;
            let qry= "SELECT * FROM dokus ORDER BY \""+order+"\"";
            if (desc){
                qry+=" DESC";
            }else{
                qry+=" ASC";
            }
            qry+=" LIMIT "+count.toString()+" OFFSET "+(page*count).toString();
            this.dokulist.all<iDoku[]>(qry).then((result) => {
                result.forEach((row) => {
                    tempDokus.dokus.push(Doku.fromInterface(row));
                });
                resolve(tempDokus);
            }).catch((err) => {
                console.log(err);
            });

        });

        return promise;
    }
    public async getDokuCount():Promise<number>{

        interface Row {
            count: number
          }

        const promise=new Promise<number>((resolve)=>{
            this.dokulist.get<Row>("SELECT COUNT(*) AS count FROM dokus").then((result)=>{
                console.log(result);
                resolve(result.count);
            });
        });
        return promise;
    }

    
    public init(dir: PathLike): void {
        open<sqlite3.Database, sqlite3.Statement>({
            filename: ":memory:",
            driver: sqlite3.Database
        }).then((db) => {
            this.dokulist = db;
            this.dokulist.exec(`CREATE TABLE IF NOT EXISTS "dokus" (
                "index"	INTEGER,
                "path" TEXT,
                "date" INTEGER,
                "description" TEXT,
                "ageRating" INTEGER,
                "year" ITEGER,
                "source" TEXT,
                "extension" TEXT,
                "title" TEXT,
                PRIMARY KEY("index" AUTOINCREMENT)
            );`);
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            this.allFilesSync(dir);
        }).catch((err) => {
            console.log(err);
        });
    }
    public allFilesSync(dir: PathLike): void {
        fileSystem.readdir(dir).then(
            (files) => {
                files.forEach(file => {
                    const filePath = Path.join(dir.toString(), file);
                    fileSystem.stat(filePath).then(
                        (Filestat) => {
                            if (Filestat.isDirectory()) {
                                this.allFilesSync(filePath);
                            } else {
                                if (/[(.mp4)(.mkv)]$/i.test(file)) {this.pushDoku(filePath, file, Filestat);}
                            }
                        }
                    ).catch((err)=>console.log(err));
                });
            }
        ).catch((err)=>console.log(err));
    }


    private pushDoku(dir: PathLike, file: string, Filestat: fs.Stats) {
        const doku: Doku = new Doku(file, dir.toString(), new Date(Filestat.birthtime));
        if (fs.existsSync(Path.join(dir.toString(), doku.title + ".json"))) {
            //tmpDoku = Doku.fromJSON(require(Path.join(dir.toString(), tmpDoku.title + ".json")));
        } else if (fs.existsSync(Path.join(dir.toString(), doku.title + ".txt"))) {
            let regExp: RegExpExecArray;
            const data = fs.readFileSync(Path.join(dir.toString(), doku.title + ".txt"), "ucs2");
            const source: string = /Channel.*: (.*)/.exec(data)[1];
            let description: string = /Description : (.*)/.exec(data)[1];
            doku.source = source;
            const removeArray: string[] = [
                " Doku-Reihe, ",
                doku.title
            ];
            removeArray.forEach(element => description = description.replace(element, ""));
            try {
                regExp = /Altersfreigabe: ab ([0-9]*)/.exec(description);
                doku.ageRating = Number(regExp[1]);
                description = description.replace(regExp[0], "");
                description = description.replace(/(",')/, "*");
            } catch{
                doku.ageRating = 0;
            }
            doku.description = description;
        }
        this.dokulist.run(
            `INSERT INTO "main"."dokus" 
            ("path", "date", "description", "ageRating", "year", "source", "extension", "title")
            VALUES (?,?, ?, ?, ?, ?, ?, ?);`,
            doku.path, doku.date.valueOf(), doku.description, doku.ageRating, doku.year, doku.source, doku.extension, doku.title
        ).catch((err) => {
            console.log(doku);
            console.log(err);
        });
    }

}

export default new Dokus();