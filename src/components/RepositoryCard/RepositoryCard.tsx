import React, { ReactElement } from "react";
import { Repository } from "../../types";
import "./RepositoryCard.css";

interface RepositoryCardProps extends Repository {}

function RepositoryCard({ name, description, createdAt, url }: RepositoryCardProps): ReactElement {
	return (
		<div className="repo-card">
			<a href={url} target="_blank" rel="noopener noreferrer">
				<h2>
					<span>{name}</span>
				</h2>
			</a>
			<p className="desc">{description}</p>
			<p className="date">{new Date(createdAt).toLocaleDateString()}</p>
		</div>
	);
}

export default RepositoryCard;
