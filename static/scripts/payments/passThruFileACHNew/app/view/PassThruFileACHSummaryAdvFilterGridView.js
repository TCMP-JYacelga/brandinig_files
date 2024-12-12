Ext.define( 'GCP.view.PassThruFileACHSummaryAdvFilterGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'passThruFileACHSummaryAdvFilterGridViewType',
	// minHeight:100,
	//width : 468,
	height : 250,
	autoHeight : true,
	autoScroll : true,
	overflowY : 'hidden',
	// overflowX :'hidden',
	callerParent : null,
	cls : 'xn-grid-cell-inner',
	listeners :
	{
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
				var parent = this;
				if(className=='grid-row-action-icon icon-edit'){
						this.fireEvent('editGridFilterEvent',view,rowIndex);
				}else if(className=='linkbox seeklink'){
						this.fireEvent('viewGridFilterEvent',view,rowIndex);
				}				
				else if(className=='grid-row-delete-icon'){
				     this.fireEvent('deleteGridFilterEvent',view,rowIndex);
				}
				
			}	
			var upDownIconLinkClicked = (e.target.tagName == 'I');	
			console.log("upDownIconLinkClicked >> " + upDownIconLinkClicked);
			    if(upDownIconLinkClicked){
				var className = e.target.className;
				console.log("className >> " + className);
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
		var screenName = '';
		if(screenType == 'ACH')
		{
			screenName = 'passThruFileACH' ;
		}
		else
		{
			screenName = 'passThruPositivePay' ;
		}
		if( me.callerParent == 'passThruFileACHViewType' )
		{
			strUrl = 'userfilterslist/{0}.srvc?';
			strUrl = Ext.String.format( strUrl,screenName);
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
				width : 50

			},
			{
				xtype : 'actioncolumn',
				width : 90,
				align : 'center',
				header:getLabel('deleteFilter', 'Delete Filter'),
		            	parent:this,
						  renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						         return '<a class="grid-row-delete-icon" href="#" title="Delete"></a>';
							  }

			},
			{
				header : getLabel( 'filterName', 'Filter Name' ),
				dataIndex : 'filterName',
				width : 120
			},
			{
				xtype : 'actioncolumn',
				width : 100,
				align : 'center',
				tdCls : 'xn-grid-cell-padding ',
				parent : this,
				 renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						         return '<a class="linkbox seeklink" href="#" title="view"></a>'+' '+'<a class="grid-row-action-icon icon-edit" href="#" title="Edit"></a>';
							  }	

			},

			{
				xtype : 'actioncolumn',
				width : 65,
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
			method : 'GET',
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
	}
} );
