import { Injectable } from '@angular/core';
import { Tile, TileFiller, TileFixed, TileGroup, TilePort } from 'src/classes/tile';
import { Map } from 'src/classes/map';
import { RenderTile } from './render.service';


@Injectable({
  providedIn: 'root'
})
export class ConvertMapToRenderTilesService {

	constructor() { }
	convertMapToRenderTiles(map: Map): RenderTile[]
	{
		let res: RenderTile[] = [];

		map.tiles.forEach(_tile => {
			res.push(this.convertTileToRenderTile(_tile));
		});

		res = this.addPossibleTiles(res);

		return (res);
	}

	convertTileToRenderTile(tile: Tile): RenderTile
	{
		if (tile instanceof TileFixed)
		{
			return ({
				x: tile.x,
				y: tile.y,
				type: tile.ressource + 1,
				text: String(tile.getProdNumber)
			});
		}
		else if (tile instanceof TileFiller)
		{
			return ({
				x: tile.x,
				y: tile.y,
				type: tile.type + 7,
				text: ""
			});
		}
		else if (tile instanceof TileGroup)
		{
			return({
				x: tile.x,
				y: tile.y,
				type: 9,
				text: "G" + tile.groupId
			});
		}
		return {x: 0, y: 0, type: 0, text: "ERROR"};
	}

	getTileBorders(tiles: RenderTile[]): Borders
	{
		let borders: Borders = {
			x: {
				min: 0,
				max: 0
			},
			y: {
				min: 0,
				max: 0
			}
		};

		for (let i = 0; i < tiles.length; i++)
		{
			const tile = tiles[i];
			if (tile.x < borders.x.min)
				borders.x.min = tile.x;
			if (tile.x > borders.x.max)
				borders.x.max = tile.x;
			if (tile.y < borders.y.min)
				borders.y.min = tile.y;
			if (tile.y > borders.y.max)
				borders.y.max = tile.y;
		}

		borders.x.min--;
		borders.x.max++;
		borders.y.min--;
		borders.y.max++;

		return (borders);
	}

	addPossibleTiles(tiles:RenderTile[]): RenderTile[]
	{
		if (tiles.length == 0)
			return ([{x: 0, y: 0, type: 0, text: ""}]);
		
			let borders = this.getTileBorders(tiles);
		
		for (let x = borders.x.min; x <= borders.x.max; x++) 
		{
			for (let y = borders.y.min; y <= borders.y.max; y++)
			{
				if (!this.tileExistsInTiles(x, y, tiles))
					tiles.push({x: x, y: y, type: 0, text: ""});
			}
		}
		return (tiles);
	}

	tileExistsInTiles(x: number, y: number, tiles: RenderTile[]): boolean
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
interface Borders {
	x: {
		min: number,
		max: number
	},
	y: {
		min: number,
		max: number
	}
}