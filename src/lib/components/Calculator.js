import { useState } from "react";
import cn from "classnames";

import { operations, keys } from "../constants";
import Button from "./Button";
import utils from "../utils";

const Calculator = ({ className = null }) => {
	const [inputValues, setInputValues] = useState({
		inputs: [0],
		result: "",
	});
	const [equation, setTheEquation] = useState(null);
	let { inputs, result } = inputValues;
	const {
		extraInputsFilter,
		matchTheEquation,
		spacingBetweenOperations,
		showFirstEntry,
		showLastEntry,
		roundingTheResult,
		repeatEqualOperations,
		isFinite,
		theSliceKeyShouldWork,
		sliceValue,
		calculateTheResult,
	} = utils;
	const resultLength = showLastEntry(inputs)?.length;
	const equationLength = spacingBetweenOperations(equation)?.length;

	const handleClick = (value) => {
		inputs.push(value);
		inputs = extraInputsFilter(inputs);

		if (Number(inputs) === Number(result) && equation) {
			inputs = [...repeatEqualOperations(equation, result)].join("");
		} else {
			setTheEquation(null);
		}

		const isEquation = matchTheEquation(inputs, "[-+×÷=]")?.join("");

		if (isEquation) {
			result = calculateTheResult(inputs.slice(0, -1));
			result = roundingTheResult(result);
			inputs = [result, inputs.slice(-1)].join("");
		}

		if (matchTheEquation(isEquation, "=")) {
			setTheEquation(isEquation);
		}

		setInputValues({
			inputs: inputs.split(""),
			result,
		});
	};

	const handleSliceClick = () => {
		if (theSliceKeyShouldWork(inputs)) {
			setInputValues(({ inputs, ...state }) => ({
				inputs: sliceValue(inputs),
				...state,
			}));
		}
	};

	const handleDeleteClick = () => {
		setInputValues({ inputs: [0], result: "" });
		setTheEquation(null);
	};

	return (
		<section className={cn("calculator", className, "flex-column")}>
			<div className="calculator__top-row">
				<div
					className={cn("calculator__input", "calculator__equation", {
						SBody: equationLength >= 31,
					})}
				>
					{spacingBetweenOperations(equation) || showFirstEntry(inputs)}
				</div>
				<div className="calculator__result-wrapper">
					<div
						className={cn("calculator__input", "calculator__result", {
							XLBody: resultLength < 13,
							LBody: resultLength >= 13 && resultLength < 17,
							MBody: resultLength >= 17,
						})}
					>
						{showLastEntry(inputs)}
					</div>
					<Button
						contentType="MBody"
						className="calculator__slice"
						onClick={handleSliceClick}
					>
						<svg viewBox="0 0 32 32">
							<path d="M12.633 8.816c-0.543 0-1.059 0.234-1.417 0.643l-5.132 5.865c-0.621 0.71-0.621 1.769 0 2.479l5.132 5.865c0.357 0.408 0.874 0.643 1.417 0.643h11.937c1.039 0 1.882-0.843 1.882-1.882v-11.73c0-1.040-0.843-1.882-1.882-1.882h-11.937zM8.383 6.98c1.072-1.226 2.621-1.928 4.25-1.928h11.937c3.119 0 5.647 2.528 5.647 5.647v11.73c0 3.119-2.528 5.647-5.647 5.647h-11.937c-1.628 0-3.178-0.703-4.25-1.928l-5.132-5.865c-1.863-2.129-1.863-5.308 0-7.437l5.132-5.865zM21.103 12.366l-2.698 2.698-2.698-2.698c-0.497-0.497-1.302-0.497-1.799 0s-0.497 1.302 0 1.799l2.698 2.698-2.698 2.698c-0.497 0.497-0.497 1.302 0 1.799s1.302 0.497 1.799 0l2.698-2.698 2.698 2.698c0.497 0.497 1.302 0.497 1.799 0s0.497-1.302 0-1.799l-2.698-2.698 2.698-2.698c0.497-0.497 0.497-1.302 0-1.799s-1.302-0.497-1.799 0z" />
						</svg>
					</Button>
				</div>
			</div>
			<div className={cn("calculator__bottom-row", "flex-row")}>
				<div className="calculator__wrapper">
					<Button
						children="c"
						className="calculator__delete"
						onClick={handleDeleteClick}
					/>
					<Button
						children="%"
						contentType="LBody"
						className={cn("calculator__percentage", {
							disable: isFinite(inputs),
						})}
						onClick={() => handleClick("%")}
					/>
					<div className="calculator__keyboard">
						{keys
							.map((character, index) => (
								<Button
									key={index}
									children={character}
									className={cn("calculator__keys", {
										disable: isFinite(inputs) && /[^0-9]/.test(character),
									})}
									onClick={() => handleClick(character)}
								/>
							))
							.reverse()}
					</div>
				</div>
				<div className={cn("calculator__operations", "flex-column")}>
					{operations.map(({ key, character }) => (
						<Button
							key={key}
							children={character}
							circular={key === "equal"}
							className={cn("calculator__operation-buttons", {
								disable: isFinite(inputs) && key !== "equal",
							})}
							onClick={() => handleClick(character)}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default Calculator;
