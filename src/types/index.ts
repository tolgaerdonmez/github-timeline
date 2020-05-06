export interface Repository {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	url: string;
	[key: string]: string;
}
