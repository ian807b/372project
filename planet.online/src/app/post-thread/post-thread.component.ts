import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AppService } from "../app.service";

@Component({
  selector: 'app-post-thread',
  templateUrl: './post-thread.component.html',
  styleUrls: ['./post-thread.component.css']
})
export class PostThreadComponent implements OnInit{
  comments:any
  thread!: any;
  topic_id : any;
  post_id : any;
  body = ''
  currentUser = ''
  addPostForm: FormGroup;
  posts!: any;
  replies: any;
  url: any;
  captchaResolved : boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service:AppService,
    private formBuilder:FormBuilder) {
    this.addPostForm = this.formBuilder.group({
      content: ["", [Validators.required, Validators.minLength(1)]],
    });
    this.captchaResolved = false;
  }

  ngOnInit(): void {
    this.topic_id = this.route.snapshot.paramMap.get("topic_id");
    this.post_id = this.route.snapshot.paramMap.get("post_id");
    this.currentUser = this.service.getUsername();
    this.url = this.router.url.slice(0, this.router.url.indexOf("#") == -1 ? this.router.url.length : this.router.url.indexOf("#"))

    this.fetchPosts();
    this.thread = {};
    
  }

  // referneced https://shinumathew.medium.com/googles-recaptcha-v2-integration-with-angular-forms-ff2aca0cf7e9

  checkCaptcha(captchaResponse : string) {
    this.captchaResolved = (captchaResponse && captchaResponse.length > 0) ? true : false
  }


  parsePost(postContent: string): string {
    let newPostContent = postContent;
    function find_replies(text: string) {
      const replyRegex = />>[0-9]+/g;
      const replyingTo = text.match( replyRegex );
      let replyingToSet = new Set( replyingTo );
      return replyingToSet
    }
    let replyingToSet = find_replies(postContent);
    // console.log(replyingToSet)
    newPostContent = postContent;
    replyingToSet.forEach((id) => {
      let link = `<a href="${this.url}#${id.slice(2)}" skipLocationChange>${id}</a>`
      newPostContent = newPostContent.replaceAll(id, link)
    });
    // console.log(newPostContent)
    return newPostContent;
  }

  scrollToElement(element:any): void {
    element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  get_replies_for_post(post_id: number): any[] {
    let specificReplies:any[] = [];
    this.replies.forEach((reply: any) => {
      if(reply.parent_id == post_id) {
        specificReplies.push(reply.reply_id);
      }
    })
    // console.log(post_id)
    // console.log(specificReplies)
    return specificReplies;
  }

  split_posts_and_replies(postsRows: []):any {
    let prevId = -1;
    let posts: any[] = [];
    let replies: any[] = [];
    postsRows.forEach((post: any) => {
      if (post.p_post_id != prevId) {
        // new post
        posts.push(post);
      }
      // there's a reply
      if (post.parent_id != null) {
        replies.push({
          parent_id: post.parent_id,
          reply_id: post.reply_id
        })
      }
      prevId = post.p_post_id;
    })
    return ({
      posts: posts,
      replies: replies
    })
  }

  fetchPosts() {
    this.service.fetchPosts(this.post_id).subscribe((response: any) => {
      this.thread = response.thread;
      let result = this.split_posts_and_replies(response.posts)
      this.posts = result.posts;
      this.replies = result.replies;
    })
  }
  addReplyToBox(text: string) {
    const formData = this.addPostForm.value;
    this.addPostForm.patchValue({content: formData.content + ">>" + text});
  }

  // referenced https://dev.to/jorik/country-code-to-flag-emoji-a21
  getFlagEmoji(countryCode: string): string {
    const regex = /[A-Z]/;
    if (countryCode.match(regex) == null) {
      return "🏴‍☠️"
    } else {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    }
  }
  
  onSubmit(recaptcha:any) {
    if (!this.captchaResolved) {
      alert("Captcha needs to be solved.")
    } else {
      const formData = this.addPostForm.value;
      console.log(formData.content)
      if (!formData.content || formData.content.length == 0) {
        alert("Can't have empty post.")
        return;
      }
      this.service.addPost(this.topic_id, formData.content, this.post_id).subscribe((response: any) => {
        console.log(response)
        this.fetchPosts()
      });
      this.addPostForm.patchValue({'content': ""})
      this.captchaResolved = false;
      recaptcha.reset();
    }
  }
  cancel() {
    this.router.navigate(["/home"]);
  }
}
