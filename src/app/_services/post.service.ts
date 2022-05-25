import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, first, firstValueFrom, map, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post, PostFormData } from '../_models/post';
import { AuthenticationService } from './authentication.service';
import { getExtension } from 'mime';

@Injectable({
    providedIn: 'root'
})
export class PostService implements OnDestroy {

    private tokenSubscrption: Subscription;
    private currentPostSubscription: Subscription;

    private postsSubject = new BehaviorSubject<Post[]>([]);
    public postsObservable = this.postsSubject.asObservable();

    private currentPostSubject = new BehaviorSubject<Post | undefined>(undefined);;
    public currentPostObservable = this.currentPostSubject.asObservable();

    private currentPostMediaUrlsSubject = new BehaviorSubject<File[]>([]);
    public currentPostMediaUrlsObservable = this.currentPostMediaUrlsSubject.asObservable();

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService,
    ) {
        this.tokenSubscrption = this.authenticationService.accessTokenObservable.subscribe({
            next: (token) => {
                if (token) this.onPostUpdate();
                else this.postsSubject.next([]);
            }
        });

        this.currentPostSubscription = this.currentPostObservable.subscribe({
            next: async (post) => {
                this.currentPostMediaUrlsSubject.next([]);

                if (!post || !post.multiMedia) return;

                const files = await Promise.all(
                    post.multiMedia.map((media) => {
                        return this.getMedia(post.id, media.index);
                    })
                );
                this.currentPostMediaUrlsSubject.next(files);
            }
        });
    }

    ngOnDestroy(): void {
        this.tokenSubscrption.unsubscribe();
        this.currentPostSubscription.unsubscribe();
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
        this.currentPostSubject.next(undefined);
        const url = new URL(`${this.requestUrl.pathname}/${id}`, this.requestUrl.origin);
        const post = await firstValueFrom(this.http.get(url.toString(), { headers: this.requestHeader })) as Post;
        this.currentPostSubject.next(post);
    }

    private async getMedia(postId: string, index: number) {
        const url = new URL(`${this.requestUrl.pathname}/${postId}/media/${index}`, this.requestUrl.origin);
        const res = await firstValueFrom(this.http.get(
            url.toString(),
            {
                headers: this.requestHeader,
                responseType: 'blob',
            }
        ));
        const fileName = `${(crypto as any).randomUUID()}.${getExtension(res.type)}`;
        return new File([res], fileName);
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

    async updatePost(id: string, title?: string, content?: string, mediaFiles?: File[]) {
        const apiUrl = new URL(this.requestUrl);
        const url = new URL(`${apiUrl.pathname}/${id}`, apiUrl.origin).toString();

        const formData = new FormData();
        if (title) formData.append('title', title);
        if (content) formData.append('content', content);
        if (mediaFiles) mediaFiles.map(f => formData.append('multimedia', f, f.name));

        const requestObservable = this.http.patch(url, formData, { headers: this.requestHeader });
        await firstValueFrom(requestObservable);
        this.onPostUpdate(id);
    }
}
