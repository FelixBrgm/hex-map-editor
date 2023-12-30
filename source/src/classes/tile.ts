import { Filler } from "src/enums/filler";
import { Ressource } from "src/enums/ressources";

export class Tile {
	x: number = 0;
	y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export class TileFixed extends Tile {
	ressource: Ressource;
	productionNumber: number;

	constructor(x: number, y: number, ressource: Ressource, productionNumber: number) {
		super(x, y);
		this.ressource = ressource;
		if (productionNumber <= 12 && productionNumber >= 2)
			this.productionNumber = productionNumber;
		else 
			this.productionNumber = 7;
	}
	
	public get getProdNumber() : number {
		return this.productionNumber;
	}

	public set setProdNumber(n : number) {
		if (n <= 12 && n >= 2)
			this.productionNumber = n;
	}
}

export class TilePort extends Tile {
	ressource: Ressource;
	conversion: number;
	oriantation: number;

	constructor(x: number, y: number, ressource: Ressource, conversion: number, oriantation: number = 0) {
		super(x, y);
		this.ressource = ressource;
		this.conversion = conversion;
		this.oriantation = oriantation;
	}
}

export class TileFiller extends Tile {
	type: Filler;

	constructor(x: number, y: number, type: Filler) {
		super(x, y);
		this.type = type;
	}
}

export class TileGroup extends Tile {
	groupId: number;

	constructor(x: number, y: number, groupId: number) {
		super(x, y);
		this.groupId = groupId;
	}
}