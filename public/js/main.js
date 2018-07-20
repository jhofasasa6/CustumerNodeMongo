
$(document).ready(function () {
    $('.deleteUser').click(function () {
        var confirmation = confirm('Are you Sure?');
        if (confirmation) {
            $.ajax({
                type: 'DELETE',
                url: '/users/delete/' + $(this).data('id')
            }).done(function (response) {
                if (response)
                    window.location.replace('/')
            });
        } else {
            return false;
        }
    });
});
