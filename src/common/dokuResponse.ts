import { Doku} from "./doku";
export class DokuResponse{
public dokus:Doku[]=[];
public count:number;
public page:number;
public limit:number;
public template:string;
}