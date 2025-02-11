"use client";

import { Run } from "@/db/schema";
import { ImageGenerationResult } from "./ImageGenerationResult";

interface UserRunsProps {
	runs: Run[];
}

export function UserRuns({ runs }: UserRunsProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{runs.map((run) => {
				// Construir la URL de la imagen basada en el runId
				const imageUrl = run.image_url || 
					`https://comfy-deploy-output.s3.us-east-2.amazonaws.com/outputs/runs/${run.run_id}/image.png`;

				return (
					<div 
						key={run.run_id}
						className="space-y-4"
					>
						<ImageGenerationResult
							imageUrl={imageUrl}
							className="w-full"
						/>
						<div className="text-sm text-gray-500">
							<p>Estado: {run.live_status}</p>
							<p>ID: {run.run_id}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
