import React, { useRef, useEffect} from "react";
import * as d3 from "d3";



const Scatterplot = (props) => {

	const splotSvg = useRef(null);
	const svgSize = props.margin * 2 + props.size;

	useEffect(() => {
		// TODO
		let data = props.data;	
		data.forEach(d => {
			d[0] = parseFloat(d[0]);
			d[1] = parseFloat(d[1]);
		});

		let xScale = d3.scaleLinear()
			.domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])])
			.range([0, props.size]);

		let yScale = d3.scaleLinear()
			.domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])])
			.range([props.size, 0]);

		const xAxis = d3.axisBottom(xScale);
		const yAxis = d3.axisLeft(yScale);

		
		const splot = d3.select(splotSvg.current);

		splot.append("g")
		.attr("transform", `translate(${props.margin}, ${props.margin + props.size})`)
		.call(xAxis);

		splot.append("g")
			.attr("transform", `translate(${props.margin}, ${props.margin})`)
			.call(yAxis);	

		splot.append('g')
			.attr("transform", `translate(${props.margin}, ${props.margin})`)
			.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", (d, i) => `circle${i}`)
			.attr("cx", d => xScale(d[0]))
			.attr("cy", d => yScale(d[1]))
			.attr("r", props.radius)
			.attr("style", (d, i) => (d.includes(i) ? "red" : "black"));
	

	}, [props.data, props.margin, props.size, props.radius]);

	return (
		<div>
			<svg ref={splotSvg} width={svgSize} height={svgSize}> 
			</svg>
		</div>
	)
};

export default Scatterplot;