import { ResPostShort } from "./resPostShort.dto";

export class ResDetailTag{
    tag_id: string;
    tag_name: string;
    tag_category: string;
    tag_description: string;
    num_posts: number;
    is_subscribed: boolean;
    recommend_posts : ResPostShort[];

}