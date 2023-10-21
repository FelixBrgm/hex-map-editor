import { Injectable } from '@angular/core';
import { Tile } from 'src/classes/tile';
import { RenderTile } from './render.service';
import * as PIXI from 'pixi.js'
import { ClickService } from '../click.service';
import { InitService } from '../init.service';

@Injectable({
  providedIn: 'root'
})

export class UpdateContainerService {
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
  constructor(private clickSrv: ClickService, private initSrv: InitService) { }

   updateContainer(container: PIXI.Container, tiles: RenderTile[]): PIXI.Container
	{
		let hex: PIXI.Graphics;

		if (container === undefined)
			container = new PIXI.Container;
		while (container.children[0])
		{
			container.children[0].off('click');
			container.children[0].destroy();
			container.removeChild(container.children[0]);
		}
		for (let i = 0; i < tiles.length; i++)
		{
				const tile = tiles[i];
				hex = this.getHexGraphics(tile);
				hex.on('click', (e: any) => {
					if (!this.initSrv.drag)
						this.clickSrv.clickEE.emit({event: e, x: tile.x, y: tile.y});
				});
				container.addChild(hex);
		}
		return (container);
	}

	getHexGraphics(tile: RenderTile): PIXI.Graphics 
	{
		let hex: PIXI.Graphics = new PIXI.Graphics();
		let chip: PIXI.Text;
		
		chip = new PIXI.Text(tile.text, {fontFamily : 'Arial', fontSize: 50, fill : 0x000000, align : 'center'});
		chip.x = this.getHexPoints(tile)[0]- 115;
		chip.y = this.getHexPoints(tile)[1] - 60;
		hex.addChild(chip);

		hex.lineStyle(5, 0x0000000, 1);
		hex.beginFill(this.tileColors[tile.type]);
		hex.drawPolygon(this.getHexPoints(tile));
		hex.endFill();
		hex.interactive = true;
		return (hex);
	}

	getHexPoints(tile: Tile): number[] 
	{
		let shape: number[] = [];
		let step = (Math.PI * 2) / 6;
		let start = (30 / 180) * Math.PI;
		
		for (let i = 0; i < 6; i++) 
		{
			shape.push(Math.cos(start + (step * i)) * 100);
			shape.push(Math.sin(start + (step * i)) * 100);
		}
		
		// Offset on the uneven slots
		for (let i = 0; i < shape.length; i++) 
		if (i % 2 == 0 && (tile.y % 2 == 1 || tile.y % 2 == -1))
			shape[i] += 87;
		// Adding the up and down
		for (let i = 0; i < shape.length; i++)
			if (i % 2 == 1)
				shape[i] += tile.y * 149;
		// Adding the left and right
		for (let i = 0; i < shape.length; i++)
			if (i % 2 == 0)
				shape[i] += tile.x * 173;
		
		return (shape);
	}

	tileExistsInTiles(x: number, y: number, tiles: Tile[]): boolean
	{
		for (let i = 0; i < tiles.length; i++) 
		{
			const e = tiles[i];
			if (e.x == x && e.y == y)
				return (true);
		}
		return (false);
	}
}
