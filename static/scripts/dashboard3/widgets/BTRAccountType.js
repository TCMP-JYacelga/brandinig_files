var bankBalances = null;
var accountBalances = null;
var currencyBalances = null;
var btrBannerWidgetMap = new Map();

widgetMetaData.btrAccountType = function(widgetId, widgetType){
	return getBalanceWidget(widgetId, widgetType);
}

widgetMetaData.btrBankName = function(widgetId, widgetType){
	return getBalanceWidget(widgetId, widgetType);
}

widgetMetaData.btrCurrency = function(widgetId, widgetType){
	return getBalanceWidget(widgetId, widgetType);
}

function getBalanceWidget(widgetId, widgetType)
{
	var rootUrl = (window.widgetConfig && window.widgetConfig[widgetId]) ? window.widgetConfig[widgetId].rootUrl : window.rootUrl;
	var widgetConfig = (window.widgetConfig && window.widgetConfig[widgetId]) ? window.widgetConfig[widgetId] : {};
	
	function applySecurityToken(config, url) {
		if (config && config.ssoToken) {
		  	if (url.indexOf('?') > 0) {
		  		url = url + "&";
		  	} else {
		  		url = url + "?";
		  	}
	  		url = url + "SEC_TKN=" + config.ssoToken;
	  	}
	  	return url;
	};
	
	//as this is banner widget, it is not available for clone and hence using widgetType as key 
	btrBannerWidgetMap.set(widgetType, widgetId); 
	return {
		  'title': getTitle(widgetType) ,
		  'desc' : getTitle(widgetType),
		  'type': 'card',
		  "widgetType" : widgetType,
		  'subType': '', 
		  'icon':'<span class="balanceDetail">'+getIconLabel(widgetType)+'</span>',
		  "cloneMaxCount": 1,
		  "seeMoreUrl": rootUrl + "/btrSummaryIntraday.form",
		  'fields': {
			'columns': [],
			'rows':{}	
		  },
		  'actions' : {
			  'lastUpdatedTime' : {
				  'callbacks' : {
					  "enabled" : function() {
					  	return window.embedded === undefined;
					  },
					  'init' : function(response, metaData){
						  response(response, metaData);
					  }
				  }
			  },
		 	"editTitle" : {
				  "callbacks" : {
					  "enabled" : function() {
					  	return window.embedded === undefined;
					  }
				  }
			  },
			  "filter" : {
				  "callbacks" : {
					  "enabled" : function() {
					  	return window.embedded === undefined;
					  }
				  }
			  },
			  "remove" : {
				  "callbacks" : {
					  "enabled" : function() {
					  	return window.embedded === undefined;
					  }
				  }
			  },
			  'refresh' : {
				  'callbacks' : {
					  'init' : function(addData, metaData){
							$('#'+metaData.target).empty().html('<div class="loading-indicator"></div>');
							if(usrDashboardPref.widgets[widgetType] && usrDashboardPref.widgets[widgetType].defaultCurrency){
							   btrAccCurrency = usrDashboardPref.widgets[widgetType].defaultCurrency;
							}
							$.ajax({
							   type : "GET",
							   url : applySecurityToken(widgetConfig, rootUrl + '/services/getClientBalances/balances'),
							   data : {
								   clientId : strClient,
								   currency : btrAccCurrency
							   },
							   dataType : "json"
							})
							.done (function(res, textStatus, jqXHR) { 
								if(res)
								{

								   $.publish('com.finastra.widget.lastUpdatedTime',{
									   'widgetId' : widgetId,
									   'updatedTime' : dateFormat(new Date(res.data.root.timeStamp),'|')
								   });
								   balances = res.data.root.accountBeanList;
								   var amountArray = btrUtils.calculateConsolidatedAmount(res.data.root.accountBeanList, getTypeFlag(widgetType));
								   setBalanceVariable(widgetType, amountArray.dataArray);
								   amountArray.entCurrency = btrAccCurrency;
								   addData(amountArray, metaData);		   						   						   	
								}					   
							})
							.fail (function(jqXHR, textStatus, errorThrown) { 
								
							})
							.always (function(jqXHROrData, textStatus, jqXHROrErrorThrown) {
								btrUtils.currencyFilter(addData, metaData, widgetId, widgetType, applySecurityToken(widgetConfig, rootUrl + '/services/userseek/fetchFxCurrencyForSeller.json'));						
								if('error' == textStatus)
								{
									addData([], metaData);
									$('#'+metaData.target).html(getDashLabel('err.noData','No data to display'));							
								}
								else if(jqXHROrData.data.root.accountBeanList.length == 0)
								{
									$('#'+metaData.target).html(getDashLabel('err.noData','No data to display'));
								}
								if (window.embedded) {
									BTRBalancesHelper.unmaskAmount();
								}
							});
						 //   btrUtils.currencyFilter([btrAccCurrency],widgetType);	
					  }
				  }
			  }
		  }
		}
}
function setBalanceVariable(widgetType, dataArray)
{
	if(widgetType == 'btrAccountType')
		accountBalances = dataArray;
	else if(widgetType == 'btrBankName')
		bankBalances = dataArray;
	else if(widgetType == 'btrCurrency')
		currencyBalances = dataArray;
}

