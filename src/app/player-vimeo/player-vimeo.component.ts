import { Component, AfterViewInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import * as Player from '@vimeo/player/dist/player.js';

@Component({
	selector: 'app-player-vimeo',
	templateUrl: './player-vimeo.component.html',
	styleUrls: [ './player-vimeo.component.sass' ]
})
export class PlayerVimeoComponent implements AfterViewInit {
	player: Player;
	safeUrl: SafeResourceUrl;
	simpleHeight: string;
	playbtn: any = {
		playTop: '0px',
		playLeft: '0px',
		playWidth: '80px',
		playHeight: '80px'
	};
	isPlay: Boolean = false;
	showVideo: Boolean = false;
	initial = 0;
	hidePlayBtn: Boolean = false;

	@Input() video: any;
	@Output() closeVideo = new EventEmitter();

	constructor(private sanitizer: DomSanitizer) {}

	// @HostListener('window:resize', ['$event'])
	// onResize(event) {
	//   this.setPositionPlayBtn();
	// }

	ngAfterViewInit() {
		this.showVideo = this.video ? true : false;
		if (this.video) {
			// 239385825
			this.showVideo = true;
			// this.player = new Player('handstick', {
			//   id: this.video,
			//   autoplay: true,
			//   autopause: false,
			//   responsive: true,
			//   maxwidth: 640
			// });
			setTimeout(() => {
				this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
					`https://player.vimeo.com/video/${this.video}?autoplay=true`
				);
			}, 0);
			// this.player.on('pause', () => {
			//   console.log('pause');
			//   this.isPlay = false;
			// });
			// this.player.ready().then(() => {
			//   this.setPositionPlayBtn();
			// });
			// setTimeout(() => {
			//   this.playVideo();
			// }, 1000);
		} else {
			this.showVideo = false;
		}
	}

	playVideo() {
		this.player.play().then(() => {
			this.isPlay = true;
		});
	}

	// setPositionPlayBtn() {
	//   const tmpW = document.getElementById('handstick').offsetWidth;
	//   const tmpH = document.getElementById('handstick').offsetHeight;
	//   this.playbtn.playWidth = tmpW * 0.15 + 'px';
	//   this.playbtn.playHeight = tmpW * 0.15 + 'px';
	//   this.playbtn.playLeft = ((tmpW * 0.5)) - 10 + 'px';
	//   this.playbtn.playTop = (tmpH * 0.5) + 10 + 'px';
	//   if (window.innerWidth < 391) {
	//     this.hidePlayBtn = true;
	//   } else {
	//     this.hidePlayBtn = false;
	//   }
	// }

	simple_height() {
		if (window.innerWidth > 768) {
			this.simpleHeight = window.innerHeight * 0.8 + 'px';
		} else {
			this.simpleHeight = window.innerHeight + 'px';
		}
	}
}
