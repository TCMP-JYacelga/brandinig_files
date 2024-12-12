widgetMetaData.retirementBalance = function(widgetId, widgetType)
{
	let metadata = {
			  'title': getDashLabel('retirementBalance.title','Retirement Planner'),
			  'desc': getDashLabel('retirementBalance.desc','Retirement Planner Widget'),
			  'type': 'card',
			  "widgetType" : widgetType,
			  "cloneMaxCount": 1,
			  'subType': '',  
			  'icon':'',
			  'fields': {
				'columns': [],
				'rows':{}	
			  },
			  'refresh' : function (metatata) {
			  },
			  'actions' : {
				  'custom' : {
					  'title' : getDashLabel('setting','Settings'),
					  'callbacks' : {
						  'click' : function(metaData){
						  }
					  }
				  },
				  'refresh' : {
					  'callbacks' : {
						  'init' : function(addData, metaData){
								$('#widget-body-'+widgetId).empty();
								var container = $("#widget-body-" + widgetId);
								const padding = 0.3;
								// set the dimensions and margins of the graph
								var margin = {
										top: 10,
										right: 30,
										bottom: 30,
										left: 60
									},
									width = container.width() - margin.left - margin.right,
									height = container.height() - margin.top - margin.bottom;

								// append the svg object to the body of the page
								var svg = d3.select('#widget-body-'+widgetId)
									.append("svg")
									.attr("width", width + margin.left + margin.right)
									.attr("height", height + margin.top + margin.bottom)
									.append("g")
									.attr("transform",
										"translate(" + margin.left + "," + margin.top + ")");

								//Read the data

							   data = [
							{
								"age":30,
								"income":0,
								"type":"standard",
							  },
							  {
								"age":38,
								"income":200000,
								"type":"standard",
							  },
							   {
								"age":40,
								"income":400000,
								"type":"standard",
							  },
								{
								"age":42,
								"income":500000,
								"type":"standard",
							  },
								{
								"age":44,
								"income":650000,
								"type":"standard",
							  },
								{
								"age":46,
								"income":800000,
								"type":"standard",
							  },
								{
								"age":48,
								"income":1000000,
								"type":"standard",
							  },
								{
								"age":50,
								"income":1200000,
								"type":"standard",
							  },
								{
								"age":52,
								"income":1300000,
								"type":"standard",
							  },
								{
								"age":54,
								"income":1400000,
								"type":"standard",
							  },
								{
								"age":56,
								"income":1400000,
								"type":"standard",
							  },
							  {
								"age":58,
								"income":1400000,
								"type":"standard",
							  },
							  {
								"age":60,
								"income":1400000,
								"type":"standard",
							  },
							  {
								"age":62,
								"income":1200000,
								"type":"standard",
							  },
							  {
								"age":64,
								"income":1200000,
								"type":"standard",
							  },
							  {
								"age":66,
								"income":1000000,
								"type":"standard",
							  },
							  {
								"age":68,
								"income":800000,
								"type":"standard",
							  },
							  {
								"age":70,
								"income":800000,
								"type":"standard",
							  },
							  {
								"age":72,
								"income":650000,
								"type":"standard",
							  },
							  {
								"age":74,
								"income":650000,
								"type":"standard",
							  },
							  {
								"age":78,
								"income":600000,
								"type":"standard",
							  },
							  {
								"age":80,
								"income":500000,
								"type":"standard",
							  },
							  {
								"age":82,
								"income":500000,
								"type":"standard",
							  },
							  {
								"age":84,
								"income":300000,
								"type":"standard",
							  },
							  {
								"age":86,
								"income":200000,
								"type":"standard",
							  },
							  {
								"age":88,
								"income":100000,
								"type":"standard",
							  },
							  {
								"age":90,
								"income":0,
								"type":"standard",
							  },
							  {
								"age":38,
								"income":200000,
								"type":"actual",
							  },
								{
								"age":39,
								"income":150000,
								"type":"actual",
							  },
								{
								"age":40,
								"income":350000,
								"type":"actual",
							  },
								{
								"age":43,
								"income":500000,
								"type":"actual",
							  },
								{
								"age":44,
								"income":700000,
								"type":"actual",
							  },
								{
								"age":45,
								"income":800000,
								"type":"actual",
							  },
							  {
								"age":46,
								"income":900000,
								"type":"actual",
							  }, 
							  {
								"age":46,
								"income":900000,
								"type":"imaginary",
							  },
							  {
								"age":48,
								"income":1100000,
								"type":"imaginary",
							  },
							  {
								"age":50,
								"income":1300000,
								"type":"imaginary",
							  },
							  {
								"age":52,
								"income":1400000,
								"type":"imaginary",
							  },
							  {
								"age":54,
								"income":1500000,
								"type":"imaginary",
							  },
							  {
								"age":56,
								"income":1500000,
								"type":"imaginary",
							  },
							  {
								"age":58,
								"income":1500000,
								"type":"imaginary",
							  },
							  {
								"age":60,
								"income":1500000,
								"type":"imaginary",
							  },
							  {
								"age":62,
								"income":1300000,
								"type":"imaginary",
							  },
							  {
								"age":64,
								"income":1300000,
								"type":"imaginary",
							  },
							  {
								"age":66,
								"income":1100000,
								"type":"imaginary",
							  },
							  {
								"age":68,
								"income":900000,
								"type":"imaginary",
							  },
							  {
								"age":70,
								"income":900000,
								"type":"imaginary",
							  },
							  {
								"age":72,
								"income":750000,
								"type":"imaginary",
							  },
							  {
								"age":74,
								"income":750000,
								"type":"imaginary",
							  },
							  {
								"age":78,
								"income":700000,
								"type":"imaginary",
							  },
							  {
								"age":80,
								"income":600000,
								"type":"imaginary",
							  },
							  {
								"age":82,
								"income":600000,
								"type":"imaginary",
							  },
							  {
								"age":84,
								"income":400000,
								"type":"imaginary",
							  },
							  {
								"age":86,
								"income":300000,
								"type":"imaginary",
							  },
							  {
								"age":88,
								"income":200000,
								"type":"imaginary",
							  },
							  {
								"age":90,
								"income":100000,
								"type":"imaginary",
							  }
							 ];


							// group the data: I want to draw one line per group
							var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
								.key(function(d)
								{
									return d.type;
								})
								.entries(data);

							// Add X axis --> it is a date format
							var x = d3.scaleLinear()
								.domain(d3.extent(data, function(d)
								{
									return d.age;
								}))
								.range([0, width]);
							svg.append("g")
								.attr("transform", "translate(0," + height + ")")
								.call(d3.axisBottom(x).ticks(20));

							// Add Y axis
							var y = d3.scaleLinear()
								.domain([0, d3.max(data, function(d)
								{
									return +d.income;
								}) + 400000])
								.range([height, 0]);
							svg.append("g")
								.call(d3.axisLeft(y));

							// color palette
							var res = sumstat.map(function(d)
							{
								return d.key
							}) // list of group names
							var color = d3.scaleOrdinal()
								.domain(res)
								.range(['#C137A2', '#694ED6','#a11ebb'])

							// Draw the line
							svg.selectAll(".line")
								.data(sumstat)
								.enter()
								.append("path")
								//.attr("fill", "#ADE0EB") // Ocean B75
								.attr("fill", function(d) {
									if (d.key === 'standard' || d.key === 'actual') {
										return "#ADE0EB";
									}	else if(d.key === 'imaginary') {
										return "#FFFFFF";
									}
								})
								//.attr("fill-opacity", .3)
								.attr("fill-opacity", function(d) {
									if (d.key === 'standard' || d.key === 'actual') {
										return .3;
									}	else if(d.key === 'imaginary') {
										return 0;
									}
								})
								.attr("stroke", function(d)
								{
									return color(d.key)
								})
								.attr("stroke-width", function(d) {
									if (d.key === 'standard') {
										return 4.0;
									}
									else if(d.key === 'imaginary') {
										return 0.3;
									}
									return 1.5;
								})
								.attr("d", function(d)
								{
									return d3.line()
										.x(function(d)
										{
											return x(d.age);
										})
										.y(function(d)
										{
											return y(+d.income);
										})
										(d.values)
								})

							svg.selectAll("myCircles")
								.data(data)
								.enter()
								.append("circle")
								.attr("fill", "#F3C65A")
								.attr("stroke", "#C137A2")
								.attr("cx", function(d)
								{
									if (d.age == 60) return x(d.age)
								})
								.attr("cy", function(d)
								{
									if (d.age == 60) return y(d.income)
								})
								.attr("r", 5)
						  }
					  }
				  }
			  }
	}
	return metadata;
}