function getTitle(widgetType)
{
	if(widgetType == 'btrAccountType')
		return getDashLabel('btrAccountType.title','Account Types');
	else if(widgetType == 'btrBankName')
		return getDashLabel('btrBankAcc.title','Bank Accounts');
	else if(widgetType == 'btrCurrency')
		return getDashLabel('btrCurrency.title','Currency');
	return null;
}
function getIconLabel(widgetType)
{
	if(widgetType == 'btrAccountType')
		return getDashLabel('btr.account.btn','Account');
	else if(widgetType == 'btrBankName')
		return getDashLabel('btr.bank.btn','Bank');
	else if(widgetType == 'btrCurrency')
		return getDashLabel('btr.currency.btn','Currency');
	return null;
}
function getTypeFlag(widgetType)
{
	if(widgetType == 'btrAccountType')
		return 'accountTypeDesc';
	else if(widgetType == 'btrBankName')
		return 'bankDesc';
	else if(widgetType == 'btrCurrency')
		return 'baseCurrency';
	return null;
}
$.subscribe('com.finastra.widget.filter.btrBankName', function(obj, data)
{
	if(btrBannerWidgetMap.has('btrAccountType'))
	{
		  $('#ccyFilter_'+btrBannerWidgetMap.get('btrAccountType')).val(btrAccCurrency)
		  widgetMap[btrBannerWidgetMap.get('btrAccountType')].api.refresh();		
	}
  
	if(btrBannerWidgetMap.has('btrCurrency'))
	{
		  $('#ccyFilter_'+btrBannerWidgetMap.get('btrCurrency')).val(btrAccCurrency)
		  widgetMap[btrBannerWidgetMap.get('btrCurrency')].api.refresh();		
	}
  
});


$.subscribe('com.finastra.widget.filter.btrAccountType', function(obj, data)
{
	if(btrBannerWidgetMap.has('btrCurrency'))
	{
		  $('#ccyFilter_'+btrBannerWidgetMap.get('btrCurrency')).val(btrAccCurrency)
		  widgetMap[btrBannerWidgetMap.get('btrCurrency')].api.refresh();		
	}
	if(btrBannerWidgetMap.has('btrBankName'))
	{
		  $('#ccyFilter_'+btrBannerWidgetMap.get('btrBankName')).val(btrAccCurrency)
		  widgetMap[btrBannerWidgetMap.get('btrBankName')].api.refresh();		
	}
});

$.subscribe('com.finastra.widget.filter.btrCurrency', function(obj, data)
{
	if(btrBannerWidgetMap.has('btrAccountType'))
	{
		  $('#ccyFilter_'+btrBannerWidgetMap.get('btrAccountType')).val(btrAccCurrency)
		  widgetMap[btrBannerWidgetMap.get('btrAccountType')].api.refresh();		
	}
  
	if(btrBannerWidgetMap.has('btrBankName'))
	{
		  $('#ccyFilter_'+btrBannerWidgetMap.get('btrBankName')).val(btrAccCurrency)
		  widgetMap[btrBannerWidgetMap.get('btrBankName')].api.refresh();		
	}
});