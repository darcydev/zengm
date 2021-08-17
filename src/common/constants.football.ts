import type { CompositeWeights, Conf, Div } from "./types";
import type { Position, PrimaryPosition, RatingKey } from "./types.football";

const COMPOSITE_WEIGHTS: CompositeWeights<RatingKey> = {
	passingAccuracy: {
		ratings: ["tha", "hgt"],
		weights: [1, 0.2],
		skill: {
			label: "Pa",
			cutoff: 0.71,
		},
	},
	passingDeep: {
		ratings: ["thp", "tha", "hgt"],
		weights: [1, 0.1, 0.2],
		skill: {
			label: "Pd",
			cutoff: 0.71,
		},
	},
	passingVision: {
		ratings: ["thv", "hgt"],
		weights: [1, 0.5],
		skill: {
			label: "Ps",
		},
	},
	athleticism: {
		ratings: ["stre", "spd", "hgt"],
		weights: [1, 1, 0.2],
		skill: {
			label: "A",
		},
	},
	rushing: {
		ratings: ["stre", "spd", "elu"],
		weights: [0.5, 1, 1],
		skill: {
			label: "X",
		},
	},
	catching: {
		ratings: ["hgt", "hnd"],
		weights: [0.2, 1],
		skill: {
			label: "H",
			cutoff: 0.73,
		},
	},
	gettingOpen: {
		ratings: ["hgt", "spd", "rtr", "hnd"],
		weights: [1, 1, 2, 1],
	},
	passBlocking: {
		ratings: ["hgt", "stre", "spd", "pbk"],
		weights: [0.5, 1, 0.2, 1],
		skill: {
			label: "Bp",
			cutoff: 0.63,
		},
	},
	runBlocking: {
		ratings: ["hgt", "stre", "spd", "rbk"],
		weights: [0.5, 1, 0.4, 1],
		skill: {
			label: "Br",
		},
	},
	passRushing: {
		ratings: ["hgt", "stre", "spd", "prs", "tck"],
		weights: [1, 1, 0.5, 1, 0.1],
		skill: {
			label: "PR",
			cutoff: 0.63,
		},
	},
	runStopping: {
		ratings: ["hgt", "stre", "spd", "rns", "tck"],
		weights: [0.5, 1, 0.5, 1, 0.25],
		skill: {
			label: "RS",
		},
	},
	passCoverage: {
		ratings: ["hgt", "spd", "pcv"],
		weights: [0.1, 1, 1],
		skill: {
			label: "L",
			cutoff: 0.72,
		},
	},
	tackling: {
		ratings: ["spd", "stre", "tck"],
		weights: [1, 1, 2.5],
	},
	avoidingSacks: {
		ratings: ["thv", "elu", "stre"],
		weights: [1, 1, 0.25],
	},
	ballSecurity: {
		ratings: ["bsc", "stre"],
		weights: [1, 0.2],
	},
	endurance: {
		ratings: [50, "endu"],
		weights: [1, 1],
	},
	kickingPower: {
		ratings: ["kpw"],
		weights: [1],
	},
	kickingAccuracy: {
		ratings: ["kac"],
		weights: [1],
	},
	punting: {
		ratings: ["ppw", "pac"],
		weights: [1, 1],
	},
};

const PLAYER_GAME_STATS = {
	passing: {
		name: "Passing",
		stats: [
			"pssCmp",
			"pss",
			"cmpPct",
			"pssYds",
			"pssTD",
			"pssInt",
			"pssSk",
			"pssSkYds",
			"qbRat",
			"fmbLost",
		],
		sortBy: ["pssYds"],
	},
	rushing: {
		name: "Rushing",
		stats: ["rus", "rusYds", "rusYdsPerAtt", "rusLng", "rusTD", "fmbLost"],
		sortBy: ["rusYds"],
	},
	receiving: {
		name: "Receiving",
		stats: ["tgt", "rec", "recYds", "recYdsPerAtt", "recLng", "recTD"],
		sortBy: ["recYds"],
	},
	kicking: {
		name: "Kicking",
		stats: ["fg", "fga", "fgPct", "fgLng", "xp", "xpa", "xpPct", "kickingPts"],
		sortBy: ["kickingPts"],
	},
	punting: {
		name: "Punting",
		stats: ["pnt", "pntYdsPerAtt", "pntIn20", "pntTB", "pntLng", "pntBlk"],
		sortBy: ["pnt"],
	},
	returns: {
		name: "Returns",
		stats: [
			"kr",
			"krYds",
			"krYdsPerAtt",
			"krLng",
			"krTD",
			"pr",
			"prYds",
			"prYdsPerAtt",
			"prLng",
			"prTD",
		],
		sortBy: ["krYds", "prYds"],
	},
	defense: {
		name: "Defense",
		stats: [
			"defTckSolo",
			"defTckAst",
			"defTck",
			"defTckLoss",
			"defSk",
			"defSft",
			"defPssDef",
			"defInt",
			"defIntYds",
			"defIntTD",
			"defIntLng",
			"defFmbFrc",
			"defFmbRec",
			"defFmbYds",
			"defFmbTD",
			"defFmbLng",
		],
		sortBy: ["defTck"],
	},
};

