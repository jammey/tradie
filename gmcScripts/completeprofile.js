$(document).on("pageinit", "#pageCompleteProfile", function (event, ui) {
    Ajax.getJson("GetStates", {}, function (data) {
        if (data.IsSuccess) {
            var res = data.Data;
            $("#pageCompleteProfile_selectState").append("<option value=''>" + PageMessage.SelectState + "</option>");
            for (var i = 0; i < res.length; i++) {
                $("#pageCompleteProfile_selectState").append("<option value='" + res[i].Id + "'>" + res[i].StateName + "</option>");
            }

            $("#pageCompleteProfile_selectState").selectmenu("refresh");
        } else {
            Messagebox.popup("Load States error");
        }
    });

    Ajax.getJson("GetCategories", {}, function (data) {
        if (data.IsSuccess) {
            var res = data.Data;
            for (var i = 0; i < res.length; i++) {
                $("#pageCompleteProfile_selectCategory").append("<option value='" + res[i].Id + "'>" + res[i].CategorieName + "</option>");
            }

            $("#pageCompleteProfile_selectCategory").selectmenu("refresh");
        } else {
            Messagebox.popup("Load Category error");
        }
    });

    $("#pageCompleteProfile_btnSkip").off("click").on("click", function () {
        $("#pageCompleteProfile_btnNext").trigger("click");
    });

    $("#pageCompleteProfile_btnNext").off("click").on("click", function () {
        var pageCompleteProfile_txtTradieNameEle = $("#pageCompleteProfile_txtTradieName");

        var pageCompleteProfile_txtTradieName = $.trim(pageCompleteProfile_txtTradieNameEle.val());
        var pageCompleteProfile_txtFirstName = $("#pageCompleteProfile_txtFirstName").val();
        var pageCompleteProfile_txtLastName = $("#pageCompleteProfile_txtLastName").val();
        var pageCompleteProfile_txtPostCode = $("#pageCompleteProfile_txtPostCode").val();
        var stateId = $("#pageCompleteProfile_selectState").val() || 0;
        var categoryIds = $("#pageCompleteProfile_selectCategory").val() ? ($("#pageCompleteProfile_selectCategory").val().toString() || "") : "";
        var description = $("#pageCompleteProfile_Surburb").val();

        if (!pageCompleteProfile_txtTradieNameEle.emptyValidate(WarningMessage.TradieNameReqired)) {
            return;
        }

        if (pageCompleteProfile_txtPostCode.length > 4) {
            Messagebox.popup("The postcode must be 4 bits");
            return;
        }

        Ajax.getJson("UpdateTradieProfile", {
            accountId: getCurrentAccountId(),
            tradieName: pageCompleteProfile_txtTradieName,
            firstName: pageCompleteProfile_txtFirstName,
            lastName: pageCompleteProfile_txtLastName,
            categoryIds: categoryIds,
            postCode: pageCompleteProfile_txtPostCode,
            stateId: stateId,
            description: description
        }, function (data) {
            if (data.IsSuccess) {
                setProfileToLocalStorege(pageCompleteProfile_txtTradieName,
                    pageCompleteProfile_txtFirstName,
                    pageCompleteProfile_txtLastName,
                    pageCompleteProfile_txtPostCode,
                    stateId, categoryIds, description);

                if ($("#coverDiv").css("display") == "block") {
                    $("#coverDiv").hide();
                }

                changePage("main.html");
            }
            else {
                Messagebox.popup(data.Message);
            }
        });
    });
});

$(document).on("pageshow", "#pageCompleteProfile", function (event, ui) {
    var isFirstRunReg = localStorage.getItem("t_isFirstRunReg");
    if (!isFirstRunReg || isFirstRunReg == "true") {
        showBubble("Hi mate :)<br>You can do this anytime,<br>from settings.", "gotcha", false, function () {
            $("#pageCompleteProfile_btnSkip").css("z-index", 10);
            localStorage.setItem("t_isFirstRunReg", "false");
        });
    }
});