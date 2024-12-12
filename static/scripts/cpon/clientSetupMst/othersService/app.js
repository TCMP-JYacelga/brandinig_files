var objOtherProfileSeek = null;


Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
		
Ext.Loader.setPath('GCP', 'static/scripts/cpon/common');

Ext.application({
			name : 'CPON',
			// appFolder : 'app',
			requires : ['GCP.view.copyOtherProfileSeek'],
			launch : function() {
				objOtherProfileSeek = Ext.create('GCP.view.copyOtherProfileSeek',
						{
							itemId : 'OtherProfileSeek',
							title : getLabel('copyOtherprofile', 'Copy Other Profile'),
							columnName : getLabel('Otherfeatureprfname', 'Other Profile Name'),
							actionUrl : 'doCopyOtherProfile.form'
						});
			}
		});

function showOthersProfileSeek() {
	if (null != objOtherProfileSeek) {
		objOtherProfileSeek.show();
	}
}
