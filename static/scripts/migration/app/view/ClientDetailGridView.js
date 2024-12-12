/**
 * @class ClientDetailGridView
 * @extends Ext.panel.Panel
 * @author CHPL
 */

Ext.define( 'GCP.view.ClientDetailGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'clientDetailGridView',
	width : 350,
	height : 250,
	autoScroll : true,
	overflowY : 'hidden',
	// overflowX :'hidden',
	callerParent : null,
	cls : 'xn-grid-cell-inner',

	initComponent : function()
	{
		var me = this;
		var strUrl = 'getMigrationClientDetails.srvc?';
		var myStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'detailName',
				'detailValue'
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
				width : 30

			},
			{
				header : getLabel( 'filterName1', 'Label' ),
				dataIndex : 'detailName',
				width : 100
			},
			{
				header : getLabel( 'filterName1', 'Value' ),
				dataIndex : 'detailValue',
				width : 200
			}
		];

		Ext.Ajax.request(
		{
			url : strUrl+csrfTokenName+"="+csrfTokenValue,
			method : 'GET',
			success : function( response )
			{
				
				var decodedJson = Ext.decode( response.responseText );
				var arrJson = new Array();
				for( i = 0 ; i < decodedJson.length ; i+=2 )
				{
					arrJson.push(
					{
						"detailName" : decodedJson[ i ],
						"detailValue" : decodedJson[ i+1 ]
					} );
				}
				me.store.loadRawData( arrJson );
				me.setLoading( false );
			},
			failure : function()
			{
				me.setLoading( false );
				Ext.MessageBox.show(
				{
					title : getLabel( 'errorTitle', 'Error' ),
					msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );

		this.callParent( arguments );
	}

} );
