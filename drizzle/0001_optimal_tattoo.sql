CREATE TABLE `business_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`website` varchar(500) NOT NULL,
	`contactName` varchar(255),
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`leadSource` enum('inbound','outbound') NOT NULL,
	`scoreToken` varchar(64),
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`subscriptionStatus` enum('none','active','canceled','past_due') NOT NULL DEFAULT 'none',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `business_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `business_profiles_scoreToken_unique` UNIQUE(`scoreToken`)
);
--> statement-breakpoint
CREATE TABLE `score_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessProfileId` int NOT NULL,
	`scoreReportId` int NOT NULL,
	`previousScore` decimal(5,2),
	`currentScore` decimal(5,2),
	`scoreChange` decimal(5,2),
	`changesSummary` text,
	`isBiweeklyUpdate` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `score_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `score_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessProfileId` int NOT NULL,
	`overallScore` decimal(5,2),
	`seoScore` decimal(5,2),
	`visibilityScore` decimal(5,2),
	`localPresenceScore` decimal(5,2),
	`reputationScore` decimal(5,2),
	`scanType` enum('fast','full') NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`recommendations` text,
	`competitorBenchmarks` text,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `score_reports_id` PRIMARY KEY(`id`)
);
