
/**
 * @summary     Data Visualization
 * @description create charts using D3 v5 lib
 * @version     1.0
 * @file        CashFlowForecast.js
 * @author      Jayesh Prajapati
 * @copyright   Copyright 2020 Finastra.
 */
widgetMetaData.cashFlowForecast = function(widgetId, widgetType)
{
	let metadata = {

				"title": getDashLabel("cashflow.title"),
				"desc": getDashLabel("cashflow.desc"),
				"type": "card",
				"widgetType" : widgetType,
				"cloneMaxCount": 4,
				"subType": "",  
				"icon":'<span class="material-icons"> account_balance </span>',
				"fields": {
					"columns": [],
					"rows":{}	
				},
				"actions" : 
				{
					"refresh" : {
						"callbacks" : {
							"init": function(addData, metaData) {
								var container = $("#widget-body-" + widgetId);
								container.html("<div class='container w100 h100'>" +
								"<div class='row'>" + 
								"<div class='col-sm'>" + 
								"<h5><strong>Suggestion:</strong> Cash balance forecast is too low. Provision additional financial resources to avoid liquidity issues.</h5>" + 
								"<h6>Cash flow statement - net inflow/outflow from operating, investing and financing activities in k$</h6>" + 
								"</div>" +  
								"</div>" +  
								"<div class='row'>" + 
								"<div class='col-sm waterfall'>" +  
								"</div>" +  
								"</div>" +  
								"</div>");

								const margin = { top: 30, right: 30, bottom: 30, left: 50 };
								const width = container.width() - margin.left - margin.right - 25;
								const height = container.height() - margin.top - margin.bottom - 114;
								const padding = 0.3;
								//var arrowstart = 0;
								const x = d3
								  .scaleBand()
								  .rangeRound([ 0, width ])
								  .padding(padding);
								
								const y = d3
								  .scaleLinear()
								  .range([ height, 0 ]);
								
								const xAxis = d3.axisBottom(x);
								
								const yAxis = d3
								  .axisLeft(y)
								  .tickFormat((d) => {
								    return d;
								  });
								
								const chart = d3
								  .select("#widget-body-" + widgetId + " .waterfall").append("svg")
								  .attr('width', width + margin.left + margin.right)
								  .attr('height', height + margin.top + margin.bottom)
								  .append('g')
								  .attr('transform', `translate(${ margin.left },${ margin.top })`);
								
								const type = (d) => {
								  d.value = +d.value;
								  return d;
								}; // type
								
								const eurFormat = (amount) => {
								  if (Math.abs(amount) > 1000000) {
								    return `${ Math.round(amount / 1000000) }M`;
								  }
								  if (Math.abs(amount) > 1000) {
								    return `${ Math.round(amount / 1000) }K`;
								  }
								  return `${ amount }`;
								}; // eurFormat
								
								const drawWaterfall = (data) => {
								  x.domain(data.map((d) => {
								    return d.name;
								  }));
								
								  y.domain([
								    0,
								    d3.max(data, (d) => {
								      return d.end;
								    })
								  ]);
								
								  chart
								    .append('g')
								    .attr('class', 'x axis')
								    .attr('transform', `translate(0,${ height })`)
								    .call(xAxis);
								
								  chart
								    .append('g')
								    .attr('class', 'y axis')
								    .call(yAxis);
								
								  const bar = chart.selectAll('.bar')
								    .data(data)
								    .enter().append('g')
								    .attr('class', (d) => {
								      return `bar ${ d.class }`;
								    })
								    .attr('transform', (d) => {
								      return `translate(${ x(d.name) },0)`;
								    });
								
								  bar
								    .append('rect')
								    .attr('y', (d) => {
								      return y(Math.max(d.start, d.end));
								    })
								    .attr('height', (d) => {
								      return Math.abs(y(d.start) - y(d.end));
								    })
								    .attr('width', x.bandwidth());
								
								  // Add the value on each bar
								  bar
								    .append('text')
								    .attr('x', x.bandwidth() / 2)
								    .attr('y', (d) => {
								      return (d.class === 'positive' || d.class === 'positive-forecast') ? y(d.end) : y(d.start);
								    })
								    .attr('dy', '-.5em')
								    .text((d) => {
								      return (d.class === 'total' || d.class === 'total-forecast')? eurFormat(d.start - d.end) : eurFormat(d.end - d.start);
								    })
								    .style('fill', 'black');
								
								  bar.filter((d, i) => {
								      return i === data.length - 1;
								    })
								    .append('line')
								    //.attr('class', 'connector')
								    .attr('x1', x.bandwidth() +7)
								    .attr('y1', (d) => {
								      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start) -25 : y(d.end);
								    })
								    .attr('x2', x.bandwidth() +7)
								    .attr('y2', (d) => {
								      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start) : y(d.end);
								    })
								    .attr("fill", "#F44336")
							        .attr("stroke", "#F44336")
                                    .attr("stroke-width", 1)
								  
								  bar.filter((d, i) => {
								      return i === data.length - 1;
								    })
                                    .append('text')
                                    .text('V')
                                    .attr('x', x.bandwidth() +7)
								    .attr('y', (d) => {
									      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start) +5 : y(d.end);
									    })
									.attr("fill", "#F44336")
							        .attr('dy', '-.5em');
								  
								  bar.filter((d, i) => {
								      return i === data.length - 1;
								    })
                                    .append('text')
                                    .text('-15')
                                    .attr('x', x.bandwidth() +30)
								    .attr('y', (d) => {
									      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start)-5 : y(d.end);
									    })
									.attr("fill", "#F44336")
							        .attr('dy', '-.5em');
								  
								  bar.filter((d, i) => {
								      return i === data.length - 1;
								    })
                                    .append('text')
                                    .text('-30%')
                                    .attr('x', x.bandwidth() +30)
								    .attr('y', (d) => {
									      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start) +7 : y(d.end);
									    })
									.attr("fill", "#F44336")
							        .attr('dy', '-.5em');
								  /**
								  bar
								    .filter((d, i) => {
								      // filter out first bar and total bars
								      return (d.class !== 'total' && i !== 0);
								    })
								    .append('ellipse')
								    .attr('class', 'bubble')
								    .attr('class', 'ellipse')
								    .attr('cx', x.bandwidth() / 2)
								    .attr('cy', (0 - margin.top) / 2)
								    .attr('rx', 30)
								    .attr('ry', '1em');
								
								  bar
								    .filter((d, i) => {
								      // filter out first bar and total bars
								      return (d.class !== 'total' && i !== 0);
								    })
								    .append('text')
								    .attr('x', x.bandwidth() / 2)
								    .attr('y', (0 - margin.top) / 2)
								    .attr('dy', '.3em')
								    .attr('class', 'bubble')
								    .text((d) => {
								      const percentage = d3.format('.1f')(((100 * (d.end - d.start)) / d.start));
								      return `${ percentage }%`;
								    });
								    */
								
								  // Add the connecting line between each bar
								  bar
								    .filter((d, i) => {
								      return i !== data.length - 1;
								    })
								    .append('line')
								    .attr('class', 'connector')
								    .attr('x1', x.bandwidth())
								    .attr('y1', (d) => {
								      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start) : y(d.end);
								    })
								    .attr('x2', (x.bandwidth() / (1 - padding)))
								    .attr('y2', (d) => {
								      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start) : y(d.end);
								    });
								  
								  bar.filter((d, i) => {
								      return i === data.length - 1;
								    })
								    .append('line')
								    .attr('class', 'connector')
								    .attr('x1', x.bandwidth())
								    .attr('y1', (d) => {
								      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start) : y(d.end);
								    })
								    .attr('x2', (d) => {
								      return  (d.class === 'total' || d.class === 'total-forecast') ? width: x(d.start);
								    })
								    .attr('y2', (d) => {
								      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start) : y(d.end);
								    });
								  
								  bar.append('line')
								    .attr('class', 'connector')
								    .attr('x1', x.bandwidth())
								    .attr('y1', (d) => {
								      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start) : y(d.end);
								    })
								    .attr('x2', (d) => {
								      const monthval =  new Date().getMonth()+1;
								      const dateval = new Date().getDate() +'.'+ monthval+ "." +new Date().getYear()%100;
								      //if(d.name === dateval && (d.class === 'total' || d.class === 'total-forecast'))arrowstart = y(d.start);
								      return d.name === dateval && (d.class === 'total' || d.class === 'total-forecast') ? width : x(d.start);
								    })
								    .attr('y2', (d) => {
								      return (d.class === 'total' || d.class === 'total-forecast') ? y(d.start) : y(d.end);
								    });
								  
								}; 
								// drawWaterfall
								
								
								const prepData = (data) => {
								  // create stacked remainder
								  const insertStackedRemainderAfter = (dataName, newDataName) => {
								    const index = data.findIndex((datum) => {
								      return datum.name === dataName;
								    }); // data.findIndex
								
								    return data.splice(index + 1, 0, {
								      name: newDataName,
								      start: data[index].end,
								      end: 0,
								      class: (data[index].forecast === true ? 'total-forecast': 'total'),
								    }); // data.splice
								  }; // insertStackedRemainder
								
								  // retrieve total value
								  let cumulative = 0;
								
								  // Transform data (i.e., finding cumulative values and total) for easier charting
								  data.map((datum) => {
								    datum.start = cumulative;
								    cumulative += datum.value;
								    datum.end = cumulative;
								    var forecast = datum.forecast === true ? "-forecast" : ""; 
								    return datum.class = (datum.value >= 0 ? 'positive' : 'negative') + forecast;
								  }); // data.map
								
								  // insert stacked remainders where approriate
								  var date = new Date().getDate();
								  insertStackedRemainderAfter('finan.', date + '.10.20');
								  insertStackedRemainderAfter('finan. ', date + '.11.20');
								  insertStackedRemainderAfter('finan.  ', date + '.12.20');
								  insertStackedRemainderAfter('finan.   ', date + '.01.21');
								  insertStackedRemainderAfter('finan.    ', date + '.02.21');
								  //insertStackedRemainderAfter('4th revenue', 'final total');
								
								  return drawWaterfall(data);
								}; // prepData
								
								var date = new Date().getDate();
								var data = [
									{"name": date + ".9.20","value":56},
									{"name":"oper.","value":15},
									{"name":"invest.","value":-1},
									{"name":"finan.","value":-4},
									//{"name":"28.11.20","value":65},
									{"name":"oper. ","value":39},
									{"name":"invest. ","value":-3},
									{"name":"finan. ","value":-53},
									//{"name":"28.12.20","value":47},
									{"name":"oper.  ","value":18, "forecast": true},
									{"name":"invest.  ","value":-3, "forecast": true},
									{"name":"finan.  ","value":-4, "forecast": true},
									//{"name":"28.01.21","value":59},
									{"name":"oper.   ","value":22, "forecast": true},
									{"name":"invest.   ","value":-6, "forecast": true},
									{"name":"finan.   ","value":-2, "forecast": true},
									//{"name":"28.01.21","value":73},
									{"name":"oper.    ","value":6, "forecast": true},
									{"name":"invest.    ","value":-2, "forecast": true},
									{"name":"finan.    ","value":-44, "forecast": true}
								];
								var output = prepData(data);
							},
							"init2": function(addData, metaData) {
								var container = $("#widget-body-" + widgetId);
								var width = container.width() - 30;
								container.html("<div class='container w100 h100'>" +
								"<div class='row'>" + 
								"<div class='col-sm'>" + 
								"<h4>Suggestion : Cash balance forecast is too low. Provision additional financial resources to avoid liquidity issues</h4>" + 
								"<h5>Cash flow statement - net inflow/outflow from operating, investing and financing activities in k$</h5>" + 
								"</div>" +  
								"</div>" +  
								"<div class='row'>" + 
								"<div class='col-sm'>" + 
								"<img class='h100' style='width: " + width + "px; object-fit: fit' src='static/scripts/dashboard3/widgets/forecast.png'/>" + 
								"</div>" +  
								"</div>" +  
								"</div>");
							}
						}
					}
				}
	}
	return metadata;
}
