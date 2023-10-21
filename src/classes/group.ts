import { Ressource } from "src/enums/ressources";

export class Group {
	id: number;
	settings: GroupSettings;
	pockets: Pocket[] = [];

	constructor(id: number) {
		this.id = id;
		this.settings = {
			isFog: false
		}
		this.addPocket();
	}

	addPocket()
	{
		this.pockets.push(new Pocket());
	}
	generateCombinations(): {ressource: number, number: number}[]
	{
		let res: {ressource: number, number: number}[] = [];
		this.pockets.forEach(_pocket => {			
			res = res.concat(_pocket.generateCombinations());			
		});
		return (res);
	}
}

export class Pocket {
	numbers: {number: number, count: number}[] = [];
	ressources: {ressource: number, count: number}[] = [];

	constructor() { }

	generateCombinations(): {ressource: number, number: number}[]
	{
		let res: {ressource: number, number: number}[] = [];
		let tempRessources: number[] = this.generateArrayRessource();
		let tempNumbers: number[] = this.generateArrayNumbers();
		let rand: number = 0;

		tempRessources.forEach(_ressource => {
			if (tempNumbers.length == 0)
				tempNumbers = this.generateArrayNumbers();
			rand = Math.floor(Math.random() * tempNumbers.length);
			res.push({ressource: _ressource, number: tempNumbers[rand]});
			if (_ressource <= 5)
				tempNumbers.splice(rand, 1);
		});
		return (res);
	}

	private generateArrayRessource(): number[]
	{
		let res: number[] = [];
		this.ressources.forEach(_obj => {
			for (let i = 0; i < _obj.count; i++)
				res.push(_obj.ressource);
		});
		if (res.length == 0)
			return ([0]);
		return (res);
	}
	private generateArrayNumbers(): number[]
	{
		let res: number[] = [];
		this.numbers.forEach(_obj => {
			for (let i = 0; i < _obj.count; i++)
				res.push(_obj.number);
		});
		return (res);
	}
}

interface GroupSettings {
	isFog: boolean;
}