import { Doku, iDoku  } from "../common/doku";
import fs, { PathLike} from "fs";
import Path from "path";
import sqlite3 from "sqlite3";
import { open} from "sqlite";
import { Database} from "sqlite";

/**
 *
 *
 * @export
 * @class Dokus
 */
export class Dokus {
    private static instance: Dokus;
    private dokulist: Database<sqlite3.Database, sqlite3.Statement>;
    constructor() {
        sqlite3.verbose();
        
    }


    /**
     *
     *
     * @returns {Promise<Doku[]>}
     * @memberof Dokus
     */
    public async getDokus(): Promise<Doku[]> {
        const promise = new Promise<Doku[]>((resolve) => {
            const tempDokus: Array<Doku> = [];
            this.dokulist.all<iDoku[]>("SELECT * FROM dokus").then((result) => {
                result.forEach((row) => {
                    tempDokus.push(Doku.fromInterface(row));
                });
                resolve(tempDokus);
            }).catch((err) => {
                console.log(err);
            });

        });

        return promise;
    }
    public init(dir: PathLike ):void{
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
    public allFilesSync(dir: PathLike, fileList: Array<Doku> = []): Doku[] {
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
                            description = description.replace(/(",')/, "*");
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
        return fileList;
    }

    private pushDoku(doku: Doku) {
        //console.log(doku);
        this.dokulist.run(
            `INSERT INTO "main"."dokus" 
            ("path", "date", "description", "ageRating", "year", "source", "extension", "title")
            VALUES (?,?, ?, ?, ?, ?, ?, ?);`,
            doku.path,doku.date.valueOf(),doku.description,doku.ageRating,doku.year,doku.source,doku.extension,doku.title
            ).catch((err) => {
                console.log(doku);
                console.log(err);
            });
    }

}

export default new Dokus();