/**
 * @class LoanCenterAdvFilterGridView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define( 'GCP.view.LoanCenterAdvFilterGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'loanCenterAdvFilterGridViewType',
	maxHeight:400,
	width : '100%',
	callerParent : null,
	cls : 'xn-grid-cell-inner ux_window-position',

	listeners: {
		cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
		var linkClicked = (e.target.tagName == 'SPAN');
						if (linkClicked) {
							var filterCode = record.data.filterName;
							var className = e.target.className;
							if (!Ext.isEmpty(className)	&& className.indexOf('filterSearchLink') !== -1) {
								this.fireEvent('filterSearchEvent',filterCode);
							}
						}
		var IconLinkClicked = (e.target.tagName == 'A');	
           if(IconLinkClicked){
		        var className = e.target.className;
				if(className=='grid-row-action-icon icon-edit'){
				   this.fireEvent('editGridFilterEvent',view,rowIndex);
				}else if(className=='linkbox seeklink'){
				   this.fireEvent('viewGridFilterEvent',view,rowIndex);
				}else if(className=='fa fa-times'){
				     this.fireEvent('deleteGridFilterEvent',view,rowIndex);
				}else{
				 
				}
			}	
           var upDownIconLinkClicked = (e.target.tagName == 'I');	
			    if(upDownIconLinkClicked){
				var className = e.target.className;
				 if(className=='fa fa-caret-up'){
				   this.fireEvent('orderUpGridEvent',view,rowIndex,-1);
				}else if(className=='fa fa-caret-down'){
				   this.fireEvent('orderUpGridEvent',view,rowIndex,1);
				}else{
				}
			}
		}
	},
	
	initComponent : function()
	{
		var me = this;
		var strUrl = '';

		if( me.callerParent == 'loanCenterViewType' )
		{
			strUrl = isSiTabSelected == 'Y' ? 'userfilterslist/loanCenterSiAdvFltr.srvc?' : 'userfilterslist/loanCenterTxnAdvFltr.srvc?';
		}

		var myStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'filterName'
			],
			pageSize : 20,
			proxy :
			{
				type : 'ajax',
				reader :
				{
					type : 'json'
				}
			},
			loadRawData : function( data, append )
			{
				var objStore = me.store;
				result = objStore.proxy.reader.read( data ), records = result.records;
				if( result.success )
				{
					objStore.currentPage = objStore.currentPage === 0 ? 1 : objStore.currentPage;
					objStore.totalCount = result.total;
					objStore.loadRecords( records, append ? objStore.addRecordsOptions : undefined );
					objStore.fireEvent( 'load', objStore, records, true );
				}
			},
			autoLoad : false
		} );

		me.store = myStore;
		me.columns =
		[
			{
				xtype : 'rownumberer',
				text : '#',
				align : 'center',
				hideable : false,
				sortable : false,
				tdCls : 'xn-grid-cell-padding ',
				width : 40

			},
			{
				xtype : 'actioncolumn',
				width : 55,
				align : 'center',
				parent : this,
				renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						         return '<a class="fa fa-times" href="#" title="Delete"></a>';
							  }
			},
			{
				header : getLabel( 'filterName', 'Filter Name' ),
				dataIndex : 'filterName',
				width : 175
				//width : 120
			},
			{
				xtype : 'actioncolumn',
				width : 90,
				align : 'center',
				tdCls : 'xn-grid-cell-padding ',
				parent : this,
				renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						         return '<a class="linkbox seeklink" href="#" title="view"></a>'+' '+'<a class="grid-row-action-icon icon-edit" href="#" title="Edit"></a>';
							  }
			},

			{
				xtype : 'actioncolumn',
				width : 60,
				align : 'center',
				header : getLabel( 'order', 'Order' ),
				parent : this,
				renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						         return '<a  href="#" title="Down"><i class="fa fa-caret-down"></i></a>'+' '+'<a href="#" Title="Up"><i class="fa fa-caret-up"/></i></a>';
							  }
			}
		];

		Ext.Ajax.request(
		{
			url : strUrl,
			headers: objHdrCsrfParams,
			method : 'GET',
			params :
			{
				csrfTokenName : tokenValue
			},
			success : function( response )
			{
				var decodedJson = Ext.decode( response.responseText );
				var arrJson = new Array();
				if( !Ext.isEmpty( decodedJson.d.filters ) )
				{
					for( i = 0 ; i < decodedJson.d.filters.length ; i++ )
					{
						arrJson.push(
						{
							"filterName" : decodedJson.d.filters[ i ]
						} );
					}
				}
				me.store.loadRawData( arrJson );
				me.setLoading( false );
			},
			failure : function()
			{
				me.setLoading( false );
				Ext.MessageBox.show(
				{
					title : getLabel( 'errorPopUpTitle', 'Error' ),
					msg : getLabel( 'errorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );

		this.callParent( arguments );
	},
	loadRawData : function(data, append) {
		var me=this;
		var objStore = me.store;
		result = objStore.proxy.reader.read(data), records = result.records;
		if (result.success) {
			objStore.currentPage = objStore.currentPage === 0
					? 1
					: objStore.currentPage;
			objStore.totalCount = result.total;
			objStore.loadRecords(records, append
							? objStore.addRecordsOptions
							: undefined);
			objStore.fireEvent('load', objStore, records, true);
		}
}

} );