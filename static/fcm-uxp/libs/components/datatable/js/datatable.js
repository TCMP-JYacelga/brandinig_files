class DataTable
{
	constructor(_oMetadata)
	{
		this._oMetadata = _oMetadata;
		this.init();
	}
	
	init(){
		$('#'+this._oMetadata.target).html( '<table id="datatable_'+this._oMetadata.widgetId+'" class="display dt-responsive nowrap table table-hover table-striped" cellspacing="0" width="100%"></table>' );	  
		let config = this.getDefaultConfig();
			config.data = this._oMetadata.data;
			config.columns = this.getColumns();
			 
		$('#datatable_'+this._oMetadata.widgetId).dataTable( config );
		$.fn.dataTable.ext.errMode = 'none';
	}
	
	getDefaultConfig(){		
		let defaultConfig = {
		  "searching": false,
		  "paging": false,
		  "ordering": false,
		  "fixedHeader": true,
		  "info": false,
		  "scrollY": 200,
          "scrollCollapse": true,
          "scroller": true
		};
		return defaultConfig;
	}
	
	getColumns(){
		let columns = [];
		$.each(this._oMetadata.fields.columns, function(index,data) {
			let column = {
							"title"  : data.label, 
							"data"   : data.fieldName, 
							"render" : data.render
						 };
		   columns.push(column);
		});
		return columns;
	}
}