import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular App Consuming Youtube Data API';
  isLoading:boolean = false;
  error:string = '';
  response:Video[] = [];

  search:any = { keyword: '', channelId: '', type: '', maxResults: 5 };

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  //************************************************************************** */
  // Additional code for video controls
  //************************************************************************** */
  searchYoutube(): void {
    this.isLoading = true;
    const url = 'https://www.googleapis.com/youtube/v3/search';
    const urlParams = new HttpParams()
      .set('part', 'snippet')
      .set('key', 'AIzaSyA9KccjdLyfPQZ7swREQOqUxBm2pwe45F4')
      .set('q', this.search.keyword)
      .set('type', this.search.type)
      .set('channelId', this.search.channelId)
      .set('maxResults', this.search.maxResults);

    const options = { params: urlParams };
    
    this.http.get<any>(url, options).subscribe(
      (data) => {
        console.log(data);
        this.response = data;
        this.response = [];
        for(let i=0; i<data.items.length; i++){
          this.response[i] = JSON.parse(JSON.stringify(VIDEO_OBJECT_EMPTY));
          this.response[i].id = data.items[i].id.videoId;
          this.response[i].type = data.items[i].id.kind;
          this.response[i].title = data.items[i].snippet.title;
          this.response[i].thumbnail = data.items[i].snippet.thumbnails.medium.url;
        }
        this.isLoading = false;
      },
      (err) => {
        this.error = err;
        this.isLoading = false;
      });

  }

  getVideoSource(id: string): SafeResourceUrl {
    if(id != ''){
      const url = "https://www.youtube.com/embed/" + id + "?autoplay=1&mute=1";
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }else{
      return '';
    }
  }

  playOrPause(i: number): void {
    this.response[i].showVideo = !this.response[i].showVideo;
  }
  
}


export interface Video {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  showVideo: boolean;
}

export const VIDEO_OBJECT_EMPTY: Video = {
  id: '',
  title: '',
  type: '',
  thumbnail: '',
  showVideo: false
}