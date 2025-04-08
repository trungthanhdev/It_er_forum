export class ResPostDetail{
        user_id: string
        user_name: string
        ava_img_path: string
        tags: string[]  
        post_id: string
        post_title: string
        post_content: string
        img_url: string[]
        date_updated: Date
        upvote: number
        downvote: number
        // comments: [
        //    {
        //      user_id: string
        //      user_name: string
        //      ava_img_path: string
        //      comment_id: string
        //      comment_content: string
        //      upvote: number
        //      downvote: number
        //    }
        // ]
        comments: any[]
  
}