import { csvFormat, csvParse } from "d3-dsv";
import { m, AnimatePresence } from "framer-motion";
import { ChangeEvent, useRef, useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import type { InjuriesSetting } from "../../../common/types";
import { confirm, downloadFile, toWorker } from "../../util";
import { godModeRequiredMessage } from "./SettingsForm";
import { resetFileInput } from "../../components/LeagueFileUpload";

const formatInjuries = (injuries: InjuriesSetting) =>
	injuries.map(row => ({
		id: Math.random(),
		name: row.name,
		frequency: String(row.frequency),
		games: String(row.games),
	}));

type InjuriesText = ReturnType<typeof formatInjuries>;

// https://stackoverflow.com/a/35200633/786644
const ImportButton = ({
	setErrorMessage,
	setInjuries,
}: {
	setErrorMessage: (errorMessage?: string) => void;
	setInjuries: (injuries: InjuriesText) => void;
}) => (
	<button
		className="btn btn-light-bordered"
		style={{ position: "relative", overflow: "hidden" }}
		onClick={() => {}}
	>
		Import
		<input
			className="cursor-pointer"
			type="file"
			style={{
				position: "absolute",
				top: 0,
				right: 0,
				minWidth: "100%",
				minHeight: "100%",
				fontSize: 100,
				display: "block",
				filter: "alpha(opacity=0)",
				opacity: 0,
				outline: "none",
			}}
			onClick={resetFileInput}
			onChange={event => {
				if (!event.target.files) {
					return;
				}
				const file = event.target.files[0];
				if (!file) {
					return;
				}

				setErrorMessage();

				const reader = new window.FileReader();
				reader.readAsText(file);

				reader.onload = event2 => {
					try {
						// @ts-ignore
						const rows = csvParse(event2.currentTarget.result);

						if (
							!rows.columns.includes("name") ||
							!rows.columns.includes("frequency") ||
							!rows.columns.includes("games")
						) {
							setErrorMessage(
								"File should be a CSV file with columns: name, frequency, games",
							);
							return;
						}

						setInjuries(formatInjuries(rows as any));
					} catch (error) {
						setErrorMessage(error.message);
						return;
					}
				};
			}}
		/>
	</button>
);

const ExportButton = ({ injuries }: { injuries: InjuriesText }) => (
	<button
		className="btn btn-light-bordered"
		onClick={() => {
			const output = csvFormat(injuries, ["name", "frequency", "games"]);

			downloadFile("injuries.csv", output, "text/csv");
		}}
	>
		Export
	</button>
);

const Controls = ({
	injuries,
	position,
	setInjuries,
}: {
	injuries: InjuriesText;
	position: "top" | "bottom";
	setInjuries: (
		injuries: InjuriesText | ((injuries: InjuriesText) => InjuriesText),
	) => void;
}) => {
	const [importErrorMessage, setImportErrorMessage] = useState<
		string | undefined
	>();

	return (
		<>
			<div className="d-flex justify-content-between">
				<div className="btn-group">
					<button
						className="btn btn-light-bordered"
						onClick={() => {
							const newInjury = {
								id: Math.random(),
								name: "Injury",
								frequency: "1",
								games: "1",
							};
							if (position === "top") {
								setInjuries(rows => [newInjury, ...rows]);
							} else {
								setInjuries(rows => [...rows, newInjury]);
							}
						}}
					>
						Add
					</button>
					<Dropdown>
						<Dropdown.Toggle
							className="btn-light-bordered btn-light-bordered-group-right"
							variant="foo"
							id="dropdown-injuries-reset"
						>
							Reset
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item
								onClick={async () => {
									setInjuries(
										formatInjuries(
											await toWorker("main", "getDefaultInjuries"),
										),
									);
								}}
							>
								Default
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() => {
									setInjuries([]);
								}}
							>
								Clear
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<div className="btn-group">
					<ImportButton
						setErrorMessage={setImportErrorMessage}
						setInjuries={setInjuries}
					/>
					<ExportButton injuries={injuries} />
				</div>
			</div>

			{importErrorMessage ? (
				<div className="text-danger mt-3">{importErrorMessage}</div>
			) : null}
		</>
	);
};

