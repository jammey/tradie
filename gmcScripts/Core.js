var pageNumber = 10;
var messageTypeEnum = { Text: 0, Video: 1, Photo: 2 };
var settingStatus = { On: "on", Off: "off" };
var verifyCodeForResetPasswordStatus = { invalidCode: 0, codeExpired: 1, phoneNumberNotExisting: 2, success: 3 };
var socialBindMobileResponseStatus = { alreadyBindingMobile: 0, mobileIsExisted: 1, success: 2 };
var userProfileType = { normal: 0, social: 1 };
var noMessageItemHtml = "<div class=\"noItemClass\">You haven't any messages yet.</div>";

$(function () {
    $.mobile.page.prototype.options.domCache = false;
});

function Login(mobile, password, callBack) {
    Ajax.getJson("MobileLogin", { "phoneNumber": mobile, "password": password, "accountType": 1 }, function (data) {
        if (data.IsSuccess) {
            localStorage.setItem("t_account", data.Data.PhoneNumber);
            localStorage.setItem("t_accountId", data.Data.Id);
            localStorage.setItem("t_avatar", data.Data.Thumbnail);

            var tradie = data.Data.Tradie;
            setProfileToLocalStorege(tradie.TradieName, data.Data.FirstName, data.Data.LastName, tradie.PostCode,
                    data.Data.State ? data.Data.State.Id : "", tradie.CategoryIds, data.Data.Description);

            if ($.isFunction(callBack)) {
                callBack();
            }
        } else {
            Messagebox.popup(data.Message);
        }
    });
}

$(document).on("pageinit", "[data-role='page']", function () {
    $("#pageLoadingCount").val("0");
});

function checkLogin() {
    if (window.localStorage.getItem("t_account") == null || window.localStorage.getItem("t_accountId") == "") {
        return false;
    }

    return true;
}

function callServiceCallBack(buttonIndex) {
    if (buttonIndex == 2) {
        window.open('tel:4006997118', '_system');
    }
}

function closePopup(obj, id) {
    $(obj).parents("[data-role='page']").find("#" + id).popup("close");
}

function showBubbleOnTA() {
    showBubble('Please pick a customer<br> on map.<br><img src="Images/marker.png" style="width:16px;vertical-align:middle ">', "next", true, function () {
        showBubble('<br>You can change settings anytime.', "next", true, function () {
            $("#divMenuImg").hide();
            showBubble('<br>You can search out people anytime.', "next", true, function () {
                showBubble('<br>You can search out people anytime.', "Start", false, function () {
                }, function () {
                    $("#coverDiv_btn").attr("style", "background-color:#5dade2;border-color:#5dade2");
                });
            }, function () {

            });
        });
    });
}

function setProfileToLocalStorege(tradieName, firstName, lastName, postCode, stateId, categoryIds, description) {
    localStorage.setItem("t_tradieName", tradieName);
    localStorage.setItem("t_firstName", firstName);
    localStorage.setItem("t_lastName", lastName);
    localStorage.setItem("t_postCode", postCode);
    localStorage.setItem("t_stateId", stateId);
    localStorage.setItem("t_categoryIds", categoryIds);
    localStorage.setItem("t_description", description);
}

function clearLocalStorage() {
    localStorage.removeItem("t_tradieName");
    localStorage.removeItem("t_account");
    localStorage.removeItem("t_accountId");
    localStorage.removeItem("t_firstName");
    localStorage.removeItem("t_lastName");
    localStorage.removeItem("t_category");
    localStorage.removeItem("t_categoryId");
    localStorage.removeItem("t_postCode");
    localStorage.removeItem("t_stateId");
    localStorage.removeItem("t_categoryIds");
    localStorage.removeItem("t_description");
    localStorage.removeItem("t_hasBindMobile");
    localStorage.removeItem("t_avatar");
}

function getCustomerName(firstName, lastName) {
    return firstName && lastName ? firstName + " " + lastName
                    : PageMessage.DefaultCustomerName;
}

function getTradieName(tradieName) {
    return tradieName || PageMessage.DefaultTradieName;
}

function getUpdateProfileType(event) {
    var type = getUrlParam(event.target.baseURI, "type");

    if (type == "social") {
        type = updateProfileType.social;
    } else {
        type = updateProfileType.normal;
    }

    return type;
}