import { ResPostShort } from "./resPostShort.dto";

export class ResDetailTag{
    tag_id: string;
    tag_name: string;
    tag_category: string;
    tag_description: string;
    num_posts: number;
    recommend_posts : ResPostShort[];
    is_subscribed: boolean;
}