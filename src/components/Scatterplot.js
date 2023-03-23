import React, { useRef, useEffect} from "react";
import * as d3 from "d3";



const Scatterplot = (props) => {

	const splotSvg = useRef(null);
	const svgSize = props.margin * 2 + props.size;

	useEffect(() => {
		// TODO
		
	});

	return (
		<div>
			<svg ref={splotSvg} width={svgSize} height={svgSize}> 
			</svg>
		</div>
	)
};

export default Scatterplot;