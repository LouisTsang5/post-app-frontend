import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, first, firstValueFrom, map, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post, PostFormData } from '../_models/post';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class PostService implements OnDestroy {

    private tokenSubscrption: Subscription;

    private postsSubject: BehaviorSubject<Post[]>;
    public postsObservable: Observable<Post[]>;

    private currentPostSubject: BehaviorSubject<Post | undefined>;
    public currentPostObservable: Observable<Post | undefined>;

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService,
    ) {
        this.postsSubject = new BehaviorSubject<Post[]>([]);
        this.postsObservable = this.postsSubject.asObservable();

        this.currentPostSubject = new BehaviorSubject<Post | undefined>(undefined);
        this.currentPostObservable = this.currentPostSubject.asObservable();

        this.tokenSubscrption = this.authenticationService.accessTokenObservable.subscribe({
            next: (token) => {
                if (token) this.onPostUpdate();
                else this.postsSubject.next([]);
            }
        });
    }

    ngOnDestroy(): void {
        this.tokenSubscrption.unsubscribe();
    }

    private get requestUrl() {
        return new URL(`${environment.apiURL}/post`);
    }

    private get requestHeader() {
        if (!this.authenticationService.accessToken)
            throw new Error('No access token available');
        return new HttpHeaders({ 'x-access-token': this.authenticationService.accessToken?.token as string });
    }

    async onPostUpdate(id?: string) {
        this.getPosts();
        if (id && this.currentPostSubject.value?.id === id) this.getCurrentPost(id);
    }

    private async getPosts() {
        const reqObs = this.http.get(this.requestUrl.toString(), { headers: this.requestHeader })
            .pipe(
                first(),
                map((res: any) => {
                    if (!res)
                        return [];

                    const posts: Post[] = [];
                    for (let i = 0; i < res.length; i++) {
                        const post = res[i] as Post;
                        posts.push(post);
                    }
                    return posts;
                })
            );
        const posts = await firstValueFrom(reqObs);
        this.postsSubject.next(posts);
    }

    private async getCurrentPost(id: string) {
        const url = new URL(`${this.requestUrl.pathname}/${id}`, this.requestUrl.origin);
        const post = await firstValueFrom(this.http.get(url.toString(), { headers: this.requestHeader })) as Post;
        this.currentPostSubject.next(post);
    }

    set currentPostId(id: string) {
        this.getCurrentPost(id);
    }

    async createPost(post: PostFormData) {
        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('content', post.content);
        if (post.multimedia) post.multimedia.map((file) => formData.append('multimedia', file, file.name));

        //Post to api
        await firstValueFrom(this.http.post(this.requestUrl.toString(), formData, { headers: this.requestHeader }));
        this.onPostUpdate();
    }

    async deletePost(id: string) {
        const apiUrl = new URL(this.requestUrl);
        const url = new URL(`${apiUrl.pathname}/${id}`, apiUrl.origin).toString();
        await firstValueFrom(this.http.delete(url, { headers: this.requestHeader }));
        this.onPostUpdate(id);
    }

    async updatePost(id: string, title?: string, content?: string) {
        const apiUrl = new URL(this.requestUrl);
        const url = new URL(`${apiUrl.pathname}/${id}`, apiUrl.origin).toString();
        const requestBody: { [key: string]: string } = {};
        if (title) requestBody['title'] = title;
        if (content) requestBody['content'] = content;
        const requestObservable = this.http.patch(url, requestBody, { headers: this.requestHeader });
        await firstValueFrom(requestObservable);
        this.onPostUpdate(id);
    }

    async getMedia(postId: string, index: number) {
        const url = new URL(`${this.requestUrl.pathname}/${postId}/media/${index}`, this.requestUrl.origin);
        const res = await firstValueFrom(this.http.get(
            url.toString(),
            {
                headers: this.requestHeader,
                responseType: 'blob',
            }
        ));
        return URL.createObjectURL(res);
    }
}
