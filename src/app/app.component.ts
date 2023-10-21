import * as PIXI from 'pixi.js'
import { Component } from '@angular/core'
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
// Custom Classes
import { IMap, Map } from 'src/classes/map';
import { InitService } from 'src/services/init.service';
import { RenderService } from 'src/services/render/render.service';
import { ClickService } from 'src/services/click.service';
import { Tile, TileFiller, TileFixed, TileGroup } from 'src/classes/tile';
import { Filler } from 'src/enums/filler';
import { Ressource } from 'src/enums/ressources';
import { group } from '@angular/animations';
import { Group, Pocket } from 'src/classes/group';
import { SerialisationService } from 'src/services/serialisation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	app: PIXI.Application;
	container: PIXI.Container;
	map: Map;
	ui: UI;
	link: string = "";
	tilesStatic: Tile[] = [];

	constructor (
		@Inject(DOCUMENT) private document: Document,
		private initSrv: InitService,
		private renderSrv: RenderService,
		private clickSrv: ClickService,
		private serialSrv: SerialisationService,
		private route: ActivatedRoute
		) {
		this.ui = {
			state: State.addingChip,
			addingChip: {
				ressource: 0,
				prodNumber: 6
			},
			addingFill: {
				filler: -1
			},
			group: {
				id: 0
			}
		}
		this.app = initSrv.init_application();
		this.container = initSrv.init_container(this.app);
		this.map = this.getUrlMap();
		this.clickSrv.clickEE.subscribe((e: any) => 
		{
			this.click(e.event, e.x, e.y);			
			this.renderSrv.render(this.container, this.map);
		});
		renderSrv.render(this.container, this.map);
	}

	click(event: any, x: number, y: number)
	{		
		if (this.ui.state == State.addingChip)
			this.map.addTile(new TileFixed(x, y, this.ui.addingChip.ressource, this.ui.addingChip.prodNumber));
		else if (this.ui.state == State.erase)
			this.map.removeTile(new Tile(x, y));
		else if (this.ui.state == State.addingFill)
			this.map.addTile(new TileFiller(x, y, this.ui.addingFill.filler))
		else if (this.ui.state == State.group)
			this.map.addTile(new TileGroup(x, y, this.ui.group.id));
	}

	// Download Map
	clickDownloadMap()
	{
		var file = new Blob([JSON.stringify(this.map)], {type: 'application/json'});
		var a = document.createElement("a"),
		url = URL.createObjectURL(file);
		a.href = url;
		a.download = "map";
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
	clickUploadMap(event: any)
	{		
		let file = event.target.files[0];
		let fileReader = new FileReader();
		fileReader.onload = (e) => 
		{
			// this.container = this.renderSrv.render(this.container, new Map);
			let s: string | ArrayBuffer | null = fileReader.result;
			if (s)
			{
				this.map = this.JsonToMap(JSON.parse(s as string));
			}
			
			this.renderSrv.render(this.container, this.map);
		}
		fileReader.readAsText(file);
		
	}
	private JsonToMap(obj: any): Map
	{
		let m: Map = new Map;
		m.settings = obj.settings;
		m.spawnLocation = obj.spawnLocation;
		if (obj.tiles)
		{
			obj.tiles.forEach((_objTile: any) => {
				if (_objTile.groupId)
					m.tiles.push(new TileGroup(_objTile.x, _objTile.y, +_objTile.groupId));
				else if (_objTile.productionNumber)
					m.tiles.push(new TileFixed(_objTile.x, _objTile.y, +_objTile.ressource, _objTile.productionNumber))
				else 
					m.tiles.push(new TileFiller(_objTile.x, _objTile.y, _objTile.type))
			});
		}
		if (obj.groups)
		{
			let temp: Group;
			let tempPocket: Pocket;
			obj.groups.forEach((_group: any) => {
				temp = new Group(_group.id);
				temp.pockets.splice(0, 1);
				temp.settings = _group.settings;
				if (_group.pockets)
				{
					_group.pockets.forEach((_pocket: any, i: number) => {						
						tempPocket = new Pocket();
						tempPocket.numbers = _pocket.numbers;
						tempPocket.ressources = _pocket.ressources;
						temp.pockets.push(tempPocket);
					});
				}
				m.groups.push(temp);
			});
		}
		return (m);
	}



	// Generate static map
	mapShow()
	{
		let m: Map = new Map();
		m.tiles	= this.map.generateStaticMap();
		this.tilesStatic = m.tiles;
		
		this.renderSrv.render(this.container, m);
	}

	// Link generation
	clickGenerateLink()
	{
		this.link = this.serialSrv.serialize(this.tilesStatic);
		console.log(this.serialSrv.deserialize(this.link));
		
	}
	getUrlMap(): Map
	{
		let m: Map = new Map;
		let param: any;

		console.log(this.route.snapshot);
		this.route.paramMap.subscribe(e => console.log(e));
		
		return (m);
	}

	// Click events
	changeState()
	{
		this.ui.addingChip.ressource = -1;
		this.ui.addingFill.filler = -1;
	}
	clickCursor()
	{
		this.changeState();
		this.ui.state = State.cursor;
		
	}
	clickRessource(ressource: Ressource)
	{
		this.changeState();
		this.ui.state = State.addingChip;
		this.ui.addingChip.ressource = ressource;
	}
	clickFiller(filler: Filler)
	{
		this.changeState();
		this.ui.state = State.addingFill;
		this.ui.addingFill.filler = filler;
	}
	clickErase()
	{
		this.changeState();
		this.ui.state = State.erase;
	}

	// Groups
	clickGroupAdd()
	{
		this.map.addGroup();
	}
	clickGroupDelete(id: number)
	{
		this.map.removeGroup(id);
		this.renderSrv.render(this.container, this.map);
	}
	clickGroupAddTiles(id: number)
	{
		this.changeState();
		this.ui.state = State.group;
		this.ui.group.id = id;
	}
	clickGroupAddPocket(id: number)
	{
		this.map.groups.find(_group => _group.id == id)?.addPocket();
	}
	clickGroupAddPocketRessource(groupId: number, pocketIndex: number)
	{
		this.map.groups.find(_group => _group.id == groupId)?.pockets[pocketIndex].ressources.push({ressource: 0, count: 1});
	}
	clickGroupPocketRemove(groupId: number, pocketIndex: number)
	{
		this.map.groups.find(_group => _group.id == groupId)?.pockets.splice(pocketIndex, 1);
	}
	clickGroupPocketRessourceRemove(groupId: number, pocketIndex: number, ressourceIndex: number)
	{
		this.map.groups.find(_group => _group.id == groupId)?.pockets[pocketIndex].ressources.splice(ressourceIndex, 1);
	}
	clickGroupPocketNumberRemove(groupId: number, pocketIndex: number, numberIndex: number)
	{
		this.map.groups.find(_group => _group.id == groupId)?.pockets[pocketIndex].numbers.splice(numberIndex, 1);
	}
	clickGroupAddPocketNumbers(groupId: number, pocketIndex: number)
	{
		this.map.groups.find(_group => _group.id == groupId)?.pockets[pocketIndex].numbers.push({number: 6, count: 1});
	}

}

enum State {
	cursor = 0,
	addingChip = 1,
	addingFill = 2,
	group = 3,
	erase = 4
}
interface UI {
	state: State,
	addingChip: {
		ressource: Ressource,
		prodNumber: number
	},
	addingFill: {
		filler: Filler
	},
	group: {
		id: number
	}
}
