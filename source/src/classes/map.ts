import { group } from '@angular/animations';
import { Group } from './group';
import { Tile, TileFiller, TileFixed, TileGroup } from './tile'

export class Map {
	settings: any;
	spawnLocation: {x: number, y: number }[] = [];
	tiles: Tile[] = [];
	groups: Group[] = [];

	constructor(inter?: IMap)
	{
		if (inter)
		{
			this.settings = inter.settings
			this.spawnLocation = inter.spawnLocation;
			this.tiles = inter.tiles;
			this.groups = inter.groups;
		}
	}

	addTile(tile: Tile)
	{
		this.tiles = this.tiles.filter((_tile) => !(_tile.x == tile.x && _tile.y == tile.y));
		this.tiles.push(tile);
	}
	removeTile(tile: Tile)
	{
		this.tiles = this.tiles.filter((_tile) => !(_tile.x == tile.x && _tile.y == tile.y));
	}

	addGroup()
	{
		let i: number = 0;
		let found: boolean = false;
		while (!found) {
			found = true;
			i++;
			this.groups.forEach((_group: Group) => {
				if (_group.id == i)
					found = false;
			});
		}
		this.groups.push(new Group(i));
	}
	removeGroup(id: number)
	{
		this.tiles = this.tiles.filter(_tile => !(_tile instanceof TileGroup && _tile.groupId == id));
		this.groups = this.groups.filter(_group => _group.id != id);
	}
	generateStaticMap(): Tile[]
	{
		let res: Tile[] = [];
		let temp: Tile[] = this.tiles;
		res = temp.filter(_tile => _tile instanceof TileFixed);
		temp = temp.filter(_tile => !(_tile instanceof TileFixed));
		res = res.concat(temp.filter(_tile => _tile instanceof TileFiller));
		temp = temp.filter(_tile => !(_tile instanceof TileFiller));
		
		this.groups.forEach(_group => {
			let groupTiles: Tile[] = temp.filter(_tile => _tile instanceof TileGroup && _tile.groupId == _group.id);
			let combinations: {ressource: number, number: number}[] = _group.generateCombinations();
			let rand: number = 0;
			let comb: {ressource: number, number: number};

			temp = temp.filter(_tile => !(_tile instanceof TileGroup && _tile.groupId == _group.id));

			groupTiles.forEach(_tile => {
				if (combinations.length == 0)
					combinations = _group.generateCombinations();
				rand = Math.floor(Math.random() * combinations.length);
				comb = combinations[rand];
				if (comb.ressource > 5)
					res.push(new TileFiller(_tile.x, _tile.y, +comb.ressource - 6));
				else 
					res.push(new TileFixed(_tile.x, _tile.y, +comb.ressource, +comb.number));

				combinations.splice(rand, 1);
			});
		});
		console.log(res);
		
		return (res);
	}
}
export interface IMap {
	settings: any;
	spawnLocation: {x: number, y: number }[],
	tiles: Tile[],
	groups: Group[]
}