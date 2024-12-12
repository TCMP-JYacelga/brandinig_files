var CURRENCY_RATE_DTL_GENERIC_COLUMN_MODEL =
[
	{
		"colId" : "ccyPairCode",
		"colHeader" : getLabel('currencyPairDesc','Currency Pair'),
		width : 150
	},
	{
		"colId" : "ccyCode",
		"colHeader" : getLabel('ccyCode','Currency Code'),
		width : 150
	},
	{
		"colId" : "derivedCcyCode",
		"colHeader" : getLabel('derCcyCode','Derived CCY Code'),
		width : 150
	},
	{
		"colId" : "buyFxRate",
		"colHeader" : getLabel('buyRate','Buy Rate'),
		align : "right",
		width : 130,
		"editor" :
		{
			xtype : 'numberfield',
			align : 'right',
			anchor : '100%',
            maxValue: 99999999999.9999,
			minValue : 0,
			maxLength : 19,
			enforceMaxLength : true,
			decimalPrecision : intPrecesion,
			decimalSeparator : strDecimalSeparator,
			enableKeyEvents :true,
			hideTrigger : true,
			keyNavEnabled : false,
			mouseWheelEnabled : false,
			allowBlank : false,
			listeners : {
				change : function(field, value) {
					if (!Ext.isEmpty(value) && value > 99999999999.98) {
						Ext.MessageBox
								.alert(
										'Error',
										getLabel('buyRate','Buy Rate')
												+ ' exceeds maximum value of 99999999999.98 <br>');
					}
					var valueStr = value+"";
					var values = valueStr.split(".");
					if (!Ext.isEmpty(values) && !Ext.isEmpty(values[1])
							&& values[1].length > intPrecesion) {
						value = values[0] + "."
								+ values[1].substr(0, intPrecesion);
					}
				}
			}
		},
		"fnColumnRenderer" : function( value, metaData, record, rowIndex )
		{
			Ext.util.Format.thousandSeparator = strGroupSeparator;
			Ext.util.Format.decimalSeparator = strDecimalSeparator;
			Ext.util.Format.currencyPrecision = intPrecesion;
			var convertedZeroFormat = strAmountFormat.replace(/#/g,'0');
			var arrValues = convertedZeroFormat.split(strDecimalSeparator);
			var strPrecision = "";
			for(var i=0;i<intPrecesion;i++)
				strPrecision = strPrecision + "0";
			
			convertedZeroFormat = arrValues[0] + strDecimalSeparator + strPrecision;
			value = Ext.util.Format.number(value, convertedZeroFormat); //output 123.4567
			return value;
		}
	},
	{
		"colId" : "sellFxRate",
		"colHeader" : getLabel('sellRate','Sell Rate'),
		align : "right",
		width : 130,
		"editor" :
		{
			xtype : 'numberfield',
			anchor : '100%',
            maxValue: 99999999999.9999,
			minValue : 0,
			maxLength : 19,
			enforceMaxLength : true,
			decimalPrecision : intPrecesion,
			decimalSeparator : strDecimalSeparator,
			enableKeyEvents :true,
			keyNavEnabled : false,
			mouseWheelEnabled : false,
			allowBlank : false,
			listeners : {
				change : function(field, value) {
					if (!Ext.isEmpty(value) && value > 99999999999.98) {
						Ext.MessageBox
								.alert(
										'Error',
										getLabel('sellRate','Sell Rate')
												+ ' exceeds maximum value of 99999999999.98 <br>');
					}
					var valueStr = value+"";
					var values = valueStr.split(".");
					if (!Ext.isEmpty(values) && !Ext.isEmpty(values[1])
							&& values[1].length > intPrecesion) {
						value = values[0] + "."
								+ values[1].substr(0, intPrecesion);
					}
				}
			}
		},
		"fnColumnRenderer" : function( value, metaData, record, rowIndex )
		{
			Ext.util.Format.thousandSeparator = strGroupSeparator;
			Ext.util.Format.decimalSeparator = strDecimalSeparator;
			Ext.util.Format.currencyPrecision = intPrecesion;
			var convertedZeroFormat = strAmountFormat.replace(/#/g,'0');
			var arrValues = convertedZeroFormat.split(strDecimalSeparator);
			var strPrecision = "";
			for(var i=0;i<intPrecesion;i++)
				strPrecision = strPrecision + "0";
			
			convertedZeroFormat = arrValues[0] + strDecimalSeparator + strPrecision;
			value = Ext.util.Format.number(value, convertedZeroFormat); //output 123.4567
			return value;
		}
	},
	{
		"colId" : "fxRate",
		"colHeader" : getLabel("MIDRate", "MID Rate"),
		align : "right",
		hidden : isHidden,
		width : 130,
		"editor" :
		{
			xtype : 'numberfield',
			anchor : '100%',
            maxValue: 99999999999.9999,
			minValue : 0,
			maxLength : 19,
			enforceMaxLength : true,
			decimalPrecision : intPrecesion,
			decimalSeparator : strDecimalSeparator,
			enableKeyEvents :true,
			keyNavEnabled : false,
			mouseWheelEnabled : false,
			allowBlank : false,
			listeners : {
				change : function(field, value) {
					if (!Ext.isEmpty(value) && value > 99999999999.98) {
						Ext.MessageBox
								.alert(
										'Error',
										getLabel("MIDRate", "MID Rate")
												+ ' exceeds maximum value of 99999999999.98 <br>');
					}
					var valueStr = value+"";
					var values = valueStr.split(".");
					if (!Ext.isEmpty(values) && !Ext.isEmpty(values[1])
							&& values[1].length > intPrecesion) {
						value = values[0] + "."
								+ values[1].substr(0, intPrecesion);
					}
				}
			}
		},
		"fnColumnRenderer" : function( value, metaData, record, rowIndex )
		{
			Ext.util.Format.thousandSeparator = strGroupSeparator;
			Ext.util.Format.decimalSeparator = strDecimalSeparator;
			Ext.util.Format.currencyPrecision = intPrecesion;
			var convertedZeroFormat = strAmountFormat.replace(/#/g,'0');
			var arrValues = convertedZeroFormat.split(strDecimalSeparator);
			var strPrecision = "";
			for(var i=0;i<intPrecesion;i++)
				strPrecision = strPrecision + "0";
			
			convertedZeroFormat = arrValues[0] + strDecimalSeparator + strPrecision;
			value = Ext.util.Format.number(value, convertedZeroFormat); //output 123.4567
			return value;
		}
	}
];