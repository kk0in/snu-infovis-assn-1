import React, { useRef, useEffect} from "react";
import * as d3 from "d3";



const Mainplot = (props) => {

	const splotSvg = useRef(null);
    const barplotSvg = useRef(null);
    const svgSize = props.margin * 2 + props.size;

    // TODO
	const compute_stats = (data) => {
		let x_mean = d3.mean(data, d => d[0]);
		let y_mean = d3.mean(data, d => d[1]);
		let x_std = d3.deviation(data, d => d[0]);
		let y_std = d3.deviation(data, d => d[1]);
		return {
			x_mean: x_mean,
			y_mean: y_mean,
			x_std: x_std,
			y_std: y_std
		};
	};

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
		
		const brush = d3.brush()
			.extent([[0, 0], [props.size, props.size]])
			.on("brush", brushed);


		splot.append('g')
			.attr("transform", `translate(${props.margin}, ${props.margin})`)
			.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", d => xScale(d[0]))
			.attr("cy", d => yScale(d[1]))
			.attr("r", props.radius)
			.attr("fill", "black");

		splot.append("g")
			.attr("transform", `translate(${props.margin}, ${props.margin})`)
			.call(brush);

		const update_barplot = (stats) => {
			const barplot = d3.select(barplotSvg.current);
			barplot.selectAll("*").remove();
			let bar_data = [
				{label: 'x', value: stats.x_mean, sd: stats.x_std},
				{label: 'y', value: stats.y_mean, sd: stats.y_std}
			];

			const xbarScale = d3.scaleBand()
				.domain(bar_data.map(d => d.label))
				.range([0, props.size])
				.align(0.5)
				.padding(props.barPadding);
			const ybarScale = d3.scaleLinear()
				.domain([0, d3.max(bar_data, d => d.value+d.sd)])
				.range([props.size, 0]);

			const xbarAxis = d3.axisBottom(xbarScale);
			const ybarAxis = d3.axisLeft(ybarScale);		
		
			barplot.append("g")
				.attr("transform", `translate(${props.margin}, ${props.margin + props.size})`)
				.call(xbarAxis);
			barplot.append("g")
				.attr("transform", `translate(${props.margin}, ${props.margin})`)
				.call(ybarAxis);	
			barplot.append('g')
				.attr("transform", `translate(${props.margin}, ${props.margin})`)
				.selectAll("rect")
				.data(bar_data)
				.enter()
				.append("rect")
				.attr("x", d => xbarScale(d.label))
				.attr("y", d => ybarScale(d.value))
				.attr("width", xbarScale.bandwidth())
				.attr("height", d => props.size - ybarScale(d.value))
				.attr("fill", d => d.label === 'x' ? 'lightgreen' : 'skyblue');

			barplot.append('g')
				.attr("transform", `translate(${props.margin}, ${props.margin})`)
				.selectAll("line")
				.data(bar_data)
				.enter()
				.append("line")
				.attr("x1", d => xbarScale(d.label) + xbarScale.bandwidth()/2)
				.attr("y1", d => ybarScale(d.value - d.sd))
				.attr("x2", d => xbarScale(d.label) + xbarScale.bandwidth()/2)
				.attr("y2", d => ybarScale(d.value + d.sd))
				.attr("stroke", "black")
				.attr("stroke-width", 2);
		}

		const stats = compute_stats(data);
		update_barplot(stats);

		function brushed(event) {
			if (!event.selection) return;
			
			const [[x0, y0], [x1, y1]] = event.selection;

			splot.append('g')
				.attr("transform", `translate(${props.margin}, ${props.margin})`)
				.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("cx", d => xScale(d[0]))
				.attr("cy", d => yScale(d[1]))
				.attr("r", props.radius)
				.style("fill", function (d, i) {
					const x = xScale(d[0]);
					const y = yScale(d[1]);
					let color = (x0 <= x && x <= x1 && y0 <= y && y <= y1) ? 'red' : 'black';
					d3.selectAll(`.circle${i}`)
						.style("fill", color);
					return color;
				});	

			let brush_data = data.filter(d => {
				const x = xScale(d[0]);
				const y = yScale(d[1]);
				return x0 <= x && x <= x1 && y0 <= y && y <= y1;
			});

			if (brush_data.length > 1) {
				update_barplot(compute_stats(brush_data));
			}
			else {
				update_barplot(compute_stats(data));
			}
		}
	}, [props.data, props.margin, props.size, props.radius, props.barPadding]);

	return (
		<div>
			<svg ref={splotSvg} width={svgSize} height={svgSize}></svg>
			<svg ref={barplotSvg} width={svgSize} height={svgSize}></svg>
		</div>
	)
};

export default Mainplot;