const PLAYER_SUMMARY = {
	summaryPss: {
		name: "SummaryQB",
		onlyShowIf: ["QB"],
		stats: [
			"gp",
			"av",
			"qbRec",
			"cmpPct",
			"pssYds",
			"pssYdsPerAtt",
			"pssTD",
			"pssInt",
		],
	},
	summaryRus: {
		name: "SummaryRus",
		onlyShowIf: ["RB"],
		stats: ["gp", "av", "rus", "rusYds", "rusYdsPerAtt", "rusTD"],
	},
	summaryRec: {
		name: "SummaryRec",
		onlyShowIf: ["WR", "TE"],
		stats: ["gp", "av", "rec", "recYds", "recYdsPerRec", "recTD"],
	},
	summaryOL: {
		name: "SummaryOL",
		onlyShowIf: ["OL"],
		stats: ["gp", "av"],
	},
	summaryKic: {
		name: "SummaryKic",
		onlyShowIf: ["K"],
		stats: ["gp", "av", "fg", "fga", "xp", "xpa"],
	},
	summaryPunt: {
		name: "SummaryPunt",
		onlyShowIf: ["P"],
		stats: ["gp", "av", "pnt", "pntYds", "pntYdsPerAtt"],
	},
	summaryDef: {
		name: "SummaryDef",
		onlyShowIf: ["DL", "LB", "CB", "S"],
		stats: ["gp", "av", "defTck", "defSk", "defFmbRec", "defInt"],
	},
};
const PLAYER_STATS_TABLES = {
	passing: {
		name: "Passing",
		onlyShowIf: ["pss"],
		stats: [
			"gp",
			"gs",
			"qbRec",
			"pssCmp",
			"pss",
			"cmpPct",
			"pssYds",
			"pssTD",
			"pssTDPct",
			"pssInt",
			"pssIntPct",
			"pssLng",
			"pssYdsPerAtt",
			"pssAdjYdsPerAtt",
			"pssYdsPerCmp",
			"pssYdsPerGame",
			"qbRat",
			"pssSk",
			"pssSkYds",
			"pssNetYdsPerAtt",
			"pssAdjNetYdsPerAtt",
			"pssSkPct",
			"av",
		],
	},
	rushing: {
		name: "Rushing and Receiving",
		onlyShowIf: ["rus", "rec"],
		stats: [
			"gp",
			"gs",
			"rus",
			"rusYds",
			"rusTD",
			"rusLng",
			"rusYdsPerAtt",
			"rusYdsPerGame",
			"rusPerGame",
			"tgt",
			"rec",
			"recYds",
			"recTD",
			"recLng",
			"recYdsPerRec",
			"recPerGame",
			"recYdsPerGame",
			"recCatchPct",
			"touches",
			"ydsPerTouch",
			"ydsFromScrimmage",
			"rusRecTD",
			"fmb",
			"av",
		],
	},
	defense: {
		name: "Defense, Fumbles, and Penalties",
		onlyShowIf: ["gp"],
		stats: [
			"gp",
			"gs",
			"defInt",
			"defIntYds",
			"defIntTD",
			"defIntLng",
			"defPssDef",
			"defFmbFrc",
			"defFmbRec",
			"defFmbYds",
			"defFmbTD",
			"defFmbLng",
			"defSk",
			"defTck",
			"defTckSolo",
			"defTckAst",
			"defTckLoss",
			"defSft",
			"fmb",
			"fmbLost",
			"pen",
			"penYds",
			"av",
		],
	},
	kicking: {
		name: "Kicking and Punting",
		onlyShowIf: ["fga", "xpa", "pnt"],
		stats: [
			"gp",
			"gs",
			"fg0",
			"fga0",
			"fg20",
			"fga20",
			"fg30",
			"fga30",
			"fg40",
			"fga40",
			"fg50",
			"fga50",
			"fgLng",
			"fg",
			"fga",
			"fgPct",
			"xp",
			"xpa",
			"xpPct",
			"pnt",
			"pntYds",
			"pntLng",
			"pntBlk",
			"pntYdsPerAtt",
			"av",
		],
	},
	returns: {
		name: "Kick and Punt Returns",
		onlyShowIf: ["pr", "kr"],
		stats: [
			"gp",
			"gs",
			"pr",
			"prYds",
			"prTD",
			"prLng",
			"prYdsPerAtt",
			"kr",
			"krYds",
			"krTD",
			"krLng",
			"krYdsPerAtt",
			"allPurposeYds",
			"av",
		],
	},
};
const TEAM_STATS_TABLES = {
	team: {
		name: "Team",
		stats: [
			"pts",
			"yds",
			"ply",
			"ydsPerPlay",
			"tov",
			"fmbLost",
			"pssCmp",
			"pss",
			"pssYds",
			"pssTD",
			"pssInt",
			"pssNetYdsPerAtt",
			"rus",
			"rusYds",
			"rusTD",
			"rusYdsPerAtt",
			"pen",
			"penYds",
			"drives",
			"drivesScoringPct",
			"drivesTurnoverPct",
			"avgFieldPosition",
			"timePerDrive",
			"playsPerDrive",
			"ydsPerDrive",
			"ptsPerDrive",
		],
	},
	opponent: {
		name: "Opponent",
		stats: [
			"oppPts",
			"oppYds",
			"oppPly",
			"oppYdsPerPlay",
			"oppTov",
			"oppFmbLost",
			"oppPssCmp",
			"oppPss",
			"oppPssYds",
			"oppPssTD",
			"oppPssInt",
			"oppPssNetYdsPerAtt",
			"oppRus",
			"oppRusYds",
			"oppRusTD",
			"oppRusYdsPerAtt",
			"oppPen",
			"oppPenYds",
			"oppDrives",
			"oppDrivesScoringPct",
			"oppDrivesTurnoverPct",
			"oppAvgFieldPosition",
			"oppTimePerDrive",
			"oppPlaysPerDrive",
			"oppYdsPerDrive",
			"oppPtsPerDrive",
		],
	},
};