const Injuries = ({
	defaultValue,
	disabled,
	godModeRequired,
}: {
	defaultValue: InjuriesSetting;
	disabled: boolean;
	godModeRequired?: "always" | "existingLeagueOnly";
}) => {
	const [show, setShow] = useState(false);
	const [injuries, setInjuriesRaw] = useState(() =>
		formatInjuries(defaultValue),
	);
	const [dirty, setDirty] = useState(false);
	const lastSavedInjuries = useRef<InjuriesText | undefined>();

	const setInjuries = (injuries: Parameters<typeof setInjuriesRaw>[0]) => {
		setInjuriesRaw(injuries);
		setDirty(true);
	};

	const handleShow = () => setShow(true);
	const handleCancel = async () => {
		if (dirty) {
			const result = await confirm(
				"Are you sure you want to discard your changes?",
				{
					okText: "Discard",
					cancelText: "Cancel",
				},
			);
			if (!result) {
				return;
			}

			// Reset for next time
			setInjuriesRaw(lastSavedInjuries.current ?? formatInjuries(defaultValue));
			setDirty(false);
		}

		setShow(false);
	};
	const handleSave = (event: {
		preventDefault: () => void;
		stopPropagation: () => void;
	}) => {
		event.preventDefault();

		// Don't submit parent form
		event.stopPropagation();

		if (injuries.length === 0) {
			return;
		}

		// Save for next time
		lastSavedInjuries.current = injuries;
		setDirty(false);

		setShow(false);
	};

	const handleChange =
		(key: "name" | "frequency" | "games", i: number) =>
		(event: ChangeEvent<HTMLInputElement>) => {
			setInjuries(rows =>
				rows.map((row, j) => {
					if (i !== j) {
						return row;
					}

					return {
						...row,
						[key]: event.target.value,
					};
				}),
			);
		};

	const title = disabled ? godModeRequiredMessage(godModeRequired) : undefined;
	return (
		<>
			<button
				className="btn btn-secondary"
				type="button"
				disabled={disabled}
				title={title}
				onClick={handleShow}
			>
				Customize
			</button>

			<Modal show={show} onHide={handleCancel}>
				<Modal.Header closeButton>
					<Modal.Title>Injury Types</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						Injury rate is determined by the "Injury Rate" setting, which is
						viewable on the main League Settings page. The "Frequency" field
						here is a relative frequency or weight. It doesn't change how often
						injuries in general occur, but it does determine the probability
						that an injury will be a specific type.
					</p>
					<p>
						"Games" is the average number of games that will be missed. There is
						some variability based on luck and health spending.
					</p>

					<Controls
						position="top"
						injuries={injuries}
						setInjuries={setInjuries}
					/>

					{injuries.length > 0 ? (
						<form onSubmit={handleSave} className="my-3">
							<input type="submit" className="d-none" />
							<div className="form-row" style={{ marginRight: 22 }}>
								<div className="col-6 col-md-8">Name</div>
								<div className="col-3 col-md-2">Frequency</div>
								<div className="col-3 col-md-2">Games</div>
							</div>
							<AnimatePresence initial={false}>
								{injuries.map((injury, i) => (
									<m.div
										key={injury.id}
										initial={{ opacity: 0, y: -38 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{}}
										layout
										transition={{ duration: 0.2, type: "tween" }}
									>
										<div className="d-flex">
											<div className="form-row mt-1 flex-grow-1" key={i}>
												<div className="col-6 col-md-8">
													<input
														type="text"
														className="form-control"
														value={injury.name}
														onChange={handleChange("name", i)}
													/>
												</div>
												<div className="col-3 col-md-2">
													<input
														type="text"
														className="form-control"
														value={injury.frequency}
														onChange={handleChange("frequency", i)}
													/>
												</div>
												<div className="col-3 col-md-2">
													<input
														type="text"
														className="form-control"
														value={injury.games}
														onChange={handleChange("games", i)}
													/>
												</div>
											</div>
											<button
												className="text-danger btn btn-link pl-2 pr-0 border-0"
												onClick={() => {
													setInjuries(rows =>
														rows.filter(row => row !== injury),
													);
												}}
												style={{ fontSize: 20 }}
												title="Delete"
												type="button"
											>
												<span className="glyphicon glyphicon-remove" />
											</button>
										</div>
									</m.div>
								))}
							</AnimatePresence>
						</form>
					) : (
						<div className="mt-3 text-danger">
							You must define at least one injury type.
						</div>
					)}

					{injuries.length > 0 ? (
						<Controls
							position="bottom"
							injuries={injuries}
							setInjuries={setInjuries}
						/>
					) : null}
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-secondary" onClick={handleCancel}>
						Cancel
					</button>
					<button
						className="btn btn-primary"
						onClick={handleSave}
						disabled={injuries.length === 0}
					>
						Save
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Injuries;
