import React, { useRef, useEffect} from "react";
import * as d3 from "d3";



const Mainplot = (props) => {

	const splotSvg = useRef(null);
  const barplotSvg = useRef(null);
  const svgSize = props.margin * 2 + props.size;

  // TODO


	useEffect(() => {
    // TODO


	}, []);

	return (
		<div>
			<svg ref={splotSvg} width={svgSize} height={svgSize}> 
			</svg>
      <svg ref={barplotSvg} width={svgSize} height={svgSize}> 
			</svg>

		</div>
	)
};

export default Mainplot;