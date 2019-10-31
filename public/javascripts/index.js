var githubUrlRoot = 'https://github.com/'
var composeUrl = getURLParameter('composeUrl')
if(composeUrl && composeUrl.startsWith(githubUrlRoot)) {
    $('#composeUrl').val(composeUrl.split('https://github.com/')[1]);
} else {
    $('#composeUrl').val(composeUrl);
}
var source   = document.getElementById("validation-result-template").innerHTML;
var template = Handlebars.compile(source);
$('#composeUrl').on('paste', function(e) {
    var $input = $(this)
    var text = e.originalEvent.clipboardData.getData('text');
    setTimeout(function () {
        $input.val(text.split('https://github.com/')[1])
    }, 100);
})
$('#validate-btn').on('click', function(event) {
    event.preventDefault()
    var pathSegments = $('#composeUrl').val().split('/');
    var organization = pathSegments[0]
    var repo = pathSegments[1]
    var composeRef = pathSegments[3]
    var composePath = pathSegments[4].replace('.yml', '')
    var strictCheck = $('#strictCheck').prop('checked')
    if(organization && repo && composePath && composeRef){
        var jqxhr = $.get( "/api/validate/" + organization + '/' + repo + '/' + composeRef + '/' + composePath + (strictCheck? '?strict=true' : ''))
            .done(function(response) {
                var html = template({repos: response});
                $('.validation-result div').html(html)
                $('.validation-result').show()
            })
            .fail(function(error) {
                if(error.responseJSON.message && error.responseJSON.message.status){
                    alert(error.responseJSON.message.status + ': ' + error.responseJSON.message.name)
                } else {
                    alert(error.status + ': ' + error.responseJSON.message)
                }
            })
    }
})
$('.validation-result').on('click', '.app-detail-btn', function(event){
    event.preventDefault()
    $a = $(event.target)
    window.location = '/dependencies/repo?composeUrl=' + $('#composeUrl').val() + '&appRepo=' + $a.data('appRepo') + '&release=' + $a.data('release');
})
function getURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}
