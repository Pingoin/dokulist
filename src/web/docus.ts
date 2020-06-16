import { Doku } from "../common/doku";
import fs, { PathLike } from "fs";
import Path from "path";
class Dokus {
    private dokulist: Array<Doku>;
    constructor() {
        this.dokulist = new Array<Doku>();
    }
    public getDokus() {
        //console.log(fs.readdirSync("N:\\"));
        return this.allFilesSync("N:\\");
    }

    private allFilesSync(dir: PathLike, fileList: Array<Doku> = []) {

        fs.readdirSync(dir).forEach(file => {
            const filePath = Path.join(dir.toString(), file);
            if (fs.statSync(filePath).isDirectory()) {
                this.allFilesSync(filePath, fileList);
            } else {
                if (/[(.mp4)(.mkv)]$/i.test(file)) {
                    let tmpDoku: Doku = new Doku(file, dir.toString(), new Date(fs.statSync(filePath).birthtime));
                    if (fs.existsSync(Path.join(dir.toString(), tmpDoku.title + ".json"))) {
                        //tmpDoku = Doku.fromJSON(require(Path.join(dir.toString(), tmpDoku.title + ".json")));
                    } else if (fs.existsSync(Path.join(dir.toString(), tmpDoku.title + ".txt"))) {
                        console.log();
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
                    fileList.push(tmpDoku);
                }
            }
        });

        //homes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

        fileList.sort((a: Doku, b: Doku) => {
            if (a.path < b.path) return -1;
            if (a.path > b.path) return 1;
            if (a.filename < b.filename) return -1;
            if (a.filename > b.filename) return 1;
            return 0;
        });

        return fileList;
    }

}

export default new Dokus();