const POSITIONS: Position[] = [
	"QB",
	"RB",
	"WR",
	"TE",
	"OL",
	"DL",
	"LB",
	"CB",
	"S",
	"K",
	"P",
	"KR",
	"PR",
];
const POSITION_COUNTS: Record<PrimaryPosition, number> = {
	QB: 3,
	RB: 4,
	WR: 6,
	TE: 3,
	OL: 9,
	DL: 9,
	LB: 7,
	CB: 5,
	S: 5,
	K: 1,
	P: 1,
};
const RATINGS: RatingKey[] = [
	"hgt",
	"stre",
	"spd",
	"endu",
	"thv",
	"thp",
	"tha",
	"bsc",
	"elu",
	"rtr",
	"hnd",
	"rbk",
	"pbk",
	"pcv",
	"tck",
	"prs",
	"rns",
	"kpw",
	"kac",
	"ppw",
	"pac",
];

const SIMPLE_AWARDS = ["mvp", "dpoy", "oroy", "droy", "finalsMvp"] as const;

const AWARD_NAMES = {
	mvp: "Most Valuable Player",
	dpoy: "Defensive Player of the Year",
	oroy: "Offensive Rookie of the Year",
	droy: "Defensive Rookie of the Year",
	finalsMvp: "Finals MVP",
	allLeague: "All-League",
	allRookie: "All-Rookie Team",
} as const;

const DEFAULT_CONFS: Conf[] = [
	{
		cid: 0,
		name: "American Conference",
	},
	{
		cid: 1,
		name: "National Conference",
	},
];

const DEFAULT_DIVS: Div[] = [
	{
		did: 0,
		cid: 0,
		name: "East",
	},
	{
		did: 1,
		cid: 0,
		name: "North",
	},
	{
		did: 2,
		cid: 0,
		name: "South",
	},
	{
		did: 3,
		cid: 0,
		name: "West",
	},
	{
		did: 4,
		cid: 1,
		name: "East",
	},
	{
		did: 5,
		cid: 1,
		name: "North",
	},
	{
		did: 6,
		cid: 1,
		name: "South",
	},
	{
		did: 7,
		cid: 1,
		name: "West",
	},
];

const DEFAULT_STADIUM_CAPACITY = 70000;

export {
	AWARD_NAMES,
	DEFAULT_CONFS,
	DEFAULT_DIVS,
	COMPOSITE_WEIGHTS,
	PLAYER_GAME_STATS,
	PLAYER_STATS_TABLES,
	PLAYER_SUMMARY,
	POSITION_COUNTS,
	POSITIONS,
	RATINGS,
	SIMPLE_AWARDS,
	TEAM_STATS_TABLES,
	DEFAULT_STADIUM_CAPACITY,
};
