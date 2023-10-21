import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js'

@Injectable({
  providedIn: 'root'
})

export class InitService {
	cursor: {x: number, y: number} = {x: 0, y: 0};
	drag: boolean = false;

	constructor() { }

	init_application(): PIXI.Application
	{
		let app = new PIXI.Application({
			width: window.innerWidth * (5/8),
			height: 1000,
			backgroundColor: 0xF0F0F0,
			view: document.getElementById('controls') as HTMLCanvasElement
		});
		document.body.appendChild(app.view).setAttribute("id", "canvas");
		return (app);
	}

	init_container(app: PIXI.Application): PIXI.Container
	{
		let container: PIXI.Container = new PIXI.Container;
		app.stage.addChild(container);
		container.x = app.screen.width /2;
		container.y = app.screen.height /2;
		container.scale.set(0.25);
		this.init_movement(container);
		return (container);
	}

	init_movement(container: PIXI.Container)
	{
		let canvas = document.getElementById('canvas');

		if (canvas)
		{
			// Zoom
			canvas.addEventListener("wheel", (event: any) => {
				let zoom: number = event.deltaY;
			
				zoom = zoom > 0 ? 2 : 0.5;
				zoom = container.scale.x >= 1 && zoom == 2 ? 1 : zoom;
				zoom = container.scale.x <= 0.125 && zoom == 0.5 ? 1 : zoom;
				container.scale.set(container.scale.x * zoom);        
			});
			// Movement
			canvas.addEventListener("mousedown", (event: any) => {
				this.cursor.x = event.clientX;
				this.cursor.y = event.clientY;
				this.drag = false;
			});
			canvas.addEventListener("mouseup", () => {
				this.cursor.x = 0;
				this.cursor.y = 0;
				this.drag = false;
			});
			canvas.addEventListener("mousemove", (event: any) => {
				this.drag = true;
		
				if (this.drag && this.cursor.x != 0 && this.cursor.y != 0)
				{
					container.x += event.clientX - this.cursor.x;
					container.y += event.clientY - this.cursor.y;
					this.cursor.x = event.clientX;
					this.cursor.y = event.clientY;
				}
			});
		}
    
	}
}
