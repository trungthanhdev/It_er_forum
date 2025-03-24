import { ResPostRecent } from "./resPostRecent.dto";
import { ResPostShort } from "./resPostShort.dto";

export class ResHome{
    recommend_posts : ResPostShort[];
    recent_posts : ResPostRecent[];
}