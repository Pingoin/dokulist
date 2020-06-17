import { Doku } from "../common/doku";
import fs, { PathLike, OpenDirOptions } from "fs";
import Path from "path";
import sqlite3 from "sqlite3";
import { open, ISqlite, IMigrate } from "sqlite";
import { Database } from "sqlite";
export class Dokus {
    private static instance: Dokus;
    private dokulist: Database<sqlite3.Database, sqlite3.Statement>;
    constructor() {
        sqlite3.verbose();
        open<sqlite3.Database, sqlite3.Statement>({
            filename: ":memory:",
            driver: sqlite3.Database
        }).then((db) => {
            this.dokulist = db;
            this.dokulist.exec(`CREATE TABLE IF NOT EXISTS "dokus" (
                "title"	TEXT NOT NULL,
                "path"	TEXT NOT NULL,
                "year"	INTEGER,
                "ageRating"	INTEGER,
                "descrition"	TEXT,
                "source"	TEXT,
                "extension"	TEXT,
                PRIMARY KEY("title","path")
            );`);
        }).then(() => {
            this.dokulist.exec(
                "INSERT INTO \"dokus\" (\"title\", \"path\", \"year\", \"ageRating\", \"descrition\", \"source\", \"extension\") VALUES (\""
                + new Date().toISOString() + "\" , \"test\", 2020, 12, \"fdf\", \"dein Arsch\", \".mp3\");");
        }).then(() => {
            console.log("Datenbank");
        }).catch((err)=>{
            console.log(err);
        });
    }


    public async getDokus(): Promise<Doku[]> {
        const promise = new Promise<Doku[]>((resolve, reject) => {
            this.allFilesSync("N:\\");
            const tempDokus: Array<Doku> = [];
            this.dokulist.all("SELECT * FROM dokus").then((result) => {
                result.forEach((row)=>{
                    //console.log(row);
                    const tmpDoku:Doku=new Doku(row.title+row.extension,row.path,new Date());
                    tempDokus.push(tmpDoku);
                });
                resolve(tempDokus);
            }).catch((err) => {
                console.log(err);
            });
            
        });

        return promise;
    }
    static getInstance(): Dokus {
        if (!Dokus.instance) {
            Dokus.instance = new Dokus();
        }

        return Dokus.instance;
    }
    private allFilesSync(dir: PathLike, fileList: Array<Doku> = []): Doku[] {

        fs.readdirSync(dir).forEach(file => {
            const filePath = Path.join(dir.toString(), file);
            if (fs.statSync(filePath).isDirectory()) {
                this.allFilesSync(filePath, fileList);
            } else {
                if (/[(.mp4)(.mkv)]$/i.test(file)) {
                    const tmpDoku: Doku = new Doku(file, dir.toString(), new Date(fs.statSync(filePath).birthtime));
                    if (fs.existsSync(Path.join(dir.toString(), tmpDoku.title + ".json"))) {
                        //tmpDoku = Doku.fromJSON(require(Path.join(dir.toString(), tmpDoku.title + ".json")));
                    } else if (fs.existsSync(Path.join(dir.toString(), tmpDoku.title + ".txt"))) {
                        let regExp: RegExpExecArray;
                        const data = fs.readFileSync(Path.join(dir.toString(), tmpDoku.title + ".txt"), "ucs2");
                        const source: string = /Channel.*: (.*)/.exec(data)[1];
                        let description: string = /Description : (.*)/.exec(data)[1];
                        tmpDoku.source = source;
                        const removeArray: string[] = [
                            " Doku-Reihe, ",
                            tmpDoku.title
                        ];
                        removeArray.forEach(element => description = description.replace(element, ""));
                        try {
                            regExp = /Altersfreigabe: ab ([0-9]*)/.exec(description);
                            tmpDoku.ageRating = Number(regExp[1]);
                            description = description.replace(regExp[0], "");
                        } catch{
                            tmpDoku.ageRating = 0;
                        }
                        //console.log(tmpDoku.ageRating);

                        tmpDoku.description = description;

                    }
                    this.pushDoku(tmpDoku);
                    fileList.push(tmpDoku);
                }
            }
        });

        //homes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        /*
        fileList.sort((a: Doku, b: Doku) => {
            if (a.path < b.path) return -1;
            if (a.path > b.path) return 1;
            if (a.filename < b.filename) return -1;
            if (a.filename > b.filename) return 1;
            return 0;
        });*/

        return fileList;
    }

    private pushDoku(doku: Doku) {
        //console.log(doku);
        this.dokulist.exec(
            "INSERT INTO dokus (\"title\", \"path\", \"year\", \"ageRating\", \"descrition\", \"source\", \"extension\")"+ 
            " VALUES (\"" + doku.title + "\" , \""+doku.path+"\", " + doku.year.toString() + ", " 
            + doku.ageRating.toString() + ", \"" + doku.description + "\", \"" + doku.source + "\", \"" + doku.extension + "\");").catch((err)=>{
                console.log(err);});
    }

}

export default new Dokus();