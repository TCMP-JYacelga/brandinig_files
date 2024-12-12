function showAdvanceFilterPopup(){
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 735,
		resizable: false,
		draggable: false,
		modal : true,
		dialogClass:'ft-tab-bar',
		/*buttons :[{
	       	   id: 'advFilterSearch',
	       	   text: 'Search',
	       	   click: function(){
	       			hideErrorPanel('#advancedFilterErrorDiv');
		       		$(document).trigger("searchActionClicked");
					$(this).dialog("close");
	       	   }
       },{
	       	   id: 'advFilterSaveAndSearch',
	       	   text: 'Save And Search',
	       	   click: function(){
	       			hideErrorPanel('#advancedFilterErrorDiv');
		       		$(document).trigger("saveAndSearchActionClicked");
	       	   }
       },{
	       	   id: 'advFilterCancel',
	       	   text: 'Cancel',
	       	   click: function(){
				$(this).dialog("close");
	       	   }
      }],*/
      open:function(){
    	  if(!advancedFilterFieldsDataAdded){
	    	  $("#tabs").tabs({
					select : function(event, tab) {
						if(tab.index==0){
							if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
								$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
							}
							$('#advFilterSearch').hide();
							$('#advFilterSaveAndSearch').hide();
							$('#advFilterClear').hide();
							$('#advFilterCancel').hide();
							$('#advFilterClose').show();
						}else{
							$('#advFilterSearch').show();
							$('#advFilterSaveAndSearch').show();
							$('#advFilterClear').show();
							$('#advFilterCancel').show();
							$('#advFilterClose').hide();
						}
					},show:function(e,ui){
						if('undefined'!=filterGrid && !isEmpty(filterGrid))
						filterGrid.getView().refresh();
					}			
			});
	    	$("#tabs").barTabs();
			setReceivingAccountsMenuItems("#receiverAccNmbr");
			setReceiverAccNameMenuItems("#receiverAccName");
			setReceiverBankFIIDMenuItems("#receivingBankFiId");
			setSendingBankMenuItems("#sendingBank");
    		filterGrid = createFilterGrid();
			changeAdvancedFilterTab(1);
			advancedFilterFieldsDataAdded=true;
		}
      }
	});
	$('#advancedFilterPopup').dialog("open");
}
function changeAdvancedFilterTab(index) {
	if (index == 0) {
		$('#advFilterSearch').hide();
		$('#advFilterSaveAndSearch').hide();
		$('#advFilterClear').hide();
		$('#advFilterCancel').hide();
	} else {
		$('#advFilterSearch').show();
		$('#advFilterSaveAndSearch').show();
		$('#advFilterClear').show();
		$('#advFilterCancel').show();
	}
	$('#tabs').tabs("option", "selected", index);
}
function setReceivingAccountsMenuItems(elementId){
	$.ajax({
		url : 'services/userseek/receivingaccounts.json',
		method : 'GET',
		success:function(responseData){
			if(!isEmpty(responseData)){
				var data = responseData.d.preferences;
				for (var index = 0; index < data.length; index++) {
						var opt = $('<option />', {
									value : data[index].CODE,
									text : data[index].CODE
								});
						opt.appendTo(elementId);
				}
				
			 }
		 }
	 });
}
function setReceiverAccNameMenuItems(elementId){
	$.ajax({
		url : 'services/userseek/receivingaccounts.json',
		method : 'GET',
		success:function(responseData){
			if(!isEmpty(responseData)){
				var data = responseData.d.preferences;
				$(elementId).empty();
			    var el = $(elementId).multiselect();
			    el.attr('multiple',true);
				for(index=0;index<data.length;index++)
				{
					var opt = $('<option />', {
						value: data[index].CODE,
						text: data[index].DESCR
					});
					opt.attr('selected','selected');
			        opt.appendTo( el );	
				}
				 el.multiselect('refresh');
				 filterRecAccNameCount = data.length;
			 }
		 }
	 });
}
function setReceiverBankFIIDMenuItems(elementId){
	$.ajax({
		url : 'services/userseek/receivingbankfiId.json',
		method : 'GET',
		success:function(responseData){
			if(!isEmpty(responseData)){
				var data = responseData.d.preferences;
				for(index=0;index<data.length;index++)
				{
					var opt = $('<option />', {
						value: data[index].CODE,
						text: data[index].DESCR
					});
					opt.appendTo( elementId );		
				}
			 }
		 }
	 });
}
function setSendingBankMenuItems(elementId){
	$(elementId).autocomplete({
		minLength: 1,
		source: function(request, response) {
			$.ajax({
				url : 'services/userseek/sendingBankSeek.json?&$filtercode1=' + code1,
				data : {$autofilter : request.term},
                async: false,
				success:function(data){
					 if(!isEmpty(data)&&!(isEmpty(data.d))){
                            var rec = data.d.preferences;
                            response($.map(rec, function(item) {
                                return {
                                    value : item.CODE,
                                    label : item.DESCR,  
                                    }
                            }));    
                        }
				 }
			 });
		}
	});
}
function createFilterGrid() {
	var store = filterGridStore();
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				maxHeight : 430,
				overFlowY:'auto',
				width:708,
				forceFit:true,
				popup : true,
				margin: '0 0 12 0',
				cls : 't7-grid',
				listeners: {
					cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
						 var IconLinkClicked = (e.target.tagName == 'A');	
	         		     if(IconLinkClicked){
					        var clickedId = e.target.id;
							if(clickedId=='advFilterEdit'){
								$(document).trigger("editFilterEvent",[view, rowIndex]);
							}else if(clickedId=='advFilterView'){
								$(document).trigger("viewFilterEvent",[view, rowIndex]);
							}else if(clickedId=='advFilterDelete'){
								$(document).trigger("deleteFilterEvent",[view, rowIndex]);
							}
						}
					}
				},
				columns : [{
					text: '#',
					width : 50,
					align :'center',
					sortable : false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
					    return rowIndex+1;
				 }
				},{
					xtype : 'actioncolumn',
					text : 'Actions',
					align : 'center',
					sortable:false,
					flex  : 1,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						    return '<a id="advFilterView" class="grid-row-action-icon  icon-view" href="#" title='+getLabel('view', 'View')+'></a>'
						          +'<a id="advFilterEdit" class="grid-row-action-icon icon-edit" href="#" title='+getLabel('edit', 'Edit')+'></a>'
						          +'<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>';
					 }
				}, {
					text : 'Filter Name',
					dataIndex : 'filterName',
					flex : 3,
					sortable : false,
					menuDisabled : true
				},{
					xtype : 'actioncolumn',
					align : 'center',
					flex : 1,
					header : getLabel('order', 'Order'),
					sortable : false,
					menuDisabled : true,
					items : [{
						iconCls : 'grid-row-up-icon',
						tooltip : getLabel('up', 'Up'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
									[grid, rowIndex, -1]);
						}
					}, {
						iconCls : 'grid-row-down-icon',
						tooltip : getLabel('down', 'Down'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
									[grid, rowIndex, 1]);
						}
					}]
				}],
				renderTo : 'filterList'
			});
	grid.on('resize', function() {
				grid.doLayout();
			});

	return grid;
}
function filterGridStore() {
	var myStore = null;
	var records = [];
	Ext.Ajax.request({
		url : 'services/userfilterslist/incomingWireFilter.json',
		async : false,
		method : "GET",
		success : function(response) {
			if (!Ext.isEmpty(response.responseText)) {
				var decodedJson = Ext.decode(response.responseText);
				var arrJson = new Array();
							
				if(!Ext.isEmpty(decodedJson.d.filters))
				{
					for(i=0;i<decodedJson.d.filters.length;i++)
					{
						arrJson.push({"filterName":decodedJson.d.filters[i]});
					}
					myStore = Ext.create('Ext.data.Store', {
									fields : ['filterName'],
									data : arrJson,
									autoLoad : true
								});
				}
			}
		},
		failure : function(response) {
		}
	});
	return myStore;
}
function getAdvancedFilterQueryJson()
{
	var objJson = null;
	var jsonArray = [];
	
	// FED Reference No.
	var fedReference = $("input[type='text'][id='fedReferenceNo']").val();
	if (!Ext.isEmpty(fedReference)) {
		jsonArray.push({
					field : 'fedReference',
					paramName : 'fedReference',
					operator : 'eq',
					operatorValue : 'eq',
					value1 : fedReference,
					paramValue1 : fedReference,
					value2 : '',
					paramValue2 : '',
					dataType : 0,
					displayType : 0
				});
	}
	
	// Dr/Cr 
	var drCrFlag = $("select[id='drCrFlag']").val();
	if( !Ext.isEmpty( drCrFlag ))
		{
			jsonArray.push({
				field : 'drCrFlag',
				paramName : 'drCrFlag',
				operator : 'eq',
				operatorValue : 'eq',
				value1 : drCrFlag,
				paramValue1 : drCrFlag,
				value2 : '',
				paramValue2 : '',
				dataType : 0,
				displayType : 6
			});
		}
	
	var blnAutoNumeric = true;
	// Operator
	var opFilter = $("select[id='amountOperator']").val();
	// Wire Amount
	var paymentAmount = $("input[type='text'][id='paymentAmount']").val();
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("paymentAmount");
	if (blnAutoNumeric)
		paymentAmount = $("#paymentAmount").autoNumeric('get');
	else
		paymentAmount = $("#paymentAmount").val();
	// jquery autoNumeric formatting
	if (!Ext.isEmpty(paymentAmount)) {
		jsonArray.push({
					field : 'paymentAmount',
					paramName : 'paymentAmount',
					operator : opFilter,
					operatorValue : opFilter,
					value1 : paymentAmount,
					paramValue1 : paymentAmount,
					value2 : '',
					paramValue2 : '',
					dataType :2,
					displayType : 2
				});
	}
	
	// Receiving Account 
	/*var receiverAccNmbr = $("select[id='receiverAccNmbr']").val();
	if( !Ext.isEmpty( receiverAccNmbr ))
		{
			jsonArray.push({
				field : 'receiverAccNmbr',
				paramName : 'receiverAccNmbr',
				operator : 'eq',
				operatorValue : 'eq',
				value1 : receiverAccNmbr,
				paramValue1 : receiverAccNmbr,
				value2 : '',
				paramValue2 : '',
				dataType : 0,
				displayType : 6
			});
		}*/
	// Receiving Account Name
	var receiverAccNameValue = $("#receiverAccName").getMultiSelectValueString();
	var receiverAccNameDesc = [];
	var filtercount = null;
    $('#receiverAccName :selected').each(function(i, selected){
    	receiverAccNameDesc[i] = $(selected).text();
    });
   var tempReceiverAccNameValue = receiverAccNameValue;
   /*if(receiverAccNameValue == '' && !Ext.isEmpty(filterRecAccNameCount))
   {
	   tempReceiverAccNameValue = filterRecAccNameCount.join("and");
       if (!Ext.isEmpty(tempReceiverAccNameValue)) {
       filtercount = filterRecAccNameCount.length -1  ;
       if(!Ext.isEmpty(filtercount)){            
    	   tempReceiverAccNameValue = receiverAccNameValue.split('and').join(',');
           if(filtercount == tempReceiverAccNameValue.length)
        	   tempReceiverAccNameValue='All';
           }
       }
   }*/
	
   if (!Ext.isEmpty(tempReceiverAccNameValue)) {
	   
	   if(!Ext.isEmpty(filterRecAccNameCount)){
           var nameArray = receiverAccNameValue.split(',');
           if(filterRecAccNameCount == nameArray.length)
        	   tempReceiverAccNameValue='All';
       }
	//var receiverAccName = $("select[id='receiverAccName']").val();
	
	if( tempReceiverAccNameValue != "All")
		{
			jsonArray.push({
				field : 'receiverAccNmbr',
				paramName : 'receiverAccNmbr',
				operator : 'in',
				operatorValue : 'in',
				value1 : encodeURIComponent(tempReceiverAccNameValue.replace(new RegExp("'", 'g'), "\''")),
				paramValue1 : encodeURIComponent(tempReceiverAccNameValue.replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				paramValue2 : '',
				dataType : 0,
				displayType : 11,//6,
				displayValue1 : receiverAccNameDesc.toString()
			});
		}
	}
	// Sending Bank
	var sendingBank = $("#sendingBank").val();
	if( !Ext.isEmpty( sendingBank ))
		{
			jsonArray.push({
				field : 'senderBankName',
				paramName : 'senderBankName',
				operator : 'eq',
				operatorValue : 'eq',
				value1 : sendingBank,
				paramValue1 : sendingBank,
				value2 : '',
				paramValue2 : '',
				dataType : 0,
				displayType : 6
			});
		}
	
		
	objJson = jsonArray;
	return objJson;
}
function getAdvancedFilterValueJson(FilterCodeVal) {
	var jsonArray = [];
	
	// FED Reference No.
	var fedReference = $("input[type='text'][id='fedReferenceNo']").val();
	if (!Ext.isEmpty(fedReference)) {
		jsonArray.push({
					field : 'fedReference',
					paramName : 'fedReference',
					operator : 'eq',
					operatorValue : 'eq',
					value1 : fedReference,
					paramValue1 : fedReference,
					value2 : '',
					paramValue2 : '',
					dataType : 0,
					displayType : 4
				});
	}
	// Dr/Cr 
	var drCrFlag = $("select[id='drCrFlag']").val();
	if( !Ext.isEmpty( drCrFlag ))
		{
			jsonArray.push({
				field : 'drCrFlag',
				paramName : 'drCrFlag',
				operator : 'eq',
				operatorValue : 'eq',
				value1 : drCrFlag,
				paramValue1 : drCrFlag,
				value2 : '',
				paramValue2 : '',
				dataType : 0,
				displayType : 6
			});
		}
	
	// Operator
	var opFilter = $("select[id='amountOperator']").val();
	// Wire Amount
	var paymentAmount = $("input[type='text'][id='paymentAmount']").val();
	if (!Ext.isEmpty(paymentAmount)) {
		jsonArray.push({
					field : 'paymentAmount',
					paramName : 'paymentAmount',
					operator : opFilter,
					operatorValue : opFilter,
					value1 : paymentAmount,
					paramValue1 : paymentAmount,
					value2 : '',
					paramValue2 : '',
					dataType :2,
					displayType : 2
				});
	}
	// Receiving Account 
/*	var receiverAccNmbr = $("select[id='receiverAccNmbr']").val();
	if( !Ext.isEmpty( receiverAccNmbr ))
		{
			jsonArray.push({
				field : 'receiverAccNmbr',
				paramName : 'receiverAccNmbr',
				operator : 'eq',
				operatorValue : 'eq',
				value1 : receiverAccNmbr,
				paramValue1 : receiverAccNmbr,
				value2 : '',
				paramValue2 : '',
				dataType : 0,
				displayType : 6
			});
		}*/
	// Receiving Account Name
	/*var receiverAccName = $("select[id='receiverAccName']").val();
	if( !Ext.isEmpty( receiverAccName ))
		{
			jsonArray.push({
				field : 'receiverAccNmbr',
				paramName : 'receiverAccNmbr',
				operator : 'eq',
				operatorValue : 'eq',
				value1 : receiverAccName,
				paramValue1 : receiverAccName,
				value2 : '',
				paramValue2 : '',
				dataType : 0,
				displayType : 6
			});
		}*/
	var receiverAccNameValue = $("#receiverAccName").getMultiSelectValueString();
	var receiverAccNameDesc = [];
	var filtercount = null;
    $('#receiverAccName :selected').each(function(i, selected){
    	receiverAccNameDesc[i] = $(selected).text();
    });
   var tempReceiverAccNameValue = receiverAccNameValue;
   /*if(receiverAccNameValue == '' && !Ext.isEmpty(filterRecAccNameCount))
   {
	   tempReceiverAccNameValue = filterRecAccNameCount.join("and");
       if (!Ext.isEmpty(tempReceiverAccNameValue)) {
       filtercount = filterRecAccNameCount.length -1  ;
       if(!Ext.isEmpty(filtercount)){            
    	   tempReceiverAccNameValue = receiverAccNameValue.split('and').join(',');
           if(filtercount == tempReceiverAccNameValue.length)
        	   tempReceiverAccNameValue='All';
           }
       }
   }*/
	
   if (!Ext.isEmpty(tempReceiverAccNameValue)) {
	   
	   if(!Ext.isEmpty(filterRecAccNameCount)){
           var nameArray = receiverAccNameValue.split(',');
           if(filterRecAccNameCount == nameArray.length)
        	   tempReceiverAccNameValue='All';
       }
	//var receiverAccName = $("select[id='receiverAccName']").val();
	
	if( tempReceiverAccNameValue != "All")
		{
			jsonArray.push({
				field : 'receiverAccNmbr',
				paramName : 'receiverAccNmbr',
				operator : 'in',
				operatorValue : 'in',
				value1 : encodeURIComponent(tempReceiverAccNameValue.replace(new RegExp("'", 'g'), "\''")),
				paramValue1 : encodeURIComponent(tempReceiverAccNameValue.replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				paramValue2 : '',
				dataType : 0,
				displayType : 11,//6,
				displayValue1 : receiverAccNameDesc.toString()
			});
		}
	}
	
	// Sending Bank
	var sendingBank = $("#sendingBank").val();
	if( !Ext.isEmpty(sendingBank))
		{
			jsonArray.push({
				field : 'senderBankName',
				paramName : 'senderBankName',
				operator : 'eq',
				operatorValue : 'eq',
				value1 : sendingBank,
				paramValue1 : sendingBank,
				value2 : '',
				paramValue2 : '',
				dataType : 0,
				displayType : 6
			});
		}
	
	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	return objJson;
}

function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}