widgetMetaData.payableWidget = function(widgetId, widgetType)
{
	let metadata = {
	          'title': getDashLabel('payableStatic.title'),
	          'desc': getDashLabel('payableStatic.desc'),
			  'type': 'card',
			  "widgetType" : widgetType,
			  "cloneMaxCount": 4,
			  'subType': '',  
			  'icon':'<span class="material-icons"> account_balance </span>',
			  'fields': {
				'columns': [],
				'rows':{}	
			  },
			  'actions' : {
				  'custom' : {
					  'title' : getDashLabel('setting'),
					  'callbacks' : {
						  'click' : function(metaData){
						  }
					  }
				  },
				  'refresh' : {
					  'callbacks' : {
						  'init' : function(addData, metaData){
							  $('#widget-body-'+widgetId).html(	'<table id="fsdw_grid_PaymentGrid_expand" class="display table mat-table dataTable no-footer" width="100%" role="grid"></table>'
								+ '<table id="fsdw_grid_PaymentGrid" class="table mat-table dataTable no-footer" style="width: 100%;" role="grid">' 
								+ '	<thead>' 
								+ '		<tr class="mat-header-row" role="row">' 
								+ '			<th class="mat-header-cell">'+getDashLabel('payableStatic.receiver')+'</th>' 
								+ '			<th class="mat-header-cell">'+getDashLabel('payableStatic.amount')+'</th>' 
								+ '			<th class="mat-header-cell">'+getDashLabel('payableStatic.date')+'</th>'  
								+ '		</tr>' 
								+ '	</thead>' 
								+ '	<tbody>' 
								+ '		<tr role="row" class="even uxg-highlight payment-popover">' 
								+ '			<td>Milton</td><td> 67,800</td><td>1/31/2020</td>' 
								+ '		</tr>								' 
								+ '		<tr role="row" class="odd">' 
								+ '			<td>Samsung</td><td> 2,462,656</td><td>2/4/2020</td>' 
								+ '		</tr>' 
								+ '		<tr role="row" class="odd">' 
								+ '			<td>ONGC</td><td> 6,844,872</td><td>2/4/2020</td>' 
								+ '		</tr>' 
								+ '		<tr role="row" class="even">' 
								+ '			<td>TVS</td><td> 5,310,531</td><td>2/4/2020</td>' 
								+ '		</tr>' 
								+ '		<tr role="row" class="even">' 
								+ '			<td>Britania</td><td> 1,110,421</td><td>2/5/2020</td>' 
								+ '		</tr>' 
								+ '	</tbody>' 
								+ '</table>' 
							  );
						  }
					  }
				  }
			  }
	}
	return metadata;
}

