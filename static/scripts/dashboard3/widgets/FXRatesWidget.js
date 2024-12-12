widgetMetaData.fxRatesWidget = function(widgetId, widgetType)
{
	let metadata = {
			  'title'         : getDashLabel('fxrate.title'),
			  'desc'          : getDashLabel('fxrate.desc'),
			  'type'          : 'datatable',
			  'subType'       : '',
			  'url'           : rootUrl+'/services/getExchangeRatesForCcy',
			  'requestMethod' : 'POST',
			  'responseRoot'  : 'root.summary',
			  'ordering'      : false,
			  'orderingOn'    : 'server',
			  "widgetType" : widgetType,
			  "cloneMaxCount": 1,
			  'fields': {
				'columns': [
				  {
					'fieldName' : 'flag',
					'label'     : '',
					'type'      : 'text',
					'orderable' : false,
					'render'    : function (data, type, row){
						let ccyCode= row.toCcy ? row.toCcy.toLowerCase() : '';
						return '<i class="currency-flag currency-flag-'+ccyCode+' rounded-circle" style="font-size: 19px"></i>';
					}
				  },
			 	 {
					'fieldName' : 'toCcy',
					'label'     : getDashLabel('fxrate.ccy'),
					'type'      : 'text',
					'orderable' : false,
					'render'    : function (data, type, row) {
						return data;
					}
				  },
				  {
					'fieldName' : 'buyFxRate',
					'label'     : getDashLabel('fxrate.buyRate'),
					'type'      : 'amount',
					'orderable' : false,
					'render'    : function (data, type, row) {
						if(type == 'sort') return data;
						return '<span data-toggle="tooltip" title="' + data + '">' + formatDecimal(data).substr( 0, 4 ) + '</span>';
					}
				  },
				  {
					'fieldName' : 'sellFxRate',
					'label'     : getDashLabel('fxrate.sellRate'),
					'type'      : "amount",
					'orderable' : false,
					'render'    : function (data, type, row) {
						if(type == 'sort') return data;
						return '<span data-toggle="tooltip" title="' + data + '">' + formatDecimal(data).substr( 0, 4 ) + '</span>';
					}
				  }	  
				]
			  },
			  'actions' : {
				  'filter' : {
					  'callbacks' : {
						  'apply' : function(filterData){
							  let ccyCode = '';
							  if(filterData && filterData.filter && filterData.filter.fields[0] && filterData.filter.fields[0].value1)
							  {
								  ccyCode = filterData.filter.fields[0].value1.toLowerCase();
							  }			  
							   let flag = '<i class="currency-flag currency-flag-'+ccyCode+' rounded-circle mr-2" style="font-size: 19px;margin-bottom: -5px"></i>';
							   $('#widget_top_label_'+widgetId).html('<h6 class="mt-4" style="margin-left: 14px;">'+getDashLabel('fxrate.baseCurrency','Base Currency')+':  '+flag+filterData.filter.fields[0].value1+'</h6>');
			     	      }		  
					 }
				  },
				  'topLabel' : {
					  'text'      : getDashLabel('fxrate.baseCurrency','Base Currency'),
					  'callbacks' : {
					  }
				  },
				  "columnChooser" : {
					  "callbacks" : {
						  "enabled" : function(){
							   return false;
						  }
					  }
				  }
				 
			  },
			  'filter' : {
				  'fields' : [
					  {
						'fieldName' : 'Currency',			
						'label'     : getDashLabel('fxrate.baseCurrency'),
						'type'      : 'selectbox',
						'filterSubType' : '',
						'default'   : {
							 'operator' : 'eq', 
							 'value1'   : _strSellerCurrency ,
							 'value2'   : '' 
						},
						'ajax' : {
									url : rootUrl+'/services/getExchangeRateCurrency',
									dataType : "json",
									data : [],
									success : function(data, response) {
										if(data && data.root)
										{
											var res = data.root;
											response($.map(res, function(item) {
												return {
													label : item.filterCode+' - '+item.filterValue,
													code  : item.filterCode
												}
											}));									
										}
									}
							      },
					    }
				   ]
			    }
			}
	return metadata;
}

function calc(value) {
    var with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
    return with2Decimals;
}

/**
 * Provided decimal number converted into 2 decimal value 
 * @param num
 * @returns
 */
function getDecimalPart(num)
{
//	let decimal = isFloat(Number(num));
	let decimal = calc(num);
	if(decimal == 0)
		return '00';
	
	let strNumber =  decimal.toString();
	
	if(strNumber.length < 2)
	{
		strNumber = strNumber + '0';
		return strNumber;
	}
	let array = strNumber.split('.');
	
	if(array.length > 1 )
	{
		if(array[1].length < 2)
		{
			array[1] = array[1] + '0';			
		}
		return array[1] ;
	}
	return '00';
	
}
/**
 * This method to process decimal part of the rate provided .
 * In case all are zero then show upto 2 decimal else show number as it is
 * @param num
 * @returns
 */
function formatDecimal( num ) {
	if(num == null && num == '' && num == 'undefined')
	{
		return num;
	}
	var beforeDecimal = num.split('.');
	if(beforeDecimal.length > 1)
	{
		num = beforeDecimal[0] + '.' +getDecimalPart( '0.'+beforeDecimal[1]);	
	}	
    return num;
}
