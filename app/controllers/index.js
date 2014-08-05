//library
var login = require('userLogin');

//dummy
// Ti.App.Properties.setBool('keeplogin', true);
// Ti.App.Properties.setDouble('lastupdate', 99999999999999);

function clickLogin() {
	var authLogin = isAuthLogin();
	// Ti.API.info('auth login : ' + authLogin);
	// if (authLogin) {
	// openMainScreen();
	// } else {
	// alert('Please check Username and Password');
	// }
}

function isAuthLogin() {

	var loadingScreen = Alloy.createController('loading_screen');

	function createLoadingScreen() {
		Ti.API.info('create, loading screen');
		if (OS_ANDROID) {
			$.index.add(loadingScreen.getView());
		}
	}

	function removeLoadingScreen() {
		Ti.API.info('remove, loading screen');
		loadingScreen.stopLoading();

		$.index.remove(loadingScreen.getView());

	}

	var isValid = false;
	if ($.username.value !== "" && $.password.value !== "") {
		//send login validation to server
		var param = {
			username : $.username.value,
			password : $.password.value
		};
		createLoadingScreen();
		login.getDataLogin(param, function(isAuth) {
			if (isAuth) {
				if ($.switchRemember.value === true) {
					Ti.App.Properties.setBool('keeplogin', true);
				} else {
					Ti.App.Properties.setBool('keeplogin', false);
				}
				Ti.API.info('return true');

				removeLoadingScreen();
				openMainScreen();
			} else {
				Ti.API.info('return false');
				alert('Please check Username and Password');
			}
		});
	}
	return isValid;
}

if (Ti.App.Properties.getBool('keeplogin', false)) {
	openMainScreen();
} else {
	if (OS_IOS) {
		$.navBar.open();
	} else {
		$.index.open();
	}

}

function openMainScreen() {
	var login = Alloy.createController("authorityView").getView();
	login.open();
	if (OS_IOS) {
		$.navBar.close();
	} else {
		$.index.close();
	}
}
