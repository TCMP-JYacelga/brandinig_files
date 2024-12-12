function ChartWidgetUtils()
{
    return {
        chartLayout:
        {
            title: '',
            font:
            {
                size: 16
            },
            showlegend: true,
            legend:
            {
                orientation: 'v',
                font:
                {
                    size: 10
                }
            },
            autosize: false,
            width: '100%',
            height: 320,
            xaxis:
            {
                autorange: true,
                showgrid: false,
                ticks: '',
                showticklabels: false,
                title:
                {
                    text: 'X Axis',
                    font:
                    {
                        family: 'Roboto',
                        size: 18,
                        color: '#7f7f7f'
                    }
                }
            },
            yaxis:
            {
                title:
                {
                    text: 'y Axis',
                    font:
                    {
                        family: 'Roboto',
                        size: 18,
                        color: '#7f7f7f'
                    }
                }
            }
        },

        defaultConfig:
        {
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'lasso2d', 'select2d', 'autoScale2d', 'toggleSpikelines', 'hoverClosestPie']
        },

        getJsonProperty: function (json, path)
        {
            var tokens = path.split(".");
            var obj = json;
            for (var i = 0; i < tokens.length; i++)
            {
                obj = obj[tokens[i]];
            }
            return obj;
        },
        getJsonPropertywithLegendField: function (json, path, fieldLegend, legendDesc)
        {
            var tokens = path.split(".");
            var legendTokens = fieldLegend.split(".");
            var obj = json;
            for (var i = 0; i < tokens.length; i++)
            {
                if (i > 0 && json.record[legendTokens[i]] == legendDesc)
                {
                    obj = json.record[tokens[i]];
                }
                else
                {
                    obj = null;
                }
            }
            return obj;
        },

        markerColors:
        {
            color: '#5BC1D7'
        }
    }
};

var chart = function ()
{
    return chartWidget();
};

