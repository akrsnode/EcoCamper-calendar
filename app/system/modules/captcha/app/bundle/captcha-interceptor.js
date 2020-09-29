var Captcha =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	const config = window.$captcha;
	let requestResolve, requestReject;
	
	if (config.grecaptcha) {
	
	    Vue.asset({
	        js: ['https://www.google.com/recaptcha/api.js?onload=pagekit_onRecaptchaLoad&render=explicit']
	    });
	
	    let resolveLoad;
	    const loadPromise = new Vue.Promise(resolve => {
	        resolveLoad = resolve;
	    });
	    window.pagekit_onRecaptchaLoad = () => {
	        let div = document.createElement('div');
	
	        document.body.appendChild(div);
	
	        grecaptcha.render(div, {
	            sitekey: config.grecaptcha,
	            callback: onSubmit,
	            'expired-callback': onExpire,
	            'error-callback': onError,
	            size: 'invisible'
	        });
	        resolveLoad();
	    };
	
	    Vue.http.interceptors.push(() => {
	
	        return {
	
	            request: request => {
	                if (!config.routes || request.method.toLowerCase() !== 'post' || !config.routes.some(route => {
	                    const exp = new RegExp(route.replace(/{.+?}/, '.+?'));
	                    return exp.test(request.url);
	                })) {
	                    return request;
	                }
	
	                return new Vue.Promise(
	                    (resolve, reject) => {
	                        requestResolve = (gRecaptchaResponse) => {
	                            grecaptcha.reset();
	                            request.data.gRecaptchaResponse = gRecaptchaResponse;
	                            resolve(request);
	                        };
	                        requestReject = (error) => {
	                            return reject({
	                                data: error
	                            });
	                        };
	
	                        loadPromise.then(() => grecaptcha.execute());
	                    }
	                )
	            }
	
	        };
	
	    });
	
	}
	
	function onSubmit(gRecaptchaResponse) {
	    requestResolve(gRecaptchaResponse);
	}
	
	function onExpire() {
	    requestReject('reCAPTCHA expired. Please try again.');  // TODO: Translation
	}
	
	function onError() {
	    requestReject('An error occured during reCAPTCHA execution. Please try again.'); // TODO: Translation
	}


/***/ }
/******/ ]);