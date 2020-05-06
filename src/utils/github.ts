import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Repository } from "../types";
import { auth as TOKEN } from "./config.json";

const instance: AxiosInstance = axios.create({
	baseURL: "https://api.github.com",
	headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
});

const _getRepos = async (username: string, count: number, cursor?: string) => {
	if (cursor) cursor = ` ,after:"${cursor}"`;
	const query: string = `
            query{
                user(login: "${username}") {
                    repositories(first: ${count}, privacy:PUBLIC, ${cursor ? cursor : ""}) {
                        edges {
                            node {
                                id
                                url
                                name
                                createdAt
                                description
                            }
                            cursor
                        }
                    }
                }
            }
        `;

	const resp: AxiosResponse = await instance.post("/graphql", { query });
	let repos: Repository[] = await resp.data.data.user.repositories.edges.map(
		({ node, cursor }: { node: Repository; cursor: string }) => ({ ...node, cursor })
	);
	return repos;
};

export const getRepos = async (username: string) => {
	try {
		const query1: string = `
            query{
                user(login: "${username}") {
                    repositories(privacy:PUBLIC) {
                        totalCount
                    }
                }
            }
        `;
		const resp1: AxiosResponse = await instance.post("/graphql", { query: query1 });
		if (resp1.data.errors) return [];

		let totalCount: number = await resp1.data.data.user.repositories.totalCount;
		if (totalCount === 0) return [];

		let repos: Repository[] = [];
		let cursor: string = "";
		while (totalCount > 0) {
			let _repos: Repository[] = [];
			if (totalCount < 100) {
				_repos = await _getRepos(username, totalCount);
				// console.log(totalCount, _repos.length, _repos, cursor, _repos[_repos.length - 1]);
			} else {
				_repos = await _getRepos(username, 100, cursor);
				cursor = _repos[_repos.length - 1].cursor;
				// console.log(totalCount, _repos.length, _repos, cursor, _repos[_repos.length - 1]);
			}
			repos = [...repos, ..._repos];
			totalCount -= 100;
		}

		repos = repos.sort(
			(a: Repository, b: Repository) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		);
		console.log(Array.from(new Set(repos.map(r => r.name))).length, repos.length);
		return repos;
	} catch (error) {
		console.log(error);
		return [];
	}
};
