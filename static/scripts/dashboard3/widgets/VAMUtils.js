/** FOR NBC DEMO PURPOSE */
var VAMUtils = {};

VAMUtils.getInvoiceStatuFilterOptions = function() {
	return [
	  	  {
			"code": "OUTSTDNG",
			"label":  getDashLabel('outstandingInvoices.OUTSTDNG')
		  },				
		  {
			"code": "OVERDUE",
			"label":  getDashLabel('outstandingInvoices.OVERDUE')
		  },
		  {
				"code": "PAID",
				"label": getDashLabel('outstandingInvoices.PAID')
		  },
		  {
			"code": "PARTPAID",
			"label":  getDashLabel('outstandingInvoices.PARTPAID'),
		  }/*,
		  {
			"code": "UNRCGNZD",
			"label": getDashLabel('outstandingInvoices.UNRCGNZD')
		  },
		  {
			"code": "PNDAPRVL",
			"label": getDashLabel('outstandingInvoices.PNDAPRVL')
		  },
		  {
			"code": "DRAFT",
			"label": getDashLabel('outstandingInvoices.DRAFT')
		  }	*/	  
	];
}

VAMUtils.getFilterOptions = function(urlString) {
	
	let companyList = [];
		$.ajax({
		type : 'POST',
		async : false,
		url : urlString,
		data     : "",
		datatype : "json"
	  }).done(function(res, textStatus, jqXHR) { 
			if(res && res.dataList)
			{
				res.dataList.forEach(function(element)
				{	
					let jsonData = {};
					jsonData.code  = element.seekCode;
					jsonData.label = element.seekDesc + ' | '+ element.seekCode;
					companyList.push(jsonData);
				})

			}
		}).fail (function(jqXHR, textStatus, errorThrown) { 
			
		});	
	return companyList;
}

VAMUtils.getDateFilterOptions = function() {
	return [
	  	  {
			"code": "yesterday",
			"label": getDashLabel("vam.yesterday")
		  },
	  	  {
			"code": "week",
			"label": getDashLabel("vam.lastWeekToDate")
		  },
	  	  {
			"code": "month",
			"label": getDashLabel("vam.lastMonthToDate")
		  },
	  	  {
			"code": "quarter",
			"label": getDashLabel("vam.lastQuarterToDate")
		  }
	];
}

VAMUtils.getFromDate = function(value) {
	var date = new Date();
	if (value === "yesterday") {
		date.setDate(date.getDate() - 2);
	} else if (value === "week") {
		date.setDate(date.getDate() - 7);
	} else if (value === "month") {
		date.setDate(date.getDate() - 30);
	} else if (value === "quarter") {
		date.setDate(date.getDate() - 90);
	}
	return date;
}

var vamCompanyCode = "";
var vamCompanyName = "All Companies";
var companyData = [
	{
		"companyCode": "BOMBARDIER", 
		"companyName": "Bombardier"
	},
	{
		"companyCode": "BOMBARDAV", 
		"companyName": "Bombardier Aviation"
	},
	{
		"companyCode": "BOMSERV", 
		"companyName": "Bombardier Service Corporation"
	},
	{
		"companyCode": "BOMTRAN", 
		"companyName": "Bombardier Transportation"
	}
];

VAMUtils.getCompanyName = function(companyCode) {
	var result = companyCode;
	$(companyData).each(function(index, company) {
		if (company.companyCode === companyCode) {
			result = company.companyName;
		} 
	});
	if (result === '') {
		return "All Companies";
	}
	return result;
}

VAMUtils.companyFilter = function(addData, metaData, widgetName, widgetType) {
	var filterCompanyList = '<select class="widget-custom-filter w-auto text-secondary" style="border: 0px; font-weight: bolder;" id="companyFilter_'+widgetName+'">';
	filterCompanyList += '<option value="">All Companies</option>';
	$(companyData).each(function(index, company) {
		filterCompanyList += '<option value="'+company.companyCode+'">'+company.companyName+'</option>';
	});
				 
	filterCompanyList += '</select>';
	
	$('#companyFilter_' + widgetName).remove(); 
	$('#actionbtn_refresh_' + widgetName).before(filterCompanyList);
	
	if(usrDashboardPref.widgets[widgetName] && usrDashboardPref.widgets[widgetName].defaultCompany) {
	   vamCompanyCode = usrDashboardPref.widgets[widgetName].defaultCompanyCode;
	}
	$('#companyFilter_'+widgetName).val(vamCompanyCode)
	$('#companyFilter_'+widgetName).unbind('change');
	$('#companyFilter_'+widgetName).change(function() {
		vamCompanyCode = $(this).val();
		vamCompanyName = $(this).text();
		
		if(!usrDashboardPref.widgets){
		   usrDashboardPref.widgets = {};
		}					
		usrDashboardPref.widgets[widgetName] = {
			"defaultCompanyCode" : vamCompanyCode
		}
		updateDashboardPref();
		
		$.publish('com.finastra.widget.filter.companyFilter', vamCompanyCode);
		widgetMap[widgetName].actions.refresh.callbacks.init(addData, metaData);
	});
}
VAMUtils.getDefaultFormatDate = function(dateValue) {
	//Converts to dd/mm/yyyy format
	return String(dateValue.getDate()).padStart(2, '0') + "/"  + String((dateValue.getMonth() + 1)).padStart(2, '0')   + "/" + dateValue.getFullYear();
}

VAMUtils.getISODate = function(dateValue) {
	//Converts to yyyy-mm-dd format
	if(dateValue == null || dateValue == undefined)
	{
		return;
	}
	var year = dateValue.slice(6,10);
	var month = dateValue.slice(3,5);
	var day = dateValue.slice(0,2);
	return year + '-' + month + "-" + day;
}