/**
 * @class MigEntityGridView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */

Ext.define( 'GCP.view.MigEntityGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'migEntityGridView',
	id : 'migEntityGridViewId',
	width : 900,
	height : 500,
	autoScroll : true,
	overflowY : 'hidden',
	callerParent : null,
	strFilterClient : null,
	strFilterClientId : null,
	cls : 'xn-grid-cell-inner',
	
	initComponent : function()
	{
		var me = this;
		var strUrl = 'migrationBrandingPackageList.srvc?';
		var myStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'brandingPackage',
				'servicesGCP',
				'servicesCP'
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
				header : getLabel( 'radioButton', '' ),
				dataIndex : 'radioButton',
				width : 30,
				titlePosition: 0,
				renderer: function(value) {
					//var selModel = me.getSelectionModel();
					//var records = selModel.getSelection();
					//var val_rec = records[ 0 ].get('brandingPackage');
					//alert(val_rec);
					return "<input onclick= 'setSelectedSVCName();' type='radio' name = 'svcPackageNames' " + (value ? "checked='checked'" : "") + ">";
                },
				align: 'center'
			},
			{
				header : getLabel( 'brandingPackage', 'Service Package Name' ),
				dataIndex : 'brandingPackage',
				width : 230
			},
			{
				header : getLabel( 'servicesGCP', 'Services From CP' ),
				dataIndex : 'servicesGCP',
				width : 240
			},
			{
				header : getLabel( 'servicesCP', 'Services From GCP' ),
				dataIndex : 'servicesCP',
				width : 240
			}
		];
		
		this.buttons = [{
						text : getLabel('btnCancel', 'Cancel'),
						handler : function() {
							me.destroy();
							var elemPopup = Ext.getCmp( 'entityListPopupId' );
							elemPopup.close();
						}
		    },
			           {
						text : getLabel('btnSubmit', 'Submit'),
						handler : function() {
							var radios = document.getElementsByName('svcPackageNames'); 
							var selRecIndex = -1;
							for(var i=0; i<radios.length; i++) 
							{
								if(radios[i].checked){
									selRecIndex = i;
									break;
								}
							}
							if(selRecIndex >= 0){
								var strStore = me.getStore();
								var strModel = strStore.getAt(selRecIndex);
								var val_rec = strModel.get('brandingPackage');
								var contPosition = val_rec.lastIndexOf('(');
								if(contPosition > 0)
									val_rec = val_rec.substring(0,contPosition).trim();
								var strUrl = "updateServicePackageName.srvc?";
								Ext.Ajax.request(
								{
									url : strUrl+csrfTokenName+"="+csrfTokenValue+"&$clientName="+me.strFilterClientId+"&$brandingPackage="+val_rec,
									method : 'GET',
									success : function( response )
									{
										var mainSummGrid = Ext.getCmp( 'gridViewMstId' );
										mainSummGrid.refreshData();								
										me.destroy();
										var elemPopup = Ext.getCmp( 'entityListPopupId' );
										elemPopup.close();
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
							}
						}
		}
		
		];
		
		this.callParent( arguments );
	}
} );
