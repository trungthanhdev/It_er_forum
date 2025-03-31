import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "guard/jwt.guard";
import { RecommendService } from "./recommend.service";
import { ResHome } from "dto/resHome.dto";

@Controller('api/v1/recommend')
export class RecommendController {
    constructor(private readonly recommendService : RecommendService){}
    @Get("/")
    @UseGuards(JwtAuthGuard)
    async getLayout(@Req() req){
        console.log("In");
        return await this.recommendService.getLayout(req.user["user_id"]); 
    }

    @Get("/home")
    @UseGuards(JwtAuthGuard)
    async getHome(@Req() req){
        const resHome: ResHome =  await this.recommendService.getHome(req.user["user_id"]);
        await console.log(resHome);
        return resHome;
    }

    @Get("/popular")
    @UseGuards(JwtAuthGuard)
    async getPopular(){
        return await this.recommendService.getPopular(); 
    }

    @Get("/tags")
    @UseGuards(JwtAuthGuard)
    async getTags(){
        return await this.recommendService.getTags();
    }

    @Get("/tags/:id")
    @UseGuards(JwtAuthGuard)
    async getTagDetail(@Param('id') id, @Req() req){
        return await this.recommendService.getTagDetail(id,req.user["user_id"]);
    }
}