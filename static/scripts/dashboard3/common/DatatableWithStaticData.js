var DatatableWithStaticData = {};



DatatableWithStaticData.DatatableWidgetUtils = {
		defaultConfig : {
		  "sDom": '<"top"i><"sorting-label">lt<"bottom"pf>',	
		  'searching'      : false,
		  'paging'         : false,
		  'fixedHeader'    : true,
		  'info'           : false,
		  'scrollY'        : '37vh',	  
		  'scrollX'        : true,
		  'scrollCollapse' : true,
		  'scroller'       : true,
		  "order"          : [],
		  "language": {
			  "emptyTable": "No data to display"
		  }
		}
	}

DatatableWithStaticData.createStaticDatatable = function(target, dtName, columnList, resData)
{
	let _this = this;
	let table = document.createElement('table');
	table.className = 'display nowrap table table-hover table-striped';
	table.id = 'datatable_'+dtName;
	table.setAttribute('cellspacing','0');
	table.setAttribute('width','100%');
	$('#'+target).html( table );
	
	let config = _this.DatatableWidgetUtils.defaultConfig;
	config.data = $.type(resData) == 'array' ? resData : [];
	config.columns = _this.getDataColumn(columnList);
	_this.datatable = $('#datatable_'+dtName).dataTable( config );
}

DatatableWithStaticData.getDataColumn = function(columnList){
	let columns = [];
	let edit = false;
	$.each(columnList, function(index,data) {
		edit = false;
		if(data && data.editable && data.editable == true)
			edit = true;
		columns.push({
			"title"     : data.label, 
			"data"      : data.fieldName,
			"type"      : DATATABLECOLTYPE[data.type],
			"orderable" : data.orderable != undefined ? data.orderable : true,				
			"render"    : data.render,
			"className" : data.type == 'amount' ? edit ? "text-right editable amountBox" : "text-right" : edit ? " editable" : ""
		});
	});
	return columns;
}
