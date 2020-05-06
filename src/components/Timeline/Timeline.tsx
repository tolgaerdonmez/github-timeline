import React, { ReactElement } from "react";
import RepositoryCard from "../RepositoryCard/RepositoryCard";
import { Repository } from "../../types";
import "./Timeline.css";

export interface TimelineProps {
	repos: Repository[];
}

function Timeline({ repos }: TimelineProps): ReactElement {
	return (
		<div className="timeline">
			<ul>
				{repos.map((repo, index) => (
					<li key={repo.id + index}>
						<RepositoryCard {...repo} />
					</li>
				))}
			</ul>
			<div style={{ clear: "both" }}></div>
		</div>
	);
}

export default Timeline;
