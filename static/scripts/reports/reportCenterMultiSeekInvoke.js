function arrayUnique(selection){
  var unique = {};
  var distinct = [];
	for( var i in selection ){
		 if( typeof(unique[selection[i].code]) == "undefined"){
		  distinct.push(selection[i]);
		 }
		 unique[selection[i].code] = 0;
	}
	
	return distinct;
}
function getMultiSeekHelp(elementId, seekId, strUrl, inputId, callerId, seekUrl, maxColumns, fptrCallback)
{


	var strValue;
	var count = 0;
	var strAttr;
	var frm = document.forms["frmMain"];
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var parentElementArray = elementId.split("|");
	var myJSON = '{}';
	if(inputId != "")
	{
		var inputIdArray = inputId.split("|");	
		var json;
		var index;
		for (i=0; i < inputIdArray.length; i++)
		{
			json = inputIdArray[i].split(":");
			/*
			 * Element exist in the form
			 * e.g. product:bankProduct, here bankProduct exist as an element in
			 * the html form.
			 */
			if (document.getElementById( json[1]))
			{
				for(j=0; j < json.length; j++)
				{
					if (document.getElementById(json[j]) == null)
					{
						if (strValue == null)
							strValue = '"' + json[j] + '"' + ':' ;
						else	
							strValue = strValue + '"' + json[j] + '"' + ':' ;
					}	
					else
					{
						strValue = strValue + '"' + document.getElementById( json[j] ).value + '",'  ;
					}
				}
			}
			/*
			 * Element does not exist in the form so actual value is passed from model.
			 * e.g. product:${model.bankProduct}.
			 */
			else
			{
				strValue = strValue + '"' + json[0] + '":"' + json[1] + '",';
			}
		}
		if(document.getElementById("parentInputId")!= null)
		{
			parentInputId = document.getElementById("parentInputId").value ;
			index = parentInputId.lastIndexOf(',');
	    	parentInputId = parentInputId.substring(0, index);
			var outerArray = parentInputId.split(',');
			var innerArray = null;
			var result = "";
			var paramCode = null, paramElement = null, paramValue = null;
			jQuery.each(outerArray, function(i,val) {
				innerArray = val.split(':');
				paramCode = innerArray[0];
				paramElement = innerArray[1];
				if(document.getElementsByName(paramElement)[0] != null)
				{
					paramValue = document.getElementsByName(paramElement)[0].value;
					result = result + paramCode + ":"+paramValue+",";
				}
				else{
					result = result + paramCode + ":"+paramElement+",";
				}				
			});
			if(result != null && result != '')
			{
				strValue = strValue + '"parentInput":"' + result + '",';				
			}
		}
		index = strValue.lastIndexOf(',');
		strValue = strValue.substring(0, index);
		myJSON='{ ' + strValue + '}';
	}
	document.getElementById("parentElementId").value = elementId;
	document.getElementById("code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("formName").value = seekId;
	document.getElementById("callerId").value = callerId;
	document.getElementById("seekInputs").value = myJSON;
	document.getElementById("seekUrl").value = seekUrl;
	if (document.getElementById("callback"))
		document.getElementById("callback").value = fptrCallback;
	if(document.getElementById("maxColumns"))
		document.getElementById("maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}
var popupgrid = null;
var fieldCounter = null; 
var clientFieldIndex = null;

function showSeekSelectionPopup(counter , singleOrMulti , paramName,itemId,valueId,parameterName,reportCode, isSelectionLocked,fieldIndex,reportlabel) {
	var grid;
	var me = {};
	var selectRecords = [];
	var elementId = itemId;
	var meElement = $('#'+elementId);
	me.options = {};
	me.options.single = singleOrMulti;
	me.options.title = reportlabel!=undefined && reportlabel != "" ? reportlabel : paramName;
	me.options.root = 'd.preferences';
	me.options.code = 'PARAMETER_CODE';
	me.options.description = 'PARAMETER_DESC';
	me.options.reportCode = reportCode;
	me.options.parameterName = parameterName;
	me.options.url = 'getPopUpDynamicValues.srvc?'+csrfTokenName+'='+ csrfTokenValue + '&parameterName='+parameterName+'&reportCode='+reportCode;
	if((entityCode != '' || typeof entityCode != undefined) && channelName!='BANK')
		me.options.url = me.options.url+'&entityCode='+entityCode;
	else if(paramName == 'User'  && document.getElementById('reportCenterParameterBean[3].value') != null && document.getElementById('reportCenterParameterBean[3].value').value !='' && typeof document.getElementById('reportCenterParameterBean[3].value').value != undefined)
		me.options.url = me.options.url+'&entityCode='+document.getElementById('reportCenterParameterBean[3].value').value;
	else if(paramName == 'Corporation'  && document.getElementById('reportCenterParameterBean[0].value') != null && document.getElementById('reportCenterParameterBean[0].value').value !='' && typeof document.getElementById('reportCenterParameterBean[0].value').value != undefined)
		me.options.url = me.options.url+'&$filtercode1='+document.getElementById('reportCenterParameterBean[0].value').value;	
	fieldCounter = "_"+counter;
	var values = [];
	var chkBoxSelection = [];
	var selection = [];
	var selectionArr = [];
	var mode = $('#mode').val();
	
	var clientId = null;
	if('CLIENT' == parameterName){
		clientFieldIndex = counter;
	}
	
	if(!Ext.isEmpty(clientFieldIndex)){
		
		if(document.getElementById('reportCenterParameterBean['+clientFieldIndex+'].value')){
			clientId = document.getElementById('reportCenterParameterBean['+clientFieldIndex+'].value').value;
		}else if(document.getElementById('reportParameterBean['+clientFieldIndex+'].value')){
			clientId = document.getElementById('reportParameterBean['+clientFieldIndex+'].value').value;
		}		
		
		if(!Ext.isEmpty(clientId) && '(ALL)' != clientId){
			me.options.url = me.options.url+'&clientCode='+clientId;
		}
	}
	
	me.options.onSelectionChange = function(values) {
	}

	$("#seekSelectionPopup_"+counter).dialog({
					title : me.options.title,
					maxHeight : 750,
					width : 700,
					modal : true,
					resizable: false,
		            draggable:false,
					buttons :  [
							{
								text:  getLabel('btnOk', 'Ok'),
								    "class": 'ft-button',
									'style':"margin:0 0 12 0 !important;",
									click: function() {
										// Save code here
											$(this).dialog("close");
											
											if( mode != 'view' )
											{
												if (me.options.single) 
												{
													document.getElementById(elementId).value = "";
													document.getElementById(elementId).value = selection.length > 0 ? selection[0].description : '';
													/*if( selection.length > 0 ){
														document.getElementById(valueId).style.display = 'inline';
														document.getElementById(elementId).style.display = 'none';
//														document.getElementById(valueId).className = "w14_8 rounded";
													}else{
														document.getElementById(valueId).style.display = 'none';
														document.getElementById(elementId).style.display = 'inline';
													}*/
													document.getElementById(valueId).value = "";
													document.getElementById(valueId).value = selection.length > 0 ? selection[0].code : '';
												} 
												else 
												{
													document.getElementById(elementId).value = "";
													document.getElementById(valueId).value = "";
													var strCode = [];
													var strDescription = [];
													var selectionArray=arrayUnique(selection);
														for (i = 0; i < selectionArray.length; i++) 
														{ 
															strCode[i] = selectionArray[i].code ;	
															strDescription[i] = selectionArray[i].description;	
														}
														selectionArr =  strCode.join(",");
														document.getElementById(elementId).value = strDescription.join(",");
														document.getElementById(valueId).value = strCode.join(",");	
														
													/*if(selection.length > 0 ){
														document.getElementById(valueId).style.display = 'inline';
														document.getElementById(elementId).style.display = 'none';
													}else{
														document.getElementById(valueId).style.display = 'none';
														document.getElementById(elementId).style.display = 'inline';
													}*/
												}
												me.options.onSelectionChange(selection);
												chkBlank(valueId)
											}
											popupgrid = null;
									}
							},
							{
								text: getLabel('btnCancel', 'Cancel'),
								"class": 'ft-button ft-button-light',
								'style':"margin:0 0 12 0 !important;",
								click: function() {
									// Cancel code here
									$(this).dialog("close");
								}
							}],
					close : function(){
							chkBoxSelection =  popupgrid.getSelectionModel().getSelection();
							$('#seekSelectionCriteria' + fieldCounter).val('');
							popupgrid.destroy();
							popupgrid = null;
					},
					open : function(event, ui) {

						if (document.getElementById(valueId) && document.getElementById(valueId).value != null &&
							document.getElementById(valueId).value.trim() != '' )
						{
							selectionArr = document.getElementById(valueId).value.split(",");
						}

						if (!popupgrid) {
							var proxy = {};
							if (me.options.url) {
								proxy = {
									type : 'ajax',
									url : me.options.url,
									reader : {
										type : 'json',
										root : me.options.root,
										totalProperty : 'd._count'
									}
								};
							} else if (me.options.data) {
								proxy = {
									type : 'pagingmemory',
									data : me.options.data,
									reader : {
										type : 'json',
										root : me.options.root
									}
								};
							} 
							
							var jsonData;
							var myStore = Ext.create('Ext.data.Store', {
										pageSize : 10,
										fields : [me.options.code,
												me.options.description],
										proxy : proxy,
										autoLoad : true,
										listeners:{
											beforeload: function(store){
												store.getProxy().limitParam = undefined;
												store.getProxy().sortParam = undefined;
												store.getProxy().setExtraParam("$showcount", 'Y');
												store.getProxy().setExtraParam("$top", 10);
												
											},
											afterLoad : function(){
													var jsonData = myStore.proxy.reader.rawData;
													myStore.proxy.totalProperty = jsonData.d._count;
												}
											}
									});

							var sm = Ext.create('Ext.selection.CheckboxModel',
									{
										headerWidth : 40,
										allowDeselect : true,
										injectCheckbox : 'first',
										mode: me.options.single ? 'SINGLE' : 'MULTI',
										checkOnly : true,
										listeners : {
											select : function(row, record,index, eopts) 
											{
												if (me.options.single) 
												{
													if(!Ext.isEmpty(record))
													{
														var selectRecords = [];
														selectRecords.push(record);
														popupgrid.getSelectionModel().select(selectRecords);
														selection = [];
														selection.push({
															"code":record.get(me.options.code),
															"description":record.get(me.options.description)
														});
														selectionArr=[];
														selectionArr.push(record.get(me.options.code));
													}
												} 
												else 
												{
													if(!Ext.isEmpty(record))
													{
														if (!Ext.Array.contains(selection,record.get(me.options.code))) 
														{
															selection.push({
																"code":record.get(me.options.code),
																"description":record.get(me.options.description)
															});
															selectionArr.push(record.get(me.options.code));
														}
													}
												} 
												
											},
											deselect : function(row, record,index, eopts) 
											{
												if(!Ext.isEmpty(record)) 
													{
														selection = selection.filter(function( selection ) {
															return selection.code !== record.get(me.options.code);
														});
														selectionArr = selectionArr.filter(function( selectionArr ) {
															return selectionArr !== record.get(me.options.code);
														});
													}
											}
										}
									});
							popupgrid = Ext.create('Ext.grid.Panel', {
								popup : true,
								width : 'auto',
								store : myStore,
								selModel : sm,
								columns : [{
									text : '#',
									align : 'center',
									hideable : false,
									sortable : false,
									draggable : false,
									resizable : false,
									menuDisabled : true,
									width : 50,
									minWidth : 35,
									renderer : function(value, metaData,
											record, rowIdx, colIdx, store) {
										if (record.get('isEmpty')) {
											if (rowIdx === 0) {
												metaData.style = "display:inline;text-align:center;position:absolute;white-space: nowrap !important;empty-cells:hide;";
												return getLabel(
														'gridNoDataMsg',
														'No records present at this moment!');
											} else
												return '';
										} else {
											var curPage = store.currentPage;
											var pageSize = store.pageSize;
											if(me.options.parameterName.indexOf("CURRENCY") >= 0 ||
													me.options.parameterName.indexOf("CCYCODE") >=0 ||
													me.options.parameterName.indexOf("_CCY") >= 0)
											{
												for(var i=0;i <store.data.items.length;i++)
												{
													if(store.data.items[i].data.PARAMETER_CODE=='(ALL)')
														store.data.items[i].data.PARAMETER_DESC = getLabel(store.data.items[i].data.PARAMETER_CODE,
																store.data.items[i].data.PARAMETER_DESC);
													else
														store.data.items[i].data.PARAMETER_DESC = getCurencyMstLabel(store.data.items[i].data.PARAMETER_CODE,
															store.data.items[i].data.PARAMETER_DESC);
												}
											}
											else if(me.options.parameterName.indexOf("P_RFI") >= 0 ||
													me.options.parameterName.indexOf("P_REC_FIN_INST") >=0 ||
													me.options.parameterName.indexOf("P_SEND_FIN_INST") >= 0 ||
													me.options.parameterName.indexOf("SELLER") >= 0 ||
													me.options.parameterName.indexOf("P_FI") >= 0 )
											{
												for(var i=0;i <store.data.items.length;i++)
												{
													if(store.data.items[i].data.PARAMETER_CODE=='(ALL)')
														store.data.items[i].data.PARAMETER_DESC = getLabel(store.data.items[i].data.PARAMETER_CODE,
																store.data.items[i].data.PARAMETER_DESC);
													else
														store.data.items[i].data.PARAMETER_DESC = getCountryMstLabel(store.data.items[i].data.PARAMETER_CODE,
															store.data.items[i].data.PARAMETER_DESC);
												}
											}
											else if(me.options.parameterName.indexOf("TYPE_CODE") >=0 )
											{
												for(var i=0;i <store.data.items.length;i++)
												{
													if( store.data.items[i].data.PARAMETER_CODE=='(ALL)')
														store.data.items[i].data.PARAMETER_DESC = getLabel(store.data.items[i].data.PARAMETER_CODE,
																store.data.items[i].data.PARAMETER_DESC);
													else
														store.data.items[i].data.PARAMETER_DESC = getTypeCodeLabel(store.data.items[i].data.PARAMETER_CODE,
															store.data.items[i].data.PARAMETER_DESC);
												}
											}
											else if(me.options.parameterName.indexOf("SERVICE") >=0 )
											{
												for(var i=0;i <store.data.items.length;i++)
												{
													if( store.data.items[i].data.PARAMETER_CODE=='(ALL)')
														store.data.items[i].data.PARAMETER_DESC = getLabel(store.data.items[i].data.PARAMETER_CODE,
																store.data.items[i].data.PARAMETER_DESC);
													else
														store.data.items[i].data.PARAMETER_DESC = getModuleLabel(store.data.items[i].data.PARAMETER_CODE,
															store.data.items[i].data.PARAMETER_DESC);
												}
											}
											else if(me.options.parameterName.indexOf("SCREEN_NAME") >=0 )
											{
												for(var i=0;i <store.data.items.length;i++)
												{
													if( store.data.items[i].data.PARAMETER_CODE=='(ALL)')
														store.data.items[i].data.PARAMETER_DESC = getLabel(store.data.items[i].data.PARAMETER_CODE,
																store.data.items[i].data.PARAMETER_DESC);
													else
														store.data.items[i].data.PARAMETER_DESC = getReportParamLabel("lbl.reportcenter.screenName."
															+store.data.items[i].data.PARAMETER_CODE.replace(/\s/g, ''),
															store.data.items[i].data.PARAMETER_DESC);
												}
											}
											else
											{	
												for(var i=0;i <store.data.items.length;i++)
												{
													if(store.data.items[i].data.PARAMETER_CODE=='(ALL)')
														store.data.items[i].data.PARAMETER_DESC = getLabel(store.data.items[i].data.PARAMETER_CODE,
																store.data.items[i].data.PARAMETER_DESC);
													else
														store.data.items[i].data.PARAMETER_DESC = getReportParamLabel("lbl.reportcenter."+me.options.reportCode+"."
														+me.options.parameterName+"."+store.data.items[i].data.PARAMETER_CODE.replace(/\s/g, ''),
															store.data.items[i].data.PARAMETER_DESC);
												}
											}
											var intValue = ((curPage - 1) * pageSize)
													+ rowIdx + 1;
											if (Ext.isEmpty(intValue))
												intValue = rowIdx + 1;
											return intValue;
										}
									}
								}, {
									text : getLabel("code","Code"),
									dataIndex : me.options.code,
									width : 180,
									sortable: false,
									hideable : false,
									draggable: false,
									lockable: false,
									resizable: false
								}, {
									text : getLabel("description","Description"),
									dataIndex : me.options.description,
									width : 410,
									hideable : false,
									sortable: false,
									draggable: false,
									lockable: false,
									resizable: false
								}],
								dockedItems : [{
//											xtype : 'pagingtoolbar',
//											store : myStore,
//											dock : 'bottom'
										}],
								renderTo : 'seekSelectionGrid'+fieldCounter
							});
							
							var gridSmartPager = Ext.create('Ext.ux.gcp.GCPPager', {
								store : myStore,
								baseCls : 'xn-paging-toolbar',
								dock : 'bottom',
								displayInfo : true,
								listeners: {beforechange : function(thisd, pageNum)
								{            
									myStore.getProxy().setExtraParam("$skip", pageNum);
									popupgrid.getSelectionModel().setLocked(false);
								}
							}							});
							Ext.QuickTips.init();
							popupgrid.addDocked(gridSmartPager);
							myStore.on('load', function(store, records) {
							if(!Ext.isEmpty(records)){
								$.each(records, function(index, record) 
										{
											if ( (!Ext.isEmpty(record.get(me.options.code)) && !Ext.isEmpty(selectionArr) &&
													Ext.Array.contains(selectionArr,record.get(me.options.code))))
											 {
												for (var j = 0; j < selectionArr.length; j++) 
													{
													  index = popupgrid.store.findExact(me.options.code, selectionArr[j]);
													  popupgrid.getSelectionModel().select(index,true);
													}
											 }
										});
								}
							
								if(mode === 'view'){
									popupgrid.getSelectionModel().setLocked(true);
								}
								else{
									popupgrid.getSelectionModel().setLocked(false);
								}
								jsonData = myStore.proxy.reader.rawData;
								$("#seekSelectionPopup_"+counter).dialog("option","position","center");
							});
							$('#seekSelectionCriteria' + fieldCounter).unbind();
							$('#seekSelectionCriteria' + fieldCounter).bind("keyup",function(event){
							//$('#seekSelectionCriteria' + fieldCounter).keyup( function() {
											myStore.clearFilter(true);
											myStore.getProxy().setExtraParam("$filterVal", $(this).val());
											if($(this).val().length >=3 || $(this).val().length ==0){
												myStore.currentPage =1;
												gridSmartPager.doRefresh(1);
											}
											$(this).focus();
											popupgrid.getSelectionModel().setLocked(false);
									});
						} else {
							popupgrid.store.reload();
						}
					}
	});
	}

function showInterfaceSeekSelectionPopup(counter , singleOrMulti , paramName,itemId,valueId,parameterName,interfaceCode,reportlabel) {
	var grid;
	var me = {};
	var selectRecords = [];
	var elementId = itemId;
	var meElement = $('#'+elementId);
	me.options = {};
	me.options.single = singleOrMulti;
	me.options.title = reportlabel;
	me.options.root = 'd.preferences';
	me.options.code = 'PARAMETER_CODE';
	me.options.description = 'PARAMETER_DESC';
	me.options.url = 'getInterfacePopUpDynamicValues.srvc?'+csrfTokenName+'='+ csrfTokenValue + '&parameterName='+parameterName+'&interfaceCode='+interfaceCode;
	if((entityCode != '' || typeof entityCode != undefined) && channelName!='BANK')
		me.options.url = me.options.url+'&entityCode='+entityCode;
	me.options.url = me.options.url+'&$filterVal'+$('#'+elementId).val();
	fieldCounter = "_"+counter;
	var values = [];
	var chkBoxSelection = [];
	var selection = [];
	var selectionArr = [];
	var mode = $('#mode').val();
	me.options.onSelectionChange = function(values) {
	}

	$("#seekSelectionPopup_"+counter).dialog({
					title : me.options.title,
					maxHeight : 750,
					width : 700,
					modal : true,
					resizable: false,
		            draggable:false,
					buttons :  [
							{
								text: getLabel('btnOk', 'Ok'),
								    "class": 'ft-button',
									'style':"margin:0 0 12 0 !important;",
									click: function() {
										// Save code here
											$(this).dialog("close");
											
											if( mode != 'view' )
											{
												if (me.options.single) 
												{
													document.getElementById(elementId).value = "";
													document.getElementById(elementId).value = selection.length > 0 ? selection[0].code : '';
//													if( selection.length > 0 ){
//														document.getElementById(valueId).style.display = 'inline';
//														document.getElementById(elementId).style.display = 'none';
//														document.getElementById(valueId).className = "w14_8 rounded";
//													}else{
//														document.getElementById(valueId).style.display = 'none';
//														document.getElementById(elementId).style.display = 'inline';
//													}
													document.getElementById(valueId).value = "";
													document.getElementById(valueId).value = selection.length > 0 ? selection[0].description : '';
												} 
												else 
												{
													document.getElementById(elementId).value = "";
													document.getElementById(valueId).value = "";
													var strCode = [];
													var strDescription = [];
													var selectionArray=arrayUnique(selection);
														for (i = 0; i < selectionArray.length; i++) 
														{ 
															strCode[i] = selectionArray[i].code ;	
															strDescription[i] = selectionArray[i].description;	
														}
														selectionArr =  strCode.join(",");
														document.getElementById(elementId).value = strCode.join(",");
														document.getElementById(valueId).value = strDescription.join(",");	
														
//													if(selection.length > 0 ){
//														document.getElementById(valueId).style.display = 'inline';
//														document.getElementById(elementId).style.display = 'none';
//														document.getElementById(valueId).className = "w14_8 rounded";
//													}else{
//														document.getElementById(valueId).style.display = 'none';
//														document.getElementById(elementId).style.display = 'inline';
//													}
												}
												me.options.onSelectionChange(selection);
											}
											popupgrid = null;
									}
							},
							{
								text: getLabel('btnCancel', 'Cancel'),
								"class": 'ft-button ft-button-light',
								'style':"margin:0 0 12 0 !important;",
								click: function() {
									// Cancel code here
									$(this).dialog("close");
								}
							}],
					close : function(){
							chkBoxSelection =  popupgrid.getSelectionModel().getSelection();
							$('#seekSelectionCriteria' + fieldCounter).val('');
							popupgrid.destroy();
							popupgrid = null;
					},
					open : function(event, ui) {

						if (document.getElementById(elementId) && document.getElementById(elementId).value != null &&
							document.getElementById(elementId).value.trim() != '' )
						{
							selectionArr = document.getElementById(elementId).value.split(",");
						}

						if (!popupgrid) {
							var proxy = {};
							if (me.options.url) {
								proxy = {
									type : 'ajax',
									url : me.options.url,
									reader : {
										type : 'json',
										root : me.options.root,
										totalProperty : 'd._count'
									}
								};
							} else if (me.options.data) {
								proxy = {
									type : 'pagingmemory',
									data : me.options.data,
									reader : {
										type : 'json',
										root : me.options.root
									}
								};
							} 
							
							var jsonData;
							var myStore = Ext.create('Ext.data.Store', {
										pageSize : 10,
										fields : [me.options.code,
												me.options.description],
										proxy : proxy,
										autoLoad : true,
										listeners:{
											beforeload: function(store){
												store.getProxy().limitParam = undefined;
												store.getProxy().sortParam = undefined;
												store.getProxy().setExtraParam("$showcount", 'Y');
												store.getProxy().setExtraParam("$top", 10);
												
											},
											afterLoad : function(){
													var jsonData = myStore.proxy.reader.rawData;
													myStore.proxy.totalProperty = jsonData.d._count;
												}
											}
									});

							var sm = Ext.create('Ext.selection.CheckboxModel',
									{
										headerWidth : 40,
										allowDeselect : true,
										injectCheckbox : 'first',
										mode: me.options.single ? 'SINGLE' : 'MULTI',
										checkOnly : true,
										listeners : {
											select : function(row, record,index, eopts) 
											{
												if (me.options.single) 
												{
													if(!Ext.isEmpty(record))
													{
														var selectRecords = [];
														selectRecords.push(record);
														popupgrid.getSelectionModel().select(selectRecords);
														selection = [];
														selection.push({
															"code":record.get(me.options.code),
															"description":record.get(me.options.description)
														});
														selectionArr=[];
														selectionArr.push(record.get(me.options.code));
													}
												} 
												else 
												{
													if(!Ext.isEmpty(record))
													{
														if (!Ext.Array.contains(selection,record.get(me.options.code))) 
														{
															selection.push({
																"code":record.get(me.options.code),
																"description":record.get(me.options.description)
															});
															selectionArr.push(record.get(me.options.code));
														}
													}
												} 
												
											},
											deselect : function(row, record,index, eopts) 
											{
												if(!Ext.isEmpty(record)) 
													{
														selection = selection.filter(function( selection ) {
															return selection.code !== record.get(me.options.code);
														});
														selectionArr = selectionArr.filter(function( selectionArr ) {
															return selectionArr !== record.get(me.options.code);
														});
													}
											}
										}
									});
							popupgrid = Ext.create('Ext.grid.Panel', {
								popup : true,
								width : 'auto',
								store : myStore,
								selModel : sm,
								columns : [{
									text : '#',
									align : 'center',
									hideable : false,
									sortable : false,
									draggable : false,
									resizable : false,
									menuDisabled : true,
									width : 50,
									minWidth : 35,
									renderer : function(value, metaData,
											record, rowIdx, colIdx, store) {
										if (record.get('isEmpty')) {
											if (rowIdx === 0) {
												metaData.style = "display:inline;text-align:center;position:absolute;white-space: nowrap !important;empty-cells:hide;";
												return getLabel(
														'gridNoDataMsg',
														'No records present at this moment!');
											} else
												return '';
										} else {
											var curPage = store.currentPage;
											var pageSize = store.pageSize;
											var intValue = ((curPage - 1) * pageSize)
													+ rowIdx + 1;
											if (Ext.isEmpty(intValue))
												intValue = rowIdx + 1;
											return intValue;
										}
									}
								}, {
									text : getLabel("code","Code"),
									dataIndex : me.options.code,
									width : 180,
									sortable: false,
									hideable : false,
									draggable: false,
									lockable: false,
									resizable: false
								}, {
									text : getLabel("description","Description"),
									dataIndex : me.options.description,
									width : 410,
									hideable : false,
									sortable: false,
									draggable: false,
									lockable: false,
									resizable: false
								}],
								dockedItems : [{
//											xtype : 'pagingtoolbar',
//											store : myStore,
//											dock : 'bottom'
										}],
								renderTo : 'seekSelectionGrid'+fieldCounter
							});
							var gridSmartPager = Ext.create('Ext.ux.gcp.GCPPager', {
								store : myStore,
								baseCls : 'xn-paging-toolbar',
								dock : 'bottom',
								displayInfo : true,
								listeners: {beforechange : function(thisd, pageNum)
								{            
									myStore.getProxy().setExtraParam("$skip", pageNum);
									popupgrid.getSelectionModel().setLocked(false);
								}
							}							});
							Ext.QuickTips.init();
							popupgrid.addDocked(gridSmartPager);
							myStore.on('load', function(store, records) {
								
								$.each(records, function(index, record) 
								{
									if ( (!Ext.isEmpty(record.get(me.options.code)) && !Ext.isEmpty(selectionArr) &&
											Ext.Array.contains(selectionArr,record.get(me.options.code))))
									 {
										for (var j = 0; j < selectionArr.length; j++) 
											{
											  index = popupgrid.store.findExact(me.options.code, selectionArr[j]);
											  popupgrid.getSelectionModel().select(index,true);
											}
									 }
								});
								
								if(mode === 'view'){
									popupgrid.getSelectionModel().setLocked(true);
								}
								else{
									popupgrid.getSelectionModel().setLocked(false);
								}
								jsonData = myStore.proxy.reader.rawData;
								$("#seekSelectionPopup_"+counter).dialog("option","position","center");
							});
							
							$('#seekSelectionCriteria' + fieldCounter).unbind();
							$('#seekSelectionCriteria' + fieldCounter).bind("keyup",function(event){
							//$('#seekSelectionCriteria' + fieldCounter).keyup( function() {
											myStore.clearFilter(true);
											myStore.getProxy().setExtraParam("$filterVal", $(this).val());
											if($(this).val().length >=3 || $(this).val().length ==0){
												myStore.currentPage =1;
												gridSmartPager.doRefresh(1);
											}
											$(this).focus();
											popupgrid.getSelectionModel().setLocked(false);
									});
						} else {
							popupgrid.store.reload();
						}
					}
	});
	}

function showFileUploadSeekSelectionPopup(counter , singleOrMulti , paramName,itemId,valueId,parameterName,reportCode,reportParam, isPayPackagePopup) {
var grid;
var me = {};
var selectRecords = [];
var elementId = itemId;
var meElement = $('#'+elementId);
var arrJson = appendDepFieldsJSON(counter);
me.options = {};
me.options.single = singleOrMulti;
me.options.title = 'Seek';
me.options.root = 'd.preferences';
me.options.code = 'PARAMETER_CODE';
me.options.description = 'PARAMETER_DESC';
me.options.url = 'getPopUpValues.srvc?'+csrfTokenName+'='+ csrfTokenValue + '&parameterName='+document.getElementById(parameterName).value+'&interfaceCode='+document.getElementById(reportCode).value+'&processCode='+document.getElementById(reportParam).value;
if(arrJson != null)
	me.options.url = me.options.url +'&dependentFeildsJSON='+arrJson;

fieldCounter = "_"+counter;
var values = [];
var chkBoxSelection = [];
var selection = [];
var selectionArr = [];
me.options.onSelectionChange = function(values) {
}

$("#seekSelectionPopup_"+counter).dialog({
				title : me.options.title,
				maxHeight : 750,
				width : 700,
				modal : true,
				buttons :  [
						{
							text: getLabel('btnOk', 'Ok'),
								"class": 'ft-button ft-button-primary',
								'style':"margin:0 0 12 0 !important;",
								click: function() {
									// Save code here
										$(this).dialog("close");
										
										if( mode != 'view' )
										{
											if (me.options.single) 
											{
												document.getElementById(elementId).value = "";
												document.getElementById(elementId).value = (selection.length > 0 && typeof selection[0].description != 'undefined') ? selection[0].description : '';
												document.getElementById(valueId).value = "";
												document.getElementById(valueId).value = (selection.length > 0 && typeof selection[0].code != 'undefined') ? selection[0].code : '';
											} 
											else 
											{
												document.getElementById(elementId).value = "";
												document.getElementById(elementId).value = selection.length > 0 ? selection[0].description : '';
												document.getElementById(valueId).value = "";
												document.getElementById(valueId).value = selection.length > 0 ? selection[0].code : '';
											}
											me.options.onSelectionChange(selection);
											if(isPayPackagePopup && selection.length) {
												strSelectedPayPackage = selection[0].code;
											}
										}
										popupgrid = null;
								}
						},
						{
							text: getLabel('btnCancel', 'Cancel'),
							"class": 'ft-button ft-button-light',
							'style':"margin:0 0 12 0 !important;",
							click: function() {
								// Cancel code here
								$(this).dialog("close");
							}
						}],
				close : function(){
						chkBoxSelection =  popupgrid.getSelectionModel().getSelection();
						$('#seekSelectionCriteria' + fieldCounter).val('');
						popupgrid.destroy();
						popupgrid = null;
				},
				open : function(event, ui) {
					selection = [];
					if (document.getElementById(valueId) && document.getElementById(valueId).value != null &&
						document.getElementById(valueId).value.trim() != '' && 
						document.getElementById(valueId).value.trim() != '(ALL)')
					{
						selection = document.getElementById(valueId).value.split(",");
					}

					if (!popupgrid) {
						var proxy = {};
						if (me.options.url) {
							proxy = {
								type : 'ajax',
								url : me.options.url,
								reader : {
									type : 'json',
									root : me.options.root,
									totalProperty : 'd._count'
								}
							};
						} else if (me.options.data) {
							proxy = {
								type : 'pagingmemory',
								data : me.options.data,
								reader : {
									type : 'json',
									root : me.options.root
								}
							};
						} 
						
						var jsonData;
						var myStore = Ext.create('Ext.data.Store', {
									pageSize : 10,
									fields : [me.options.code,
											me.options.description],
									proxy : proxy,
									autoLoad : true,
									listeners:{
										beforeload: function(store){
											store.getProxy().limitParam = undefined;
											store.getProxy().sortParam = undefined;
											store.getProxy().setExtraParam("$showcount", 'Y');
											store.getProxy().setExtraParam("$top", 10);
											
										},
										afterLoad : function(){
												var jsonData = myStore.proxy.reader.rawData;
												myStore.proxy.totalProperty = jsonData.d._count;
											}
										}
								});

						var sm = Ext.create('Ext.selection.CheckboxModel',
								{
									headerWidth : 40,
									allowDeselect : true,
									injectCheckbox : 'first',
									mode: me.options.single ? 'SINGLE' : 'MULTI',
									checkOnly : true,
									listeners : {
										select : function(row, record,index, eopts) 
										{
											if (me.options.single) 
											{
												if(!Ext.isEmpty(record))
												{
													var selectRecords = [];
													selectRecords.push(record);
													popupgrid.getSelectionModel().select(selectRecords);
													selection = [];
													selection.push({
														"code":record.get(me.options.code),
														"description":record.get(me.options.description)
													});
												}
											} 
											else 
											{
												me.options.single = true;
												if(!Ext.isEmpty(record))
												{
													if (!Ext.Array.contains(selection,record.get(me.options.code))) 
													{
														selection = [];
														selection.push({
															"code":record.get(me.options.code),
															"description":record.get(me.options.description)
														});
													}
												}
											} 
											
										},
										deselect : function(row, record,index, eopts) 
										{
											if(!Ext.isEmpty(record)) 
												{
													selection = selection.filter(function( selection ) {
														return selection.code !== record.get(me.options.code);
													});
												}
										}
									}
								});
						popupgrid = Ext.create('Ext.grid.Panel', {
							popup : true,
							width : 'auto',
							store : myStore,
							selModel : sm,
							columns : [{
								text : '#',
								align : 'center',
								hideable : false,
								sortable : false,
								draggable : false,
								resizable : false,
								menuDisabled : true,
								width : 50,
								minWidth : 35,
								renderer : function(value, metaData,
										record, rowIdx, colIdx, store) {
									if (record.get('isEmpty')) {
										if (rowIdx === 0) {
											metaData.style = "display:inline;text-align:center;position:absolute;white-space: nowrap !important;empty-cells:hide;";
											return getLabel(
													'gridNoDataMsg',
													'No records present at this moment!');
										} else
											return '';
									} else {
										var curPage = store.currentPage;
										var pageSize = store.pageSize;
										var intValue = ((curPage - 1) * pageSize)
												+ rowIdx + 1;
										if (Ext.isEmpty(intValue))
											intValue = rowIdx + 1;
										return intValue;
									}
								}
							}, {
								text : getLabel("code","Code"),
								dataIndex : me.options.code,
								width : 180,
								sortable: false,
								hideable : false,
								draggable: false,
								lockable: false,
								resizable: false
							}, {
								text : getLabel("description","Description"),
								dataIndex : me.options.description,
								width : 410,
								hideable : false,
								sortable: false,
								draggable: false,
								lockable: false,
								resizable: false
							}],
							dockedItems : [{
//										xtype : 'pagingtoolbar',
//										store : myStore,
//										dock : 'bottom'
									}],
							renderTo : 'seekSelectionGrid'+fieldCounter
						});
						var gridSmartPager = Ext.create('Ext.ux.gcp.GCPPager', {
							store : myStore,
							baseCls : 'xn-paging-toolbar',
							dock : 'bottom',
							displayInfo : true,
							listeners: {beforechange : function(thisd, pageNum)
							{            
								myStore.getProxy().setExtraParam("$skip", pageNum);
							}
						}							});
						Ext.QuickTips.init();
						popupgrid.addDocked(gridSmartPager);
						myStore.on('load', function(store, records) {
							
							$.each(records, function(index, record) 
							{
								if ( (!Ext.isEmpty(record.get(me.options.code)) && !Ext.isEmpty(selection) &&
										Ext.Array.contains(selection,record.get(me.options.code))))
								 {
									for (var j = 0; j < selection.length; j++) 
										{
										  index = popupgrid.store.findExact(me.options.code, selection[j]);
										  popupgrid.getSelectionModel().select(index,true);
										}
								 }
							});
							jsonData = myStore.proxy.reader.rawData;
						});
						
						$('#seekSelectionCriteria' + fieldCounter).unbind();
						$('#seekSelectionCriteria' + fieldCounter).bind("keyup",function(event){
						//$('#seekSelectionCriteria' + fieldCounter).keyup( function() {
										myStore.clearFilter(true);
										myStore.getProxy().setExtraParam("$filterVal", $(this).val());
										if($(this).val().length >=3 || $(this).val().length ==0){
											myStore.currentPage =1;
											gridSmartPager.doRefresh(1);
										}
										$(this).focus();
								});
					} else {
						popupgrid.store.reload();
					}
				}
				/*
				 * grid.on('cellclick', function(gridView, td, cellIndex, record, tr,rowIndex, eventObj) {
	
						if (eventObj.target && eventObj.target.tagName == "A" && eventObj.target.id === 'addReceiver') 
						{
							isReceiverAdded = true;
							/*$(document).trigger(
									"addRecordUsing",
									[record.get('code'), 'REC', record.get('description')]);
							$('.receiverSelectionPopupSelector .ft-button-primary:contains(Close)').text(getLabel('btnSubmit', 'Submit'));
						}
					});
				 * */
				
});

}


function showIrisSeekSelectionPopup(counter , singleOrMulti , paramName,itemId,valueId,parameterName,reportCode,reportParam) {
	var grid;
	var me = {};
	var selectRecords = [];
	var elementId = itemId;
	var meElement = $('#'+elementId);
	me.options = {};
	me.options.single = singleOrMulti;
	me.options.title = 'Seek';
	me.options.root = 'd.preferences';
	me.options.code = 'PARAMETER_CODE';
	me.options.description = 'PARAMETER_DESC';
	me.options.url = 'getPopUpValues.srvc?'+csrfTokenName+'='+ csrfTokenValue + '&parameterName='+parameterName+'&rec='+reportCode;
	fieldCounter = "_"+counter;
	var values = [];
	var chkBoxSelection = [];
	var selection = [];
	var selectionArr = [];
	me.options.onSelectionChange = function(values) {
	}

	$("#seekSelectionPopup_"+counter).dialog({
					title : me.options.title,
					maxHeight : 750,
					width : 700,
					modal : true,
					buttons :  [
							{
								text: getLabel('btnOk', 'Ok'),
									"class": 'ft-button ft-button-primary',
									'style':"margin:0 0 12 0 !important;",
									click: function() {
										// Save code here
											$(this).dialog("close");
											
											if( mode != 'view' )
											{
												if (me.options.single) 
												{
													document.getElementById(elementId).value = "";
													document.getElementById(elementId).value = selection.length > 0 ? selection[0].code : '';
													if( selection.length > 0 ){
														document.getElementById(valueId).style.display = 'inline';
														document.getElementById(elementId).style.display = 'none';
														document.getElementById(elementId).classList.add("hidden");
													}else{
														document.getElementById(valueId).style.display = 'none';
														document.getElementById(elementId).style.display = 'inline';
														document.getElementById(elementId).classList.remove("hidden");
													}
													document.getElementById(valueId).value = "";
													document.getElementById(valueId).value = selection.length > 0 ? selection[0].description : '';
												} 
												else 
												{
													document.getElementById(elementId).value = "";
													document.getElementById(valueId).value = "";
													var strCode = [];
													var strDescription = [];
														for (i = 0; i < selection.length; i++) 
														{ 
															strCode[i] = selection[i].code ;	
															strDescription[i] = selection[i].description;	
														}
														selectionArr =  strCode.join(",");
														document.getElementById(elementId).value = strCode.join(",");
														document.getElementById(valueId).value = strDescription.join(",");	
														
													if(selection.length > 0 ){
														document.getElementById(valueId).style.display = 'inline';
														document.getElementById(elementId).style.display = 'none';
														document.getElementById(elementId).classList.add("hidden");
													}else{
														document.getElementById(valueId).style.display = 'hidden';
														document.getElementById(elementId).style.display = 'inline';
														document.getElementById(elementId).classList.remove("hidden");
													}
												}
												me.options.onSelectionChange(selection);
											}
											popupgrid = null;
									}
							},
							{
								text: getLabel('btnCancel', 'Cancel'),
								"class": 'ft-button ft-button-light',
								'style':"margin:0 0 12 0 !important;",
								click: function() {
									// Cancel code here
									$(this).dialog("close");
								}
							}],
					close : function(){
							chkBoxSelection =  popupgrid.getSelectionModel().getSelection();
							$('#seekSelectionCriteria' + fieldCounter).val('');
							popupgrid.destroy();
							popupgrid = null;
					},
					open : function(event, ui) {
						if (document.getElementById(elementId) && document.getElementById(elementId).value != null &&
							document.getElementById(elementId).value.trim() != '' && 
							document.getElementById(elementId).value.trim() != '(ALL)')
						{
							selectionArr = document.getElementById(elementId).value.split(",");
						}

						if (!popupgrid) {
							var proxy = {};
							if (me.options.url) {
								proxy = {
									type : 'ajax',
									url : me.options.url,
									reader : {
										type : 'json',
										root : me.options.root,
										totalProperty : 'd._count'
									}
								};
							} else if (me.options.data) {
								proxy = {
									type : 'pagingmemory',
									data : me.options.data,
									reader : {
										type : 'json',
										root : me.options.root
									}
								};
							} 
							
							var jsonData;
							var myStore = Ext.create('Ext.data.Store', {
										pageSize : 10,
										fields : [me.options.code,
												me.options.description],
										proxy : proxy,
										autoLoad : true,
										listeners:{
											beforeload: function(store){
												store.getProxy().limitParam = undefined;
												store.getProxy().sortParam = undefined;
												store.getProxy().setExtraParam("$showcount", 'Y');
												store.getProxy().setExtraParam("$top", 10);
												
											},
											afterLoad : function(){
													var jsonData = myStore.proxy.reader.rawData;
													myStore.proxy.totalProperty = jsonData.d._count;
												}
											}
									});

							var sm = Ext.create('Ext.selection.CheckboxModel',
									{
										headerWidth : 40,
										allowDeselect : true,
										injectCheckbox : 'first',
										mode: me.options.single ? 'SINGLE' : 'MULTI',
										checkOnly : true,
										listeners : {
											select : function(row, record,index, eopts) 
											{
												if (me.options.single) 
												{
													if(!Ext.isEmpty(record))
													{
														var selectRecords = [];
														selectRecords.push(record);
														popupgrid.getSelectionModel().select(selectRecords);
														selection = [];
														selection.push({
															"code":record.get(me.options.code),
															"description":record.get(me.options.description)
														});
													}
												} 
												else 
												{
													if(!Ext.isEmpty(record))
													{
														if (!Ext.Array.contains(selection,record.get(me.options.code))) 
														{
															selection.push({
																"code":record.get(me.options.code),
																"description":record.get(me.options.description)
															});
														}
													}
												} 
												
											},
											deselect : function(row, record,index, eopts) 
											{
												if(!Ext.isEmpty(record)) 
													{
														selection = selection.filter(function( selection ) {
															return selection.code !== record.get(me.options.code);
														});
													}
											}
										}
									});
							popupgrid = Ext.create('Ext.grid.Panel', {
								popup : true,
								width : 'auto',
								store : myStore,
								selModel : sm,
								columns : [{
									text : '#',
									align : 'center',
									hideable : false,
									sortable : false,
									draggable : false,
									resizable : false,
									menuDisabled : true,
									width : 50,
									minWidth : 35,
									renderer : function(value, metaData,
											record, rowIdx, colIdx, store) {
										if (record.get('isEmpty')) {
											if (rowIdx === 0) {
												metaData.style = "display:inline;text-align:center;position:absolute;white-space: nowrap !important;empty-cells:hide;";
												return getLabel(
														'gridNoDataMsg',
														'No records present at this moment!');
											} else
												return '';
										} else {
											var curPage = store.currentPage;
											var pageSize = store.pageSize;
											var intValue = ((curPage - 1) * pageSize)
													+ rowIdx + 1;
											if (Ext.isEmpty(intValue))
												intValue = rowIdx + 1;
											return intValue;
										}
									}
								}, {
									text : "Code",
									dataIndex : me.options.code,
									width : 180,
									sortable: false,
									hideable : false,
									draggable: false,
									lockable: false,
									resizable: false
								}, {
									text : "Description",
									dataIndex : me.options.description,
									width : 410,
									hideable : false,
									sortable: false,
									draggable: false,
									lockable: false,
									resizable: false
								}],
								dockedItems : [{
//											xtype : 'pagingtoolbar',
//											store : myStore,
//											dock : 'bottom'
										}],
								renderTo : 'seekSelectionGrid'+fieldCounter
							});
							var gridSmartPager = Ext.create('Ext.ux.gcp.GCPPager', {
								store : myStore,
								baseCls : 'xn-paging-toolbar',
								dock : 'bottom',
								displayInfo : true,
								listeners: {beforechange : function(thisd, pageNum)
								{            
									myStore.getProxy().setExtraParam("$skip", pageNum);
								}
							}							});
							Ext.QuickTips.init();
							popupgrid.addDocked(gridSmartPager);
							myStore.on('load', function(store, records) {
								
								$.each(records, function(index, record) 
								{
									if ( (!Ext.isEmpty(record.get(me.options.code)) && !Ext.isEmpty(selectionArr) &&
											Ext.Array.contains(selectionArr,record.get(me.options.code))))
									 {
										for (var j = 0; j < selectionArr.length; j++) 
											{
											  index = popupgrid.store.findExact(me.options.code, selectionArr[j]);
											  popupgrid.getSelectionModel().select(index,true);
											}
									 }
								});
								jsonData = myStore.proxy.reader.rawData;
							});
							
							$('#seekSelectionCriteria' + fieldCounter).unbind();
							$('#seekSelectionCriteria' + fieldCounter).bind("keyup",function(event){
							//$('#seekSelectionCriteria' + fieldCounter).keyup( function() {
											myStore.clearFilter(true);
											myStore.getProxy().setExtraParam("$filterVal", $(this).val());
											if($(this).val().length >=3 || $(this).val().length ==0){
												myStore.currentPage =1;
												gridSmartPager.doRefresh(1);
											}
											$(this).focus();
									});
						} else {
							popupgrid.store.reload();
						}
					}
	});

	}
function closeSeekSlectionPopup() {
	$('#seekSelectionPopup'+fieldCounter).dialog('close');
	$('#messageContentDiv'+fieldCounter).appendTo($('#messageContentHeaderDiv'+fieldCounter));
}
function doClearMessageSection() {
	$('#messageArea').empty();
	$('#successMessageArea, #messageArea, #messageContentDiv')
			.addClass('hidden');
}
function appendDepFieldsJSON(index)
{
	var arrJson = [];
	for (i = 0; i < index; i++) 
	{
		var ipName= "processParameterBean"+i+".parameterName";
		var ipValue= "processParameterBean"+i+".value";
		if(document.getElementById(ipName) != null 
				&& document.getElementById(ipValue) != null)
		{
			var ipNameVal = document.getElementById(ipName).value;
			var ipValueVal = document.getElementById(ipValue).value;
			
			arrJson.push({
				parameterName : ipNameVal,
				value : ipValueVal
				});
		}
	}
	return arrJson.length > 0 ? JSON.stringify(arrJson) : null ;
}