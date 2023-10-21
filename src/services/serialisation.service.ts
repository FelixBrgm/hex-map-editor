import { Injectable } from '@angular/core';
import { Tile, TileFiller, TileFixed } from 'src/classes/tile';

@Injectable({
  providedIn: 'root'
})
export class SerialisationService {

	base64: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

	constructor() { }

	serialize(tiles: Tile[]): string
	{
		let link: string = "";
		
		tiles.forEach(_tile => {
			link = link.concat(this.generateTile64(_tile));
		})
		return (link);
	}

	private generateTile64(tile: Tile): string
	{
		let s: string = "";
		let x: number;
		let y: number;
		let typ: number = 0;
		let n: number = 0;

		if (tile.x > 127 || tile.x < -128 || tile.y > 127 || tile.y < -128)
			return "";

		x = tile.x + 128;
		s = s.concat(this.base64[x % 64]);
		y = tile.y + 128;
		s = s.concat(this.base64[y % 64]);

		if (tile instanceof TileFiller)
		{
			typ = +(+tile.type + 6);
			n = 0;
		}
		else if (tile instanceof TileFixed)
		{
			typ = +tile.ressource;
			n = +tile.productionNumber;
		}

		s = s.concat(this.base64[(Math.floor(x/64)) * 16 + typ]);		
		s = s.concat(this.base64[(Math.floor(y/64)) * 16 + n]);
		return (s);
	}

	deserialize(s: string): Tile[]
	{
		let tiles: Tile[] = [];

		if (s.length % 4 != 0)
			return [];
		for (let i = 0; i < s.length; i+= 4)
		{
			tiles.push(this.generateTileFrom64(s.substring(i, i + 4)));
		}

		return (tiles);
	}

	private generateTileFrom64(s: string): Tile
	{
		let tile: Tile;
		let x: number;
		let y: number;
		let typ: number = 0;
		let n: number = 0;

		x = this.getBase64(s.charAt(0));
		x += (Math.floor(this.getBase64(s.charAt(2)) / 16)) * 64;
		y = this.getBase64(s.charAt(1));
		y += (Math.floor(this.getBase64(s.charAt(3)) / 16)) * 64;
		x -= 128;
		y -= 128;

		typ = this.getBase64(s.charAt(2)) % 16;
		n = this.getBase64(s.charAt(3)) % 16;

		if (n == 0)
			return (new TileFiller(x, y, +typ -6));
		else 
			return (new TileFixed(x, y, +typ, n));
	}

	private getBase64(s: string)
	{
		for (let i = 0; i < this.base64.length; i++)
		{
			const e = this.base64.charAt(i);
			if (e == s)
				return (i);
		}
		return (0);
	}

}
