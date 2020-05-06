import React, { FunctionComponent, useState } from "react";
import "./App.css";

import { Repository } from "./types";
import { getRepos } from "./utils/github";
import Timeline from "./components/Timeline/Timeline";

const App: FunctionComponent<{ initial?: Repository[] }> = ({ initial = [] }) => {
	const [username, setUsername] = useState("");
	const [repos, setRepos] = useState(initial);
	const [ready, setReady] = useState(false);
	const [loading, setLoading] = useState(false);

	async function fetchRepos() {
		setLoading(true);
		const repos: Repository[] = await getRepos(username);
		setRepos(repos);
		setReady(true);
		if (!repos.length) setUsername("");
		setLoading(false);
	}

	return (
		<div className="App">
			<h1>Github Timeline Generator</h1>
			<br />
			{ready && repos.length > 0 ? (
				<>
					<h2 className="username">{username}'s timeline</h2>
					<Timeline repos={repos} />
				</>
			) : repos.length === 0 ? (
				<>
					<form
						className="user-form"
						onSubmit={e => {
							e.preventDefault();
							fetchRepos();
						}}>
						<label htmlFor="usernameInput">Github Username:</label>
						<input
							id="usernameInput"
							type="text"
							onChange={e => setUsername(e.target.value)}
							value={username}
						/>
						<button onClick={fetchRepos}>Generate</button>
					</form>
					{ready ? <h1>No repositories found!</h1> : null}
				</>
			) : null}
			{loading ? <h1>Loading...</h1> : null}
		</div>
	);
};

export default App;
