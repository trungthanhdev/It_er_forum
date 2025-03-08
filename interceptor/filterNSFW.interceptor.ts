
import { date } from '@hapi/joi';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { sensitive_words } from 'src/bad_words';

@Injectable()
export class NSFWFilteredInterceptor implements NestInterceptor {
    private badWordsArr = sensitive_words 
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log(this.badWordsArr[1]);

    return next
      .handle()
      .pipe(
        map((data) => {
            if(Array.isArray(data)){
                data = data.filter(post => !this.containNSFW(post.post_content, this.badWordsArr))
            }else if(typeof data  === 'object'){
                if(this.containNSFW(data.post_content, this.badWordsArr)){
                    return null
                }
            }
            return data
        })
      );
  }

  private containNSFW(content: string, sensitiveWordArr: string[]){
    const contentFiltered = content
        return sensitiveWordArr.some(word => new RegExp(`\\b${word}\\b`, "i").test(contentFiltered))
  }
}