function chartWidget()
{
    var _widgetInstance = _widget();
    var _thisChart = {};

    _thisChart.constructor = function (props)
    {
        _widgetInstance.constructor(props.widgetId, props.target, props.url,
            props.method, props.reqData, props.resRoot, props.adaptData);
        _thisChart = $.extend(_thisChart, _widgetInstance);
        _thisChart.fields = props.fields;
        _thisChart.chartType = props.chartType;
        _thisChart.chart = props.chart;
        _thisChart.utils = ChartWidgetUtils();
    };

    _thisChart.initialize = function ()
    {
        var _this = this;
        this.callAjax().then(function (resData)
        {
            _this.createChart(resData);
        }).catch(function (error)
        {
            _this.setErrorMessage("widget-body-" + _this.widgetId, error);
        });
    };

    _thisChart.createChart = function (resData)
    {
        var _this = this,
            xField = this.chart.xAxis,
            yField = this.chart.yAxis,
            xFieldLable = this.chart.xAxisLable,
            yFieldLable = this.chart.yAxisLable,
            legendField = this.chart.legendKey,
            legendFieldDesc = this.chart.legendDesc,
            data = [];
        this.utils.chartLayout.xaxis.title.text = xFieldLable;
        this.utils.chartLayout.yaxis.title.text = yFieldLable;
        this.utils.chartLayout.width = $('#widget-body-' + this.widgetId).parent().parent().width() - 25;
        if (this.utils.chartLayout.width < 350) {
        	this.utils.chartLayout.width = 350;
        }
       
        this.utils.chartLayout.height = $('#widget-body-' + this.widgetId).parent().parent().height() - 111; // height of header, footer and top/bottom margin
        if (this.chartType == 'piechart')
        {
            var xArray = this.getXValues(resData, xField),
                yArray = this.getYValues(resData, xField, yField);
            this.utils.chartLayout.title = {
                'text': this.chart.charttitle,
                'font':
                {
                    'family': 'Roboto',
                    'color': '#c137a2',
                    'size': 16
                },
                'x': 0.5,
                'xanchor': 'center',
                'y': 0.01,
                'yanchor': 'bottom'
            };

            data.push(
            {
                values: yArray,
                labels: xArray,
                type: 'pie',
                hoverinfo: "value+percent initial",
                textinfo: 'percent',
                textposition: 'outside'
            });
        }
        else if (this.chartType == 'multidonut')
        {
            var layout = this.utils.chartLayout;
            layout.legend = {};
            layout.xaxis = {};
            layout.yaxis = {};
            layout.title = {
                'text': this.chart.charttitle,
                'font':
                {
                    'family': 'Roboto',
                    'color': '#c137a2',
                    'size': 16
                },
                'x': 0.5,
                'xanchor': 'left',
                'y': 0.01,
                'yanchor': 'bottom'
            };
            layout.annotations = [];
            layout.showlegend = false;
            layout.grid = {
                rows: 1,
                columns: Object.keys(resData).length
            };
            var counter = 0;
            var columnx = [0.079, 0.45, 0.82];
            for (var key in resData)
            {
                var xArray = this.getXValues(resData[key], xField),
                    yArray = this.getYValues(resData[key], xField, yField),
                    labels = [];
                $.each(this.chart.annotations, function(index, annotation) {
                	var newAnnotation = {
                		"font": {
		                	family: "Roboto",
		                	size: 12
                		},
	                    "xanchor": "left",
                		opacity: 0.8,
                		showarrow: false,
                		text: resData[key][0][annotation.fieldName],
                		x: columnx[counter],
                		y: 0.5
                	};
	                if (annotation.fontSize !== undefined) {
	                	newAnnotation.font.size = annotation.fontSize;
	                }
	                if (annotation.textColor !== undefined) {
	                	newAnnotation.font.color = annotation.textColor(resData[key][0]);
	                }
	                if (annotation.borderColor !== undefined) {
	                	newAnnotation.bordercolor = annotation.borderColor(resData[key][0]);
	                }
	                if (annotation.border !== undefined) {
	                	newAnnotation.borderwidth = annotation.border;
	                }
	                if (annotation.format !== undefined) {
	                	newAnnotation.text = annotation.format(resData[key][0][annotation.fieldName]);
	                }
	                if (annotation.computeX !== undefined) {
	                	newAnnotation.x = annotation.computeX(resData[key][0][annotation.fieldName], layout, 0, counter);
	                }
	                if (annotation.y !== undefined) {
	                	newAnnotation.y = annotation.y;
	                }
	                layout.annotations.push(newAnnotation);
                });
               	$.each(resData[key], function(index, record) {
               		labels.push(record[xField]);
               	});
                data.push(
                {
                    "values": yArray,
                    "labels": labels,
                    "domain":
                    {
                        "column": counter
                    },
                    "marker": {
                    	"colors": ['#694ed6', '#FFFFFF'],
                    	"line": {
                    		"color": '#c137a2',
                    		"width": 1
                    	}
                    },
                    "xanchor": "left",
                    "name": key,
                    "type": "pie",
                    "hole": 0.5,
                    "hoverinfo": this.chart.hoverinfo ? this.chart.hoverinfo : "value+percent",
                    "textinfo": this.chart.textinfo ? this.chart.textinfo : "percent",
                    "textposition": 'auto'
                });
                counter = counter + 1;
            }
        }
        else
        {
            let legendFieldArray = this.getXValues(resData, legendField);
            let legendFieldArrayDesc = this.getXValues(resData, legendFieldDesc);
            this.utils.chartLayout.title = "";
            for (let dt in legendFieldArray)
            {
                let xArray = this.getXValuesWithLegend(resData, xField, legendField, legendFieldArray[dt]);
                let yArray = this.getYValuesWithLegend(resData, xField, yField, legendField, legendFieldArray[dt]);
                if (this.chartType == 'barchart')
                {
                    data.push(
                    {
                        y: yArray,
                        x: xArray,
                        type: 'bar',
                        labels: xArray,
                        name: getDashLabel('productCategory.' + legendFieldArray[dt],
                            legendFieldArrayDesc[dt])
                    });
                }
                else if (this.chartType == 'linechart')
                {
                    data.push(
                    {
                        y: yArray,
                        x: xArray,
                        type: 'scatter',
                        name: getDashLabel('productCategory.' + legendFieldArray[dt],
                            legendFieldArrayDesc[dt])
                    });
                }
            }
        }
        Plotly.newPlot(this.target, data, this.utils.chartLayout, this.utils.defaultConfig);

    	if (widgetMap[_this.widgetId].chart.onclick) 
    	{
	        $('#widget-body-' + this.widgetId).on('plotly_click', function (setting, data)
	        {
	            widgetMap[_this.widgetId].chart.onclick(data);
	        });
    	}
    }

    _thisChart.getXValues = function (resData, field)
    {
        let _this = this;
        let xValue = [];

        $(resData).each(function (index, data)
        {
            let val = _this.utils.getJsonProperty(data, field);
            let fieldMetadata;
            $(_this.fields.columns).each(function (index, fld)
            {
                if (fld.fieldName == field)
                {
                    fieldMetadata = fld;
                }
            });

            if (fieldMetadata.render)
            {
                val = fieldMetadata.render(val);
            }
            if (xValue.indexOf(val) == -1)
                xValue.push(val);
        });

        return xValue;
    };
    _thisChart.getYValues = function (resData, xfield, yfield)
    {
        let _this = this;
        let yValue = [];
        let yData = {};

        $(resData).each(function (index, data)
        {
            let fieldMetadata;
            let xfieldValue = _this.utils.getJsonProperty(data, xfield);
            let yfieldValue = _this.utils.getJsonProperty(data, yfield);

            if ('--CONFIDENTIAL--' != yfieldValue)
            {
                $(_this.fields.columns).each(function (index, fld)
                {
                    if (fld.fieldName == yfield)
                    {
                        fieldMetadata = fld;
                    }
                });

                if (fieldMetadata.render && fieldMetadata.type != 'amount')
                {
                    yfieldValue = fieldMetadata.render(yfieldValue);
                }

                if (yData['data_' + xfieldValue])
                {
                    yData['data_' + xfieldValue] = parseFloat(yData['data_' + xfieldValue]) + parseFloat(yfieldValue);
                }
                else
                {
                    yData['data_' + xfieldValue] = parseFloat(yfieldValue);
                }
            }
        });

        for (let dt in yData)
        {
            yValue.push(yData[dt]);
        }

        return yValue;
    };
    _thisChart.getXValuesWithLegend = function (resData, field, fieldLegend, legendDesc)
    {
        let _this = this;
        let xValue = [];

        $(resData).each(function (index, data)
        {
            let val = _this.utils.getJsonPropertywithLegendField(data, field, fieldLegend, legendDesc);
            if (val != null)
            {
                let fieldMetadata;
                $(_this.fields.columns).each(function (index, fld)
                {
                    if (fld.fieldName == field)
                    {
                        fieldMetadata = fld;
                    }
                });

                if (fieldMetadata.render && fieldMetadata.type != 'amount')
                {
                    val = fieldMetadata.render(val);
                }
                if (xValue.indexOf(val) == -1)
                    xValue.push(val);
            }
        });

        return xValue;
    };

    _thisChart.getYValuesWithLegend = function (resData, xfield, yfield, fieldLegend, legendDesc)
    {
        let _this = this;
        let yValue = [];
        let yData = {};

        $(resData).each(function (index, data)
        {
            let fieldMetadata;
            let xfieldValue = _this.utils.getJsonPropertywithLegendField(data, xfield, fieldLegend, legendDesc);
            let yfieldValue = _this.utils.getJsonPropertywithLegendField(data, yfield, fieldLegend, legendDesc);

            if (null != yfieldValue && '--CONFIDENTIAL--' != yfieldValue)
            {
                $(_this.fields.columns).each(function (index, fld)
                {
                    if (fld.fieldName == yfield)
                    {
                        fieldMetadata = fld;
                    }
                });

                if (fieldMetadata.render && fieldMetadata.type != 'amount')
                {
                    yfieldValue = fieldMetadata.render(yfieldValue);
                }

                if (yData['data_' + xfieldValue])
                {
                    yData['data_' + xfieldValue] = parseFloat(yData['data_' + xfieldValue]) + parseFloat(yfieldValue);
                }
                else
                {
                    yData['data_' + xfieldValue] = parseFloat(yfieldValue);
                }
            }
        });

        for (let dt in yData)
        {
            yValue.push(yData[dt]);
        }

        return yValue;
    };
    return _thisChart;
}
