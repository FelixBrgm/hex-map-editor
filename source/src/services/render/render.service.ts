import { Injectable } from '@angular/core';
import { Map } from 'src/classes/map';
import * as PIXI from 'pixi.js'
import { ConvertMapToRenderTilesService } from './convert-map-to-render-tiles.service';
import { UpdateContainerService } from './update-container.service';
@Injectable({
  providedIn: 'root'
})
/*
    Tile colors
    selection = 0 0xF0F0F0
    wood = 1,   0x41963c
    brick = 2,  0xd0622e
    sheep = 3,  0x96b321
    wheat = 4,  0xeabb35
    ore = 5 ,   0xa4a9a5
	gold = 6 	0xffd700
	desert = 7  0xFAD5A5
    water = 8 , 0x2f67a3

	group = 9,  0xC70039

*/
export class RenderService {
	tileColors: number[] = [
		0xF0F0F0, 
		0x41963c, 
		0xd0622e, 
		0x96b321, 
		0xeabb35, 
		0xa4a9a5,
		0xffd700,
		0xFAD5A5,	
		0x2f67a3,
		0xC70039
	]

	constructor(private c: ConvertMapToRenderTilesService, private uC: UpdateContainerService) { }

	render(container: PIXI.Container, map: Map): PIXI.Container
	{
		let renderTiles: RenderTile[] = this.c.convertMapToRenderTiles(map);		
		return this.uC.updateContainer(container, renderTiles);
	}
}

export interface RenderTile {
	x: number;
	y: number;
	type: number;
	text: string;
}

