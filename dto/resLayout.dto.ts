import { ResNotification } from './resNotification.dto';

export class ResLayout {
  username: string;
  ava_img_path: string;
  notifications: ResNotification[];
  subscribed_tags: any[];
  //{tag_id: string;
  //tag_title:  string;
  //posts_num: num}
}
