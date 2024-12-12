/*jslint browser: true*/
/*global widgetMetaData, getDashLabel, rootUrl, DataRender, _strGroupSeparator, _strDecimalSeparator, _strAmountMinFraction*/

function textSize(text, fontFamily, fontSize) {
    if (!d3) return;
    var container = d3.select('body').append('svg');
    container
    	.append('text')
    	.attr("x", -99999)
    	.attr("y", -99999)
    	.attr("font-family", fontFamily)
    	.attr("font-size", fontSize)
    	.text(text);
    var size = container.node().getBBox();
    container.remove();
    return { width: size.width, height: size.height };
}

widgetMetaData.ficoScore = function (widgetId, widgetType)
{
    var metadata = {
        "title": getDashLabel("ficoScore.title"),
        "desc": getDashLabel("ficoScore.description"),
        "type": "chart",
        "subType": "multidonut",
        "url": rootUrl + "/static/scripts/dashboard3/widgets/ficoscore.json",
        "requestMethod": "GET",
        "responseRoot": "records",
        "adaptData": function (data) {
        	// sort data by date
        	data.sort(function (record1, record2) {
        		var result = record1.agencyId - record2.agencyId;
        		if (result === 0) {
        			result = Date.parse(record2.date) - Date.parse(record1.date);
        		}
        		return result;
        	});
        	var ficoDataByAgency = {};
			$.each(data, function(index, record) {
				var ficoData = {
					"agencyName": record.agencyName,
					"score": (record.score < 300 ? 300 : (record.score > 850 ? 850 : record.score)),
					"date": Date.parse(record.date)
				};
				if (ficoDataByAgency[ficoData.agencyName] === undefined) {
					ficoDataByAgency[ficoData.agencyName] = [
						ficoData,
						{"agencyName": "Max", "score": (850 - ficoData.score), "date": ficoData.date, "difference": (ficoData.score)}
					];
				} else {
					var ficoData2 = ficoDataByAgency[ficoData.agencyName][0];
					if (ficoData2.difference === undefined) {
						ficoData2.difference = ficoData2.score - ficoData.score;
						ficoDataByAgency[ficoData.agencyName][1] = {"agencyName": "Max", "score": (850 - ficoData2.score), "date": ficoData2.date, "difference": ficoData2.difference};
					}
				}
			});
        	return ficoDataByAgency;
        },
        "widgetType": widgetType,
        "cloneMaxCount": 1,
        "fields":
        {
            "columns": [
                {
                    "fieldName": "agencyId",
                    "label": getDashLabel("ficoScore.agencyId", "Agency ID"),
                    "type": "text",
                    "render": function (data, type, row) {
                    	if (data === undefined) {
                    		return "";
                    	}
                    	return data;
                    }
                },
                {
                    "fieldName": "agencyName",
                    "label": getDashLabel("ficoScore.agencyName", "Agency"),
                    "type": "text",
                    "render": function (data, type, row) {
                    	if (data === undefined) {
                    		return "";
                    	}
                    	return data;
                    }
                },
                {
                    "fieldName": "date",
                    "label": getDashLabel("ficoScore.date", "Date"),
                    "type": "date",
                    "render": function (data, type, row) {
                    	if (data === undefined) {
                    		return "";
                    	}
                    	return new Date(data);
                    }
                },
                {
                    "fieldName": "score",
                    "label": getDashLabel("ficoScore.score", "Score"),
                    "type": "amount",
                    "render": function (data, type, row)
                    {
                        if (data === undefined || data < 300)
                        {
                            return 300;
                        }
                        if (data > 850)
                        {
                            return 850;
                        }
                        return data;
                    }
                }
            ]
        },
        "chart":
        {
            "xAxis": "agencyName",
            "xAxisLable": getDashLabel("ficoScore.agencyName", "Agency"),
            "yAxis": "score",
            "legend": "agencyName",
            //"yAxisLable": getDashLabel("ficoScore.score", "Score"),
            //"charttitle": getDashLabel('ficoScore.title', "FICO Score By Agency"),
            "hoverinfo": "none",
            "textinfo": "none",
            "annotations": [
	            {
	            	"fieldName": "score",
	            	"y": 0.5,
	            	"fontSize": 14,
	            	"format": function(data) {
	            		return "<b>" + data + "</b>";
	            	},
	            	"textColor": function(data) {
	            		return "#c137a2";
	            	},
	            	"computeX": function(text, layout, row, column) {
	            		var width = layout.width;
	            		var textWidth = textSize(text, "Roboto", 20).width;
	            		var spacerWidth = 0.028 * width;
	            		if (column === 0) {
	            			return ((0.1566 * width) - (textWidth/2) - spacerWidth)/width;
	            		} else if (column === 1) {
	            			return ((0.502 * width) - (textWidth/2) - spacerWidth)/width;
	            		}
	            		return ((0.8473 * width) - (textWidth/2) - spacerWidth)/width;
	            	}
	            },
	            {
	            	"fieldName": "agencyName",
	            	"y": -0.15,
	            	"computeX": function(text, layout, row, column) {
	            		var width = layout.width;
	            		var textWidth = textSize(text, "Roboto", 18).width;
	            		var spacerWidth = 0.028 * width;
	            		if (column === 0) {
	            			return ((0.1566 * width) - (textWidth/2) - spacerWidth)/width;
	            		} else if (column === 1) {
	            			return ((0.502 * width) - (textWidth/2) - spacerWidth)/width;
	            		}
	            		return ((0.8473 * width) - (textWidth/2) - spacerWidth)/width;
	            	},
	            	"fontSize": 12,
	            	"format": function(data) {
	            		return "<b>" + data + "</b>";
	            	},
	            	"textColor": function(data) {
	            		return "#694ed6";
	            	}
	            },
	            {
	            	"fieldName": "date",
	            	"computeX": function(text, layout, row, column) {
	            		var width = layout.width;
	            		var date = new Date(text);
	            		var text = (date.getMonth() + 1) + "-" + date.getDate() + "-" + (1900+ date.getYear())
	            		var textWidth = textSize(text, "Roboto", 12).width;
	            		var spacerWidth = 0.028 * width;
	            		if (column === 0) {
	            			return ((0.1566 * width) - (textWidth/2) - spacerWidth)/width;
	            		} else if (column === 1) {
	            			return ((0.502 * width) - (textWidth/2) - spacerWidth)/width;
	            		}
	            		return ((0.8473 * width) - (textWidth/2) - spacerWidth)/width;
	            	},
	            	"format": function (data) {
                    	if (data === undefined) {
                    		return "";
                    	}
                    	var date = new Date(data);
                    	return (date.getMonth() + 1)  + "-" + date.getDate() + "-" + (1900+ date.getYear());
                    },
	            	"y": -0.25,
	            	"fontSize": 10
	            },
	            {
	            	"fieldName": "difference",
	            	"computeX": function(text, layout, row, column) {
	            		var width = layout.width;
	            		var textWidth = textSize(text, "Roboto", 20).width;
	            		var spacerWidth = 0.028 * width;
	            		if (column === 0) {
	            			return ((0.1566 * width) - (textWidth/2) - spacerWidth)/width;
	            		} else if (column === 1) {
	            			return ((0.502 * width) - (textWidth/2) - spacerWidth)/width;
	            		}
	            		return ((0.8473 * width) - (textWidth/2) - spacerWidth)/width;
	            	},
	            	"textColor": function(data) {
	            		if (data.difference < 0) {
	            			return "#EA3F74";
	            		}
	            		return "#56C271";
	            	},
	            	"borderColor": function(data) {
	            		if (data.difference < 0) {
	            			return "#EA3F74";
	            		}
	            		return "#56C271";
	            	},
	            	"border": 2,
	            	"format": function (data) {
                    	if (data === undefined) {
                    		return " 0 ";
                    	}
                    	return "<b>" + (data > 0 ? "+" : "") + data + " </b>";
                    },
	            	"y": 1.2,
	            	"fontSize": 18
	            }
            ] 
        },
        "actions": {},
        "filter":
        {
            "fields": []
        }
    }
    return metadata;
}
