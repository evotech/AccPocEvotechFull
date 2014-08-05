var args = arguments[0] || {};
//lib
var userLoginLib = require('userLogin');
//collection
var userMarexs = Alloy.createCollection('user_marex');

bindAuth();

function bindAuth(){
	userMarexs.fetch();
	var userMarex = Alloy.createModel('user_marex', null);
	
	var item = [];
	
	userMarexs.map(function(userMarex){
		item.push({
			template : 'tempAuth',
			lblAuth : {
				text : userMarex.get('CD_LEVEL')
			},
			properties :{
				cdlevel : userMarex.get('CD_LEVEL')
			}	
		});
	});
	
	$.listAuthority.sections[0].items = item;
}

function onAuthClick(e){
	
	Ti.API.info('auth, click', JSON.stringify(e));
	var section = $.listAuthority.sections[e.sectionIndex];
	var item = section.getItemAt(e.itemIndex);
	
	Ti.App.Properties.setString('cdlevel', item.properties.cdlevel);
	
	var winMain = Alloy.createController('main', item).getView();
	winMain.open();
	$.winAuthority.close();
}
