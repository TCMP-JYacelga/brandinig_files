var btrAccCurrency = window._strSellerCurrency || 'INR';
var btrUtils = {};
var showMore = true;
// it should be one to one mapping here
var accountTypeCodes = {
	'FAC00001'         : '060',  // casa  '060,040,030,010,100,400'
	'FAC00003'         : '056',  //loan     '056,701,705,720,721,722'
	'FAC00004'         : '057',  //deposit   '057,650,350'
	'FAC00008'         : '057'    //deposit  '057,650,350'
};

var bankTypeCodes = {
		'FAC00001'         : '060',  // casa  '060,040,030,010,100,400'
		'FAC00003'         : '056',  //loan     '056,701,705,720,721,722'
		'FAC00004'         : '057',  //deposit   '057,650,350'
		'FAC00008'         : '057'    //deposit  '057,650,350'
	};
//type can be 'accountTypeDesc' or 'bankDesc'
btrUtils.calculateConsolidatedAmount = function(data, type){
  var amountMap = new Map();
  var currenyEquivalentMap = new Map();
  var currencyMap = new Map();
  var typeCodesMap = new Map();
  
  var arr = [];
  var returnData = {};
  var entBalance = 0;
  var ccyList = [];
  var currencySymbol = '';
  var balances = [];
  for(var i in data)
  {
   // Consider equivalentAmount if present, otherwise baseAmount for Account Type and Bank Wise Widget
   var amountType = 'equivalentAmount'; 
   var currencySymbolType = 'equivalentCurrencySymbol';    
   
   // consider following for Currency Widget tab - Enterprise Balance
   var equiAmountType = 'equivalentAmount'; 
   var equiCurrencySymbolType = 'equivalentCurrencySymbol';  
   
   // in Currency Widget we are having 2 amountMap 1. for BaseAMount - For detail view 2. for Equivalent amount - for Enterprise Balance
   if(type == 'baseCurrency')
   {
	   amountType = 'baseAmount';
	   currencySymbolType = 'baseCurrencySymbol';
	   if(!data[i].equivalentAmount) {
		   equiAmountType = 'baseAmount';
		   equiCurrencySymbolType = 'baseCurrencySymbol'; 
	   }
	   
	   if(currenyEquivalentMap.has(data[i][type])) {
		   currenyEquivalentMap.set(data[i][type], Number(data[i][equiAmountType])+Number(currenyEquivalentMap.get(data[i][type])));
	   }
	   else {
		   currenyEquivalentMap.set(data[i][type], Number(data[i][equiAmountType]));
		  // typeCodesMap.set(data[i][type], data[i].accountTypeCode);
	   }
   }	   	   
   else
   {
	   if(!data[i].equivalentAmount) {
		   amountType = 'baseAmount';
		   currencySymbolType = 'baseCurrencySymbol'; 
	   }	   
   }

   // following amountMap is common for all three widgets- Bank,Account type and Currency
   if(amountMap.has(data[i][type])) {
    amountMap.set(data[i][type], Number(data[i][amountType])+Number(amountMap.get(data[i][type])));
   }
   else {
	amountMap.set(data[i][type], Number(data[i][amountType]));
	typeCodesMap.set(data[i][type], data[i].accountTypeCode);
   }
   
   currencySymbol = data[i][currencySymbolType];
     var currency = 'baseCurrency';
	 var dataCcy = data[i][currency];
	if ($.inArray(dataCcy, ccyList) == -1)
	{
	  ccyList.push(dataCcy);
	}
  }
  if(type == 'baseCurrency')
  {
	  amountMap.forEach(function(value, key){
			 data.forEach(function(record, idx){
				 if(key == record.baseCurrency)
				 {
					 currencyMap.set(key, record.baseCurrencySymbol);
				 }
			 });
	  });
  }
  
  amountMap = btrUtils.sortAmountMap(amountMap);
  
  amountMap.forEach(function(value, key){
	 var typeElement = {};
	 if(type == 'accountTypeDesc')
	 {
		 balances = btrUtils.accTypeBalanceDetails(key, data, currencySymbol, typeCodesMap);
	 }
	 else if(type == 'bankDesc')
	 {
		 balances = btrUtils.bankBalanceDetails(key, data, currencySymbol, typeCodesMap);
	 }
	 else
	 {
		 balances = btrUtils.currencyDetails(key, data, currencySymbol, typeCodesMap);
	 }
	  typeElement.balances = balances;
	  typeElement.label = getDashLabel(type + '.' +typeCodesMap.get(key), key);
	  typeElement.accTypeCode = key;
	  let currencyCode = (type == 'baseCurrency') ? currencyMap.get(key): currencySymbol;
	  typeElement.value = decodeURIComponent(currencyCode) + ' ' + DataRender.amountFormatter(amountMap.get(key), {
							groupSeparator    : _strGroupSeparator, 
							decimalSeparator  : _strDecimalSeparator, 
							amountMinFraction : _strAmountMinFraction, 
						});
	   entBalance = entBalance + Number(amountMap.get(key));					
       arr.push(typeElement); 
  });
  // In case of Currency Widget Enterprise Balance will be calculated from currenyEquivalentMap
  if(type == 'baseCurrency')
  {
	  entBalance = 0;
	  currenyEquivalentMap.forEach(function(value, key){
		  entBalance = entBalance + Number(currenyEquivalentMap.get(key));	
	  });
  }

   returnData.dataArray = arr;
   returnData.ccyArray = ccyList;
   returnData.entBalance =  DataRender.amountFormatter(entBalance, {
							groupSeparator    : _strGroupSeparator, 
							decimalSeparator  : _strDecimalSeparator, 
							amountMinFraction : _strAmountMinFraction, 
						  });
	
  return returnData;
 };
 
 btrUtils.sortAmountMap = function(amountMap)
 {
	 let amountArray = [];
	 let sortedAmountMap = new Map();
	 
	  amountMap.forEach(function(value, key){
		  amountArray.push(value);
	  });
	  
	  if(amountArray.length > 0)
	  {
		  amountArray = CommonUtility.mergeSort(amountArray);
		  amountArray.reverse();
		  for(let index=0; index < amountArray.length; index++)
		  {
			  amountMap.forEach(function(value, key)
			  {
				  if(amountArray[index] == value)
				  {
					  sortedAmountMap.set(key, value);
				  }
			  });
		  }		  
	  }
	  return sortedAmountMap;
 }
 btrUtils.currencyDetails = function(currency, data, currencySymbol, typeCodesMap)
 {
	 let totalAmount = 0;
	 let currencyBalance =[];
	 let singleCurrencyBalance = {};
	 let curSymbol = null;
		 totalAmount = 0;
		 currencyBalance = [];
		 data.forEach(function(record, idx){
			 if(currency == record.baseCurrency)
			 {
				 singleCurrencyBalance = {}
				 singleCurrencyBalance.acctNmbr = record.accountNmbr;
				 singleCurrencyBalance.bank = record.bankDesc;
				 singleCurrencyBalance.timeStamp = record.timeStamp;
				 singleCurrencyBalance.typeCode =  record.accountTypeCode;
				 totalAmount = totalAmount + Number(record.baseAmount);
				 singleCurrencyBalance.baseAmount = decodeURIComponent(record.baseCurrencySymbol) + ' ' + 
				 DataRender.amountFormatter(record.baseAmount, {
						groupSeparator    : _strGroupSeparator, 
						decimalSeparator  : _strDecimalSeparator, 
						amountMinFraction : _strAmountMinFraction, 
					});		
				if(record.equivalentAmount && record.equivalentCurrencySymbol)
				{
					singleCurrencyBalance.equivalentAmount =  decodeURIComponent(record.equivalentCurrencySymbol) + ' ' + 
					 DataRender.amountFormatter(record.equivalentAmount, {
							groupSeparator    : _strGroupSeparator, 
							decimalSeparator  : _strDecimalSeparator, 
							amountMinFraction : _strAmountMinFraction
					 });
					singleCurrencyBalance.equivalentCurrency = record.equivalentCurrency;				
				}
				 currencyBalance.push(singleCurrencyBalance);
			 }
		 });
	 return currencyBalance;
 }
 btrUtils.bankBalanceDetails = function(accType, data, currencySymbol, typeCodesMap)
 {
	let bankBalance =[];
	let bankAccBalance = {};
	
	data.forEach(function(record, idx){
		if(accType == record.bankDesc)
		{
			bankAccBalance = {};
			
			bankAccBalance.acctNmbr = record.accountNmbr;
			bankAccBalance.accountType = record.accountTypeCode;
			bankAccBalance.timeStamp = record.timeStamp;
			bankAccBalance.typeCode =  bankTypeCodes[record.accountTypeCode];
			bankAccBalance.baseAmount = decodeURIComponent(record.baseCurrencySymbol) + ' ' + 
			 DataRender.amountFormatter(record.baseAmount, {
					groupSeparator    : _strGroupSeparator, 
					decimalSeparator  : _strDecimalSeparator, 
					amountMinFraction : _strAmountMinFraction 
				});
			bankAccBalance.baseCurrency = record.baseCurrency;
			
			if(record.equivalentAmount && record.equivalentCurrencySymbol)
			{
				bankAccBalance.equivalentAmount =  decodeURIComponent(record.equivalentCurrencySymbol) + ' ' + 
				 DataRender.amountFormatter(record.equivalentAmount, {
						groupSeparator    : _strGroupSeparator, 
						decimalSeparator  : _strDecimalSeparator, 
						amountMinFraction : _strAmountMinFraction
				 }); ;
				bankAccBalance.equivalentCurrency = record.equivalentCurrency;				
			}
			bankBalance.push(bankAccBalance);
		}
	});
	return bankBalance;
 }
 
 
 btrUtils.accTypeBalanceDetails = function(accType, data, currencySymbol, typeCodesMap)
 {
	let balanceArray =[];
	let balanceMap= new Map();
	let balanceRecord={};
	let amountDetail={};
	let accBalances = [];
	let typeCodeArr = null;
	let bank = '';
	let acctNmbr = '';
	let accountTypeCode = typeCodesMap.get(accType);
	let typeCodes = accountTypeCodes[accountTypeCode];
	let balanceDetailRec = null;
	
	if(typeCodes  != null && typeCodes != '')
	{
		typeCodeArr = typeCodes.split(','); 
	}
	
	data.forEach(function(record, idx){
		if(accountTypeCode == record.accountTypeCode)
		{
			balanceArray = [];
			balanceDetailRec = null;
			for(var index in typeCodeArr)
			{
				if(record && record.balanceDetails && record.balanceDetails.length > 0 )
				{
					record.balanceDetails.forEach(function(balanceDetail, idx){
						 if(typeCodeArr[index] == balanceDetail.typeCode)
						 {
							 balanceDetailRec = balanceDetail;
						 }
					 });
				}
			}
			if(balanceDetailRec != null)
			{
				balanceRecord={};
				balanceRecord.bank = record.bankDesc;
				balanceRecord.timeStamp = record.timeStamp;
				balanceRecord.accNmbr = record.accountNmbr;
				balanceRecord.baseAmount = decodeURIComponent(record.baseCurrencySymbol) + ' ' + 
					 DataRender.amountFormatter(balanceDetailRec.amount, {
							groupSeparator    : _strGroupSeparator, 
							decimalSeparator  : _strDecimalSeparator, 
							amountMinFraction : _strAmountMinFraction, 
						});
    		    balanceRecord.baseCurrency=balanceDetailRec.currency;
    		    balanceRecord.typeCode=balanceDetailRec.typeCode; 
    		    if(record.equivalentAmount && record.equivalentCurrencySymbol)
    		    {
    				balanceRecord.equivalentCurrency = record.equivalentCurrency;
    				balanceRecord.equivalentAmount =  decodeURIComponent(record.equivalentCurrencySymbol) + ' ' + 
    				 DataRender.amountFormatter(record.equivalentAmount, {
    						groupSeparator    : _strGroupSeparator, 
    						decimalSeparator  : _strDecimalSeparator, 
    						amountMinFraction : _strAmountMinFraction
    				 });    		    	
    		    }
				accBalances.push(balanceRecord);
			}
		}
	});
	return accBalances;
 }
 btrUtils.currencyFilter = function(addData,metaData, widgetName, widgetType, url){
	 $.ajax({                                                                                      
            type : "GET",                 
            url :  url,
            dataType : "json",
            data : [],
            success : function(data, response) { 
                 let baseCCYPresent = false;			
                 let filterCCYList = '<select class="widget-custom-filter small-select d-none" id="ccyFilter_'+widgetName+'">';
				 $(data.d.preferences).each(function(index, ccyData){
					filterCCYList += '<option value="'+ccyData.CODE+'">'+ccyData.DESCR+'</option>';
					if(_strSellerCurrency == ccyData.CODE)
					{
						baseCCYPresent = true;
					}
				 });
				 
				 if(!baseCCYPresent)
				 {
					 filterCCYList += '<option value="'+_strSellerCurrency+'">'+_strSellerCurrency+'</option>';
				 }
				 filterCCYList += '</select>';
				
				$('#ccyFilter_'+widgetName).remove(); 
				$('#groupWidgetContainer_'+widgetName).find('.widget-toogle-btn').after( filterCCYList );
				
//				$('#ccyFilter_'+widgetName).select2({
//					minimumResultsForSearch: 'Infinity',
//					dropdownAutoWidth : true
//				});
				
				if(usrDashboardPref.widgets[widgetName] && usrDashboardPref.widgets[widgetName].defaultCurrency){
				   btrAccCurrency = usrDashboardPref.widgets[widgetName].defaultCurrency;
				}
				$('#ccyFilter_'+widgetName).val(btrAccCurrency)
			//	$('#ccyFilter_'+widgetName).val(btrAccCurrency).trigger('change.select2');
				$('#ccyFilter_'+widgetName).unbind('change');
				$('#ccyFilter_'+widgetName).change(function(){
					btrAccCurrency = $(this).val();
					//localStorage.setItem('EntBalanceCCY', btrAccCurrency);
					
					if(!usrDashboardPref.widgets){
					   usrDashboardPref.widgets = {};
					}					
					usrDashboardPref.widgets['btrAccountType'] = {
						'defaultCurrency' : btrAccCurrency
					}
					usrDashboardPref.widgets['btrBankName'] = {
						'defaultCurrency' : btrAccCurrency
					}
					updateDashboardPref();
					
					if(widgetType == 'btrAccountType')
					{
						$.publish('com.finastra.widget.filter.btrAccountType',btrAccCurrency);
						widgetMap[widgetName].actions.refresh.callbacks.init(addData, metaData);
					}
					else if(widgetType == 'btrCurrency')
					{
						$.publish('com.finastra.widget.filter.btrCurrency',btrAccCurrency);
						widgetMap[widgetName].actions.refresh.callbacks.init(addData, metaData);
					}					
					else
					{
						$.publish('com.finastra.widget.filter.btrBankName',btrAccCurrency);
						widgetMap[widgetName].actions.refresh.callbacks.init(addData, metaData);
					}
				});
            }
	});   
 }
