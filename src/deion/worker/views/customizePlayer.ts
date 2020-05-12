import { PLAYER } from "../../common";
import { finances, player } from "../core";
import { idb } from "../db";
import { face, g } from "../util";
import type {
	UpdateEvents,
	ViewInput,
	PlayerWithoutKey,
} from "../../common/types";

const updateCustomizePlayer = async (
	inputs: ViewInput<"customizePlayer">,
	updateEvents: UpdateEvents,
) => {
	if (!g.get("godMode")) {
		// https://stackoverflow.com/a/59923262/786644
		const returnValue = {
			errorMessage: "You can't customize players unless you enable God Mode.",
		};
		return returnValue;
	}

	if (updateEvents.includes("firstRun")) {
		const teams = (await idb.cache.teams.getAll()).map(t => {
			return {
				tid: t.tid,
				text: `${t.region} ${t.name}`,
			};
		});

		let appearanceOption;
		let originalTid;

		let p: PlayerWithoutKey;
		if (inputs.pid === null) {
			// Generate new player as basis
			const teamSeasons = await idb.cache.teamSeasons.indexGetAll(
				"teamSeasonsByTidSeason",
				[
					[g.get("userTid"), g.get("season") - 2],
					[g.get("userTid"), g.get("season")],
				],
			);
			const scoutingRank = finances.getRankLastThree(
				teamSeasons,
				"expenses",
				"scouting",
			);
			p = player.generate(
				PLAYER.FREE_AGENT,
				20,
				g.get("season"),
				false,
				scoutingRank,
			);
			appearanceOption = "Cartoon Face";
			p.imgURL = "http://";
		} else {
			// Load a player to edit
			const p2 = await idb.getCopy.players({
				pid: inputs.pid,
			});

			if (!p2) {
				// https://stackoverflow.com/a/59923262/786644
				const returnValue = {
					errorMessage: "Player not found.",
				};
				return returnValue;
			}

			p = p2;

			await face.upgrade(p);

			if (p.imgURL.length > 0) {
				appearanceOption = "Image URL";
			} else {
				appearanceOption = "Cartoon Face";
				p.imgURL = "http://";
			}

			originalTid = p.tid;
		}

		return {
			appearanceOption,
			minContract: g.get("minContract"),
			originalTid,
			p,
			phase: g.get("phase"),
			season: g.get("season"),
			teams,
		};
	}
};

export default updateCustomizePlayer;
