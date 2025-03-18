import { PartialType } from "@nestjs/swagger";
import { CreatePost } from "./createPost.dto";

export class UpdatePostDto extends PartialType(CreatePost){}