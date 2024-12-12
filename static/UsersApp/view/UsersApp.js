/*global Sammy, jQuery, UsersApp */
(function (window, $) {
	'use strict';
	var TT4Plugin = function (app) {
		this.helpers({
			getViewName : function () {
				var tags = window.location.hash.replace(/^#/, '').split('#');
				var viewName = "static/UsersApp/templates/" + tags[0].substr(1) + ".hbs";
				if ("static/UsersApp/templates/RoleEntry.hbs" === viewName) {
					viewName = "static/UsersApp/templates/Admin.hbs";
				}
				return viewName;
			}
		});
	};
	window.UsersApp = Sammy('#ft-layout-container').use('Handlebars', 'hbs').use(TT4Plugin);
	
	// TODO : FOLOWWIG OBJECTS NEED TO CONVERT INTO SAMMY SESSION OBJECTS
	window.userCommand = [];
	window.uiCommand = [];
	window.userWorkingData = [];
	window.workingData = [];
	window.originalData = [];
	window.amountFormat = {};
	window.strUserDateFormat = "";
	window.mode = "new";
	window.commandVersion = 0;
	window.prevMode = "";
	window.prevDefaultSub = "";
	window.prevDefaultSubName = "";
	window.grBRColumnMap = { "TRS" : "0","IRD" : "1","PRV" : "2","INTRAACT" : "3","PREVACT" : "4","PREVVCIMG" : "5",
							 "VCIMG" : "6","F_SRV_BR_PRV_CP" : "7,8,9" };
	
	window.grLoanColumnMap = { "AST-207" : {"view" : "0"}, "LNI-552" :{"view" : "1","edit":"2","auth":"3"},
							 "LDO-625" :{"view" : "4","edit":"5","auth":"6"},"RPY-626" :{"view" : "7","edit":"8","auth":"9"},
							 "FLON_000001-292" :{"view" : "10","edit":"11","auth":"12"},"LOANS-390" :{"edit":"13"},"LOANS-391" :{"edit":"14"}							 
							};
	window.grCheckColumnMap = { "CHKINQ-404" : {"view" : "0","edit":"1"}, "CHKPAIDIMG-403" :{"view" : "2"},
								 "CHKCSTP-402" :{"view" : "3","edit":"4","auth":"5"},"CHKSTP-401" :{"view" : "6","edit":"7","auth":"8"}
							};

	window.grPPColumnMap = { "ISSNC-106" : {"view" : "0","edit":"1","auth":"2"}, "EXDE-951" :{"view" : "3","edit":"4","auth":"5"},
								 "PPPT-217" :{"view" : "6","edit":"7","auth":"8"},"IMPC-805" :{"view" : "9"}
							};
	

	window.grPaymentColumnMap = { "PYB-41" : {"view" : "0","edit":"1","auth":"4"}, "PYB-381" :{"edit":"2"},"PYB-364" :{"edit":"3"},"PYB-363" :{"auth":"5"},
								  "PYB-380" :{"edit":"6"},"STPP-46" :{"edit":"7","auth":"8"}
								};
	
	window.grSIColumnMap = { "SIS-15" : {"view" : "0","edit":"1","auth":"4"}, "SIS-383" :{"edit":"2"},"SIS-386" :{"auth":"3"}};
	
	window.grReversalColumnMap = { "RVAL-689" :{"view" : "0","edit":"1","auth":"2"} };
	
	window.grTemplateColumnMap = { "TPL-976" : {"view" : "3,9,15","edit":"4,10,16","auth":"6,12,19"}, "TPL-382" :{"view" : "3,9,15","edit":"4,10,16,5,11,17"},"PYB-380" :{"edit" : "8,14,18"},
								   "TPL-384" :{"view" : "3,9,15","auth":"6,12,19,7,13,20"}
								};
	if (!Array.prototype.findIndex) {
		  Object.defineProperty(Array.prototype, 'findIndex', {
		    value: function(predicate) {
		      'use strict';
		      if (this == null) {
		        throw new TypeError('Array.prototype.findIndex called on null or undefined');
		      }
		      if (typeof predicate !== 'function') {
		        throw new TypeError('predicate must be a function');
		      }
		      var list = Object(this);
		      var length = list.length >>> 0;
		      var thisArg = arguments[1];
		      var value;

		      for (var i = 0; i < length; i++) {
		        value = list[i];
		        if (predicate.call(thisArg, value, i, list)) {
		          return i;
		        }
		      }
		      return -1;
		    },
		    enumerable: false,
		    configurable: false,
		    writable: false
		  });
		}
	
	
		if (!String.prototype.endsWith) {
			  String.prototype.endsWith = function(searchString, position) {
			      var subjectString = this.toString();
			      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
			        position = subjectString.length;
			      }
			      position -= searchString.length;
			      var lastIndex = subjectString.lastIndexOf(searchString, position);
			      return lastIndex !== -1 && lastIndex === position;
			  };
			}
	
		if (!String.prototype.startsWith) {
		    String.prototype.startsWith = function(searchString, position){
		      position = position || 0;
		      return this.substr(position, searchString.length) === searchString;
		  };
		}
	
	/* ******  Start of Handlers ****** */
		Handlebars.registerHelper("templateGranularHeader", function (granularPermission, options) {
			var operation,mask,operationFlag;
			var thead;
			var repOpr = [],
			semRepOpr = [],
			nonRepOpr = [];
			var isApplRep = false,
			isApplNoneRep = false,
			isApplSemiRep = false;
			var finalData = [];
			var semRepFlag = false, nonRepFlag = false, repFlag = false;
			$.each(workingData.assets,function(index,item){
				if(item.assetId == "02"){
					if(item.allowedFeatures){
						$.each(item.allowedFeatures,function(index,feature){
							if(feature.featureId == "semiRepetitiveFlag"){
								semRepFlag = feature.assignedFlag;
							}
							
							if(feature.featureId == "repetitiveFlag"){
								repFlag = feature.assignedFlag;
							}
							
							if(feature.featureId == "nonRepetitiveFlag"){
								nonRepFlag = feature.assignedFlag;
							}
						})
					}
				}
			});
			
			
			if (null != granularPermission && (null != granularPermission.templates && granularPermission.templates[0])) {
				mask = granularPermission.templates[0].mask;

				operation = granularPermission.templateOperations.split("||");
				operationFlag = granularPermission.templateOperationsFlags.split("||");			
				var len = operation.length;
				var returnData = [];
				for (var i = 0; i < len; i++) {
					operation[i] = {
						'colName' : operation[i],
						'flag' : operationFlag[i]
					};
				}
				for (var j = 3; j <= 8; j++) {
					repOpr.push(operation[j]);
				}
				
				for (var j = 9; j <= 14; j++) {
					semRepOpr.push(operation[j]);
				}

				
				for (var j = 15; j <= 20; j++) {
					nonRepOpr.push(operation[j]);
				}
				
				operation.splice(0, 3); // remove first 3 flags
				thead = document.createElement('THEAD');			
				// Account Package Header Row
				if (mask.length > 4) {
					var tr = document.createElement('TR');
					tr.setAttribute('class','view-grid-header');
					
					var th = document.createElement('TH')
					th.setAttribute('class','view-grid-header-text');
					th.style.width = '20%';
					th.setAttribute('colspan','3');
					th.innerHTML  = 'Account Packages';
					tr.appendChild(th);
						
					var th = document.createElement('TH');
					th.id = 'repHdr';
					th.setAttribute('data-templateType','rep');
					th.setAttribute('class','view-grid-header-text hidden');
					th.setAttribute('colspan','6');
					th.style.width = '20%';
					th.innerHTML = 'Repetitive Template';
					tr.appendChild(th);
					
					
					var th = document.createElement('TH');
					th.id = 'semRepHdr';
					th.setAttribute('data-templateType','semiRep');
					th.setAttribute('class','view-grid-header-text hidden');
					th.style.width = '20%';
					th.setAttribute('colspan','6');
					th.innerHTML  = 'Semi-Repetitive Template';
					tr.appendChild(th);
					
					var th = document.createElement('TH');
					th.id = 'nonRepHdr';
					th.setAttribute('data-templateType','nonRep');
					th.setAttribute('class','view-grid-header-text hidden');
					th.style.width = '20%';
					th.setAttribute('colspan','6');
					th.innerHTML  = 'Non-Repetitive Template';
					tr.appendChild(th);
						
					thead.appendChild(tr);
				}

				//Type Row			
				var trTypeRow = document.createElement('TR');
				trTypeRow.setAttribute('class','view-grid-header');

				
				var th = document.createElement('TH')
				th.setAttribute('class','view-grid-header-text');
				th.style.width = '20%';
				th.setAttribute('colspan','3');
				th.innerHTML  = 'Type';
				trTypeRow.appendChild(th);	
				
				for (var j = 0; j < repOpr.length; j++) {
					var th = document.createElement('TH');
					th.id = 'hdrType_' + (j+3);
					th.setAttribute('data-templateType','rep');
					th.setAttribute('class','view-grid-header-text hidden');
					th.style.width = '20%';
					th.setAttribute('rowspan','2');
					th.innerHTML  = repOpr[j].colName;
					trTypeRow.appendChild(th);
				}
				
				
				for (var j = 0; j < semRepOpr.length; j++) {
					var th = document.createElement('TH');
					th.id = 'hdrType_' + (j+9);
					th.setAttribute('data-templateType','semiRep');
					th.setAttribute('class','view-grid-header-text hidden');
					th.style.width = '20%';
					th.setAttribute('rowspan','2');
					th.innerHTML  = semRepOpr[j].colName;
					trTypeRow.appendChild(th);
				}
					
				for (var j = 0; j < nonRepOpr.length; j++) {
					var th = document.createElement('TH');
					th.id = 'hdrType_' + (j+15);
					th.setAttribute('data-templateType','nonRep');
					th.setAttribute('class','view-grid-header-text hidden');
					th.style.width = '20%';
					th.setAttribute('rowspan','2');
					th.innerHTML  = nonRepOpr[j].colName;
					trTypeRow.appendChild(th);
				}
				
				thead.appendChild(trTypeRow);
				
				
				//Type Row
				var trAccRow = document.createElement('TR');
				trAccRow.setAttribute('class','view-grid-header');
				
				var th = document.createElement('TH');
				th.setAttribute('class','view-grid-header-text');
				th.style.width = '20%';
				th.innerHTML  = 'Account';
				trAccRow.appendChild(th);
				
				var th = document.createElement('TH');
				th.setAttribute('class','view-grid-header-text');
				th.style.width = '20%';
				th.innerHTML  = 'Account Name';
				trAccRow.appendChild(th);	
				
				var th = document.createElement('TH');
				th.setAttribute('class','view-grid-header-text');
				th.style.width = '20%';
				th.innerHTML  = 'Payment Package';
				trAccRow.appendChild(th);
					
				thead.appendChild(trAccRow);
			}	
				
			return new Handlebars.SafeString(thead.outerHTML);
		});
		Handlebars.registerHelper("templateGranularBody", function (granularPermission, options) {
			var tableBody = "";
			var operation,
			mask;
			var repOpr = [],
			semRepOpr = [],
			nonRepOpr = [];
			var isApplRep = false,
			isApplNoneRep = false,
			isApplSemiRep = false;
			var finalData = [];
			var semRepFlag = false, nonRepFlag = false, repFlag = false;
			$.each(workingData.assets,function(index,item){
				if(item.assetId == "02"){
					if(item.allowedFeatures){
						$.each(item.allowedFeatures,function(index,feature){
							if(feature.featureId == "semiRepetitiveFlag"){
								semRepFlag = feature.assignedFlag;
							}
							
							if(feature.featureId == "repetitiveFlag"){
								repFlag = feature.assignedFlag;
							}
							
							if(feature.featureId == "nonRepetitiveFlag"){
								nonRepFlag = feature.assignedFlag;
							}
						})
					}
				}
			});
			tableBody = document.createElement('TBODY');

			if (null != granularPermission) {
				if (null != granularPermission.templates) {

					for (var i = 0; i < granularPermission.templates.length; i++) {
						mask = granularPermission.templates[i].mask;

						var tr = document.createElement('TR');
						tr.setAttribute('class','view-grid-body');

						var td = document.createElement('TD');
						td.setAttribute('class','view-grid-header-text view-grid-body-content');
						td.style.width = '20%';
						td.innerHTML  = granularPermission.templates[i].accountNo;
						tr.appendChild(td);	
						
						td = document.createElement('TD');
						td.setAttribute('class','view-grid-header-text view-grid-body-content');
						td.style.width = '20%';
						td.innerHTML  = granularPermission.templates[i].accountName;
						tr.appendChild(td);
						
						td = document.createElement('TD');
						td.setAttribute('class','view-grid-header-text view-grid-body-content');
						td.style.width = '20%';
						td.innerHTML  = granularPermission.templates[i].packageName;
						tr.appendChild(td);
						
						for (var j = 3; j <= 8; j++) {
							//if (repFlag) {
								if(!workingData.isVerify && mode != "view"){
										
									var td = document.createElement('TD');
									td.setAttribute('data-templateType','rep');
									td.setAttribute('class','view-grid-body-content hidden');
									
									var anchor = document.createElement('a');
									anchor.setAttribute('class','limit-reached test');
									
									var img = document.createElement('img');
									img.id = 'chkTemplateGran_02_' + j + '_' + granularPermission.templates[i].accountId + '_' + granularPermission.templates[i].packageId;
									img.setAttribute('data-accountId',granularPermission.templates[i].accountId);
									img.setAttribute('data-accountName',granularPermission.templates[i].accountName);
									img.setAttribute('data-accountNo',granularPermission.templates[i].accountNo);
									img.setAttribute('data-gpermissionType',granularPermission.templates[i].gpermissionType);
									img.setAttribute('data-mask',granularPermission.templates[i].mask);
									img.setAttribute('data-assetId','02');
									img.setAttribute('data-packageId',granularPermission.templates[i].packageId);
									img.setAttribute('data-packageName',granularPermission.templates[i].packageName);
									img.setAttribute('data-obligatorId',granularPermission.templates[i].obligatorId);
									if(mask.charAt(j) === "1")
										img.src = 'static/images/icons/icon_checked.gif';
									else
										img.src = 'static/images/icons/icon_unchecked.gif';
									img.width = '16';
									img.height = '16';
									img.border = '0';
									
									anchor.appendChild(img);
									td.appendChild(anchor);
									tr.appendChild(td);
								}else{
									var td = document.createElement('TD');
									td.id = 'chkTemplateGran_02_' + j + '_' + granularPermission.templates[i].accountId + '_' + granularPermission.templates[i].packageId;
									td.setAttribute('class','view-grid-header-text view-grid-body-content hidden');
									td.style.width = '20%';
									
									if(mask.charAt(j) === "1"){
										var icon = document.createElement('i');
										icon.setAttribute('class','fa fa-check');
										td.appendChild(icon);	
										tr.appendChild(td);
									}else{
										tr.appendChild(td);
									}
									//tableBody += "<td class='view-grid-header-text view-grid-body-content' style='width:20%;'>";
									//tableBody += "<i class='fa fa-check'></i></td>";									
								}
							//}
						}
						
						for (var j = 9; j <= 14; j++) {
							//if (semRepFlag) {
								if(!workingData.isVerify && mode != "view"){
									
									var td = document.createElement('TD');
									td.setAttribute('data-templateType','semiRep');
									td.setAttribute('class','view-grid-body-content hidden');
									
									var anchor = document.createElement('a');
									anchor.setAttribute('class','limit-reached test');
									
									var img = document.createElement('img');
									img.id = 'chkTemplateGran_02_' + j + '_' + granularPermission.templates[i].accountId + '_' + granularPermission.templates[i].packageId;
									img.setAttribute('data-accountId',granularPermission.templates[i].accountId);
									img.setAttribute('data-accountName',granularPermission.templates[i].accountName);
									img.setAttribute('data-accountNo',granularPermission.templates[i].accountNo);
									img.setAttribute('data-gpermissionType',granularPermission.templates[i].gpermissionType);
									img.setAttribute('data-mask',granularPermission.templates[i].mask);
									img.setAttribute('data-assetId','02');
									img.setAttribute('data-packageId',granularPermission.templates[i].packageId);
									img.setAttribute('data-packageName',granularPermission.templates[i].packageName);
									img.setAttribute('data-obligatorId',granularPermission.templates[i].obligatorId);
									if(mask.charAt(j) === "1")
										img.src = 'static/images/icons/icon_checked.gif';
									else
										img.src = 'static/images/icons/icon_unchecked.gif';
									img.width = '16';
									img.height = '16';
									img.border = '0';
									
									anchor.appendChild(img);
									td.appendChild(anchor);
									tr.appendChild(td);
								}else{
									var td = document.createElement('TD');
									td.id = 'chkTemplateGran_02_' + j + '_' + granularPermission.templates[i].accountId + '_' + granularPermission.templates[i].packageId;
									td.setAttribute('class','view-grid-header-text view-grid-body-content hidden');
									td.style.width = '20%';
									
									if(mask.charAt(j) === "1"){
										var icon = document.createElement('i');
										icon.setAttribute('class','fa fa-check');
										td.appendChild(icon);	
										tr.appendChild(td);
									}else{
										tr.appendChild(td);
									}
									//tableBody += "<td class='view-grid-header-text view-grid-body-content' style='width:20%;'>";
									//tableBody += "<i class='fa fa-check'></i></td>";									
								}
							//}
						}
						
						for (var j = 15; j <= 20; j++) {
							//if (nonRepFlag) {
								if(!workingData.isVerify && mode != "view"){
									
									var td = document.createElement('TD');
									td.setAttribute('data-templateType','nonRep');
									td.setAttribute('class','view-grid-body-content hidden');
									
									var anchor = document.createElement('a');
									anchor.setAttribute('class','limit-reached test');
									
									var img = document.createElement('img');
									img.id = 'chkTemplateGran_02_' + j + '_' + granularPermission.templates[i].accountId + '_' + granularPermission.templates[i].packageId;
									img.setAttribute('data-accountId',granularPermission.templates[i].accountId);
									img.setAttribute('data-accountName',granularPermission.templates[i].accountName);
									img.setAttribute('data-accountNo',granularPermission.templates[i].accountNo);
									img.setAttribute('data-gpermissionType',granularPermission.templates[i].gpermissionType);
									img.setAttribute('data-mask',granularPermission.templates[i].mask);
									img.setAttribute('data-assetId','02');
									img.setAttribute('data-packageId',granularPermission.templates[i].packageId);
									img.setAttribute('data-packageName',granularPermission.templates[i].packageName);
									img.setAttribute('data-obligatorId',granularPermission.templates[i].obligatorId);
									if(mask.charAt(j) === "1")
										img.src = 'static/images/icons/icon_checked.gif';
									else
										img.src = 'static/images/icons/icon_unchecked.gif';
									img.width = '16';
									img.height = '16';
									img.border = '0';
									
									anchor.appendChild(img);
									td.appendChild(anchor);
									tr.appendChild(td);
								}else{
									var td = document.createElement('TD');
									td.id = 'chkTemplateGran_02_' + j + '_' + granularPermission.templates[i].accountId + '_' + granularPermission.templates[i].packageId;
									td.setAttribute('class','view-grid-header-text view-grid-body-content hidden');
									td.style.width = '20%';
									
									if(mask.charAt(j) === "1"){
										var icon = document.createElement('i');
										icon.setAttribute('class','fa fa-check');
										td.appendChild(icon);	
										tr.appendChild(td);
									}else{
										tr.appendChild(td);
									}
									//tableBody += "<td class='view-grid-header-text view-grid-body-content' style='width:20%;'>";
									//tableBody += "<i class='fa fa-check'></i></td>";									
								}
							//}
						}
						tableBody.appendChild(tr);
					}
				}
			}
			return new Handlebars.SafeString(tableBody.outerHTML);
		});
		
	Handlebars.registerHelper('selectAsset', function (a, b, block) {
		return a == b ? block.fn(this) : block.inverse(this);
	});
	Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
		switch (operator) {
		case '==':
			return (v1 == v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return (v1 === v2) ? options.fn(this) : options.inverse(this);
		case '!=' :
			return (v1 != v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return (v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return (v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return (v1 && v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return (v1 || v2) ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper("splitOperation", function (operation, options) {
		if (null != operation) {
			var operation = operation.split("||");
			var len = operation.length;
			var returnData = [];
			for (var i = 0; i < len; i++) {
				operation[i] = {
					'colName' : operation[i]
				};
			}
			return operation;
		}
	});

	Handlebars.registerHelper("splitMask", function (mask, options) {
		var returnData = [];
		for (var i = 0; i < mask.length; i++) {
			if (mask.charAt(i) === "1")
				returnData[i] = {
					'isAssign' : true
				}
			else
				returnData[i] = {
					'isAssign' : false
				}
		}
		return returnData;
	});

    Handlebars.registerHelper('option', function(value, label, selectedValue, version) {
		    var selectedProperty = true == selectedValue ? 'selected="selected"' : '';
		    if(!version){
		    	version = "";
		    }
		    
		    var optionStr = "<option id='chkSub_" + value + "'  value='" + value + "' " + selectedProperty  + "  data-version='" + version + "'>"+ label + "</option>";
		    return new Handlebars.SafeString(optionStr);
	});
    
    Handlebars.registerHelper('custProfileSelectOption', function(profileList, tempTypeCode, tempTypeDesc) {
    	var optionStr = "";
    	if(profileList){
	    	$.each(profileList,function(index,prof){ 
	    	    optionStr += "<option id='chkSub_" + prof.profileId + "'  value='" + prof.profileId + "' data-tempTypeDesc = '" + tempTypeDesc +  "'data-tempTypeCode='" + tempTypeCode + "'>"+ prof.profileDescription + "</option>";    		
	    	});
    	}
	    return new Handlebars.SafeString(optionStr);
	});
	/* ******  End of Handlers ****** */

	/* ******  Start of expression ****** */
	Handlebars.registerHelper("getListExpression", function (allowedFunction, property, options) {
		var list = "",spanList="",propertyName="";
		if (null != allowedFunction) {
			for (var j = 0; j < allowedFunction.length; j++) {
				if (null != allowedFunction[j][property] && allowedFunction[j][property] != "" ) {

					if (null != allowedFunction[j][options] && allowedFunction[j][options] != "" )
					{
						 if(options == 'serviceId')
							 propertyName = getModuleLabel(allowedFunction[j][options],allowedFunction[j][property]);
						 else
							 propertyName = allowedFunction[j][property];
					}
					else {
						if(property == 'featureName')
							propertyName=getLabel('lbl.role.features.'+allowedFunction[j]['featureId'],allowedFunction[j][property]);
						else if(property == 'widgetType')
							propertyName=getLabel('lbl.role.widget.'+allowedFunction[j]['widgetId'],allowedFunction[j][property]);
						else
							propertyName = allowedFunction[j][property];
					}
					if (mode == "viewChanges")
					{
						if (allowedFunction[j]['colorClass'] == 'B')
							spanList = "<span class='newField'>"+ propertyName+"</span>";
						else if (allowedFunction[j]['colorClass'] == 'R')
							spanList = "<span class='removedField'>"+ propertyName+"</span>";
						else if(allowedFunction[j]['assignedFlag'])
							spanList = "<span>"+ propertyName+"</span>";
						else
							spanList ="";
					}
					else if(allowedFunction[j]['assignedFlag'])
						spanList = "<span>"+ propertyName+"</span>";
					else
						spanList ="";
											
					if (spanList != "")	
						list += spanList + ", ";
					}
				}
			}
			if (list.endsWith(", ")) {
				list = list.substring(0, list.length - 2);
			}
		
		if (list == "") {
			list = "None Assigned";
		}
		
		return new Handlebars.SafeString(list);
	});
	
	Handlebars.registerHelper("getResourceListExpression", function (allowedFunction, property, prefix, options) {
		var list = "",spanList="";
		if (null != allowedFunction) {
			for (var j = 0; j < allowedFunction.length; j++) {
				if (null != allowedFunction[j][property] && allowedFunction[j][property] != "" ) {
					if (mode == "viewChanges")
					{
						//TODO
						if (allowedFunction[j]['colorClass'] == 'B')
							spanList = "<span class='newField'>"+ allowedFunction[j][property]+"</span>";
						else if (allowedFunction[j]['colorClass'] == 'R')
							spanList = "<span class='removedField'>"+ allowedFunction[j][property]+"</span>";
						else if(allowedFunction[j]['assignedFlag'])
							spanList = "<span>"+ allowedFunction[j][property]+"</span>";
						else
							spanList ="";
					}
					else if(allowedFunction[j]['assignedFlag'])
						spanList = "<span>" + allowedFunction[j][prefix] + "-" + allowedFunction[j][property]+ "</span>";
					else
						spanList ="";
											
					if (spanList != "")	
						list += spanList + ", ";
					}
				}
			}
			if (list.endsWith(", ")) {
				list = list.substring(0, list.length - 2);
			}
		
		if (list == "") {
			list = "None Assigned";
		}
		
		return new Handlebars.SafeString(list);
	});
	
	Handlebars.registerHelper("getResourceListExpressionAccounts", function (allowedFunction, property, prefix, options) {
		var list = "",spanList="";
		if (null != allowedFunction) {
			for (var j = 0; j < allowedFunction.length; j++) {
				if (null != allowedFunction[j][property] && allowedFunction[j][property] != "" ) {
					if (mode == "viewChanges")
					{
						//TODO
						if (allowedFunction[j]['colorClass'] == 'B')
							spanList = "<span class='newField'>"+ allowedFunction[j][property]+"</span>";
						else if (allowedFunction[j]['colorClass'] == 'R')
							spanList = "<span class='removedField'>"+ allowedFunction[j][property]+"</span>";
						else if(allowedFunction[j]['assignedFlag'])
							spanList = "<span>"+ allowedFunction[j][property]+"</span>";
						else
							spanList ="";
					}
					else if(allowedFunction[j]['assignedFlag'])
						spanList = "<span>" + allowedFunction[j][prefix] + "_" + allowedFunction[j][property]+ "</span>";
					else
						spanList ="";
											
					if (spanList != "")	
						list += spanList + ", ";
					}
				}
			}
			if (list.endsWith(", ")) {
				list = list.substring(0, list.length - 2);
			}
		
		if (list == "") {
			list = "None Assigned";
		}
		
		return new Handlebars.SafeString(list);
	});

	Handlebars.registerHelper("getStatusExpression", function (assignedFlag, options) {
		if (assignedFlag)
			return new Handlebars.SafeString(getLabel("lbl.role.assigned","Assigned"));

		else
			return new Handlebars.SafeString(getLabel("lbl.role.notassigned","Not Assigned"));
	});
	Handlebars.registerHelper("getReportDescLabel", function (key, defaultText) {
		return getReportDescLabel(key, defaultText);
	});
	
	Handlebars.registerHelper("checkBoxIcon", function (checkedFlag) {
		var iconPath = 'static/images/icons/icon_checked.gif';

		if (checkedFlag) {
			iconPath = 'static/images/icons/icon_checked.gif';
		} else {
			iconPath = 'static/images/icons/icon_unchecked.gif';
		}
		return new Handlebars.SafeString(iconPath);
	});
	
	Handlebars.registerHelper("getColoredExpression", function (colorClass, label) {
		var returnString="";
		if (mode == "viewChanges")
			{
				if (colorClass == 'B')
					returnString = "<span class='newField'>"+ label+"</span>";
				else if (colorClass == 'R')
					returnString = "<span class='removedField'>"+ label+"</span>";
				else
					returnString = "<span>"+ label+"</span>";
			}
			else
				returnString = "<span>"+ label+"</span>";
		returnString = getStringWithSpecialChars(returnString);		
		return new Handlebars.SafeString(returnString);
	});
	
	Handlebars.registerHelper("getColoredExpressionRow", function (colorClass, labelTxt, rmParentVal) {
		var returnString="";
		var label = getLabel(rmParentVal, labelTxt);
		
			if (mode == "viewChanges")
			{
				if (colorClass == 'B')
					returnString = "<span class='newField'>"+ label+"</span>";
				else if (colorClass == 'R')
					returnString = "<span class='removedField'>"+ label+"</span>";
				else
					returnString = "<span>"+ label+"</span>";
			}
			else
				returnString = "<span>"+ label+"</span>";
				
		return new Handlebars.SafeString(returnString);
	});
	
	Handlebars.registerHelper("getLabel", function (key, defaultText) {
		return (clientUserLabelsMap && clientUserLabelsMap[key]) ? clientUserLabelsMap[key]
			: defaultText
	});
	Handlebars.registerHelper("getLanguageMstLabel", function (key, defaultText) {
		return getLanguageMstLabel(key, defaultText);
	});
	Handlebars.registerHelper("getStringWithSpecialChars", function (key) {
		if(key != undefined )
		{
			return key.replace(/amp;/g, '')
	        .replace(/&lt;/g, '<')
	        .replace(/&gt;/g, '>')
	        .replace(/&quot;/g, '"')
	        .replace(/&apos;/g, "'")
	        .replace(/&#39;/g, "'")
			.replace(/&#039;/g, "'")
			.replace(/&#034;/g,'"')
			.replace(/&#34;/g,'"');
		}
		else
		return null ;	
	});
	Handlebars.registerHelper("getModLabel", function (key, defaultText) {
		return getModuleLabel(key, defaultText);
	});
	Handlebars.registerHelper("getStateMstLabel", function (key, defaultText) {
		return getStateMstLabel(key, defaultText);
	});
	Handlebars.registerHelper("getCountryMstLabel", function (key, defaultText) {
		return getCountryMstLabel(key, defaultText);
	});
	
	Handlebars.registerHelper("concat", function() {
		var arg = Array.prototype.slice.call(arguments,0);
		arg.pop();
		return arg.join('');
	});
	
	Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
	    lvalue = parseFloat(lvalue);
	    rvalue = parseFloat(rvalue);
	        
	    return {
	        "+": lvalue + rvalue,
	        "-": lvalue - rvalue,
	        "*": lvalue * rvalue,
	        "/": lvalue / rvalue,
	        "%": lvalue % rvalue
	    }[operator];
	});

	Handlebars.registerHelper("getMfaTriggerLabel", function (key, defaultText) {
		return getMfaTriggerLabel(key, defaultText);
	});
	
	/* ******  End of expression ****** */

	UsersApp.notFound = function () {
		this.runRoute('get', '#/');
	};
	$(function () {
		Sammy.Application.prototype.debug = true;
		Sammy.Application.prototype.disable_push_state = true;
		window.UsersApp.debug = true;
		console.log("UsersApp Started");
		UsersApp.run('#/');
	});

})(window, jQuery